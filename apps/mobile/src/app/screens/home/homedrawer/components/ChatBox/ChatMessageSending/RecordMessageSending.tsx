import { useChatSending } from '@mezon/core';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { selectChannelById, selectDmGroupCurrent } from '@mezon/store';
import { useAppSelector } from '@mezon/store-mobile';
import { sleep } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, InteractionManager, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { usePermission } from '../../../../../../hooks/useRequestPermission';
import { style } from '../ChatBoxBottomBar/style';

interface IRecordMessageSendingProps {
	mode: ChannelStreamMode;
	channelId: string;
	currentTopicId?: string;
	isCreateTopic?: boolean;
	anonymousMode?: boolean;
}

export const RecordMessageSending = memo(
	({ channelId, mode, currentTopicId = '', isCreateTopic = false, anonymousMode }: IRecordMessageSendingProps) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);

		const [isRecording, setIsRecording] = useState(false);
		const translateX = useSharedValue(0);
		const scale = useSharedValue(1);
		const isLongPressed = useSharedValue(false);
		const hasTriggeredCancel = useSharedValue(false);
		const startTime = useSharedValue(0);
		const { requestMicrophonePermission } = usePermission();
		const { t } = useTranslation(['recordChatMessage', 'common']);
		const audioRecorderPlayerRef = useRef<AudioRecorderPlayer | null>(null);
		const recordingStartTimeRef = useRef<number>(0);
		const recordingDurationRef = useRef<number>(0);

		const getAudioRecorderPlayer = useCallback(() => {
			if (!audioRecorderPlayerRef.current) {
				audioRecorderPlayerRef.current = new AudioRecorderPlayer();
			}
			return audioRecorderPlayerRef.current;
		}, []);

		const currentChannel = useAppSelector((state) => selectChannelById(state, channelId || ''));
		const currentDmGroup = useSelector(selectDmGroupCurrent(channelId));

		const channelOrDirect =
			mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD ? currentChannel : currentDmGroup;
		const { sendMessage } = useChatSending({
			mode,
			channelOrDirect,
			fromTopic: isCreateTopic || !!currentTopicId
		});

		const getPermissions = async () => {
			try {
				const granted = await requestMicrophonePermission();

				if (!granted) {
					Toast.show({
						type: 'error',
						text1: t('common:permissionNotification.permissionRequired'),
						text2: t('common:permissionNotification.microphoneRequiredDesc')
					});
					return false;
				}
				return true;
			} catch (error) {
				console.error('Error requesting permissions:', error);
				return false;
			}
		};

		const startRecording = async () => {
			try {
				const isPermissionGranted = await getPermissions();
				if (!isPermissionGranted) {
					return;
				}
				isLongPressed.value = true;
				scale.value = withSpring(3, { damping: 10, stiffness: 100 });
				hasTriggeredCancel.value = false;
				const dirs = RNFetchBlob.fs.dirs;
				const path = Platform.select({
					android: `${dirs.CacheDir}/sound.mp3`
				});
				const audioRecorderPlayer = getAudioRecorderPlayer();
				await audioRecorderPlayer.startRecorder(path);
				await sleep(300);
				recordingStartTimeRef.current = Date.now();
				DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_RECORD_PROCESSING, { show: true });
				setIsRecording(true);
			} catch (error) {
				console.error('Failed to start recording:', error);
			}
		};
		const normalizeFilePath = (path: string) => {
			return path.replace(/^file:\/*/, 'file:///');
		};

		const getAudioFileInfo = useCallback(async (uri: string, durationInMs: number) => {
			try {
				const fixedPath = normalizeFilePath(uri);
				const fileInfo = await RNFS.stat(fixedPath);
				if (fileInfo?.path) {
					const fileData = {
						filename: uri.split('/').pop(),
						size: fileInfo.size,
						filetype: 'audio/mp3',
						url: fileInfo.path,
						duration: Math.floor(durationInMs / 1000)
					};

					return [fileData];
				} else {
					return null;
				}
			} catch (error) {
				return null;
			}
		}, []);

		const stopRecording = useCallback(async () => {
			try {
				const recordingUrl = await audioRecorderPlayerRef?.current?.stopRecorder();
				if (!recordingUrl) return;

				const recordingEndTime = Date.now();
				const durationInMs = recordingEndTime - recordingStartTimeRef.current;
				recordingDurationRef.current = durationInMs;

				InteractionManager.runAfterInteractions(async () => {
					try {
						const attachments = await getAudioFileInfo(recordingUrl, durationInMs);
						if (!attachments) return;
						await sendMessage({ t: '' }, [], attachments, undefined, anonymousMode && !currentDmGroup, false, true);
						setIsRecording(false);
						DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_RECORD_PROCESSING, { show: false });
					} catch (error) {
						console.error('Failed to send message:', error);
						DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
						Toast.show({
							type: 'error',
							text1: t('common:error'),
							text2: t('common:failedToSendMessage')
						});
					}
				});

				setIsRecording(false);
				DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_RECORD_PROCESSING, { show: false });
			} catch (error) {
				console.error('Failed to prepare message:', error);
				Toast.show({
					type: 'error',
					text1: t('common:error'),
					text2: t('common:failedToSendMessage')
				});

				setIsRecording(false);
				DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_RECORD_PROCESSING, { show: false });
			}
		}, [anonymousMode, currentDmGroup, getAudioFileInfo, sendMessage, t]);

		const cancelRecording = async () => {
			await audioRecorderPlayerRef?.current?.stopRecorder();
			audioRecorderPlayerRef?.current?.removeRecordBackListener();
			setIsRecording(false);
			DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_RECORD_PROCESSING, { show: false });
		};

		useEffect(() => {
			return () => {
				audioRecorderPlayerRef?.current?.stopRecorder();
				audioRecorderPlayerRef?.current?.removeRecordBackListener();
			};
		}, []);

		const animatedStyle = useAnimatedStyle(() => ({
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			transform: [{ translateX: translateX.value }, { scale: scale.value }],
			backgroundColor: isRecording ? baseColor.blurple : isLongPressed.value ? themeValue.tertiary : themeValue.tertiary
		}));

		const longPressGesture = Gesture.LongPress()
			.minDuration(400)
			.onStart(() => {
				startTime.value = Date.now();
				runOnJS(startRecording)();
			})
			.onEnd(() => {
				if (isLongPressed.value && !hasTriggeredCancel.value) {
					runOnJS(stopRecording)();
				}
				translateX.value = withSpring(0);
				scale.value = withSpring(1);
				isLongPressed.value = false;
				runOnJS(setIsRecording)(false);
			});

		const panGesture = Gesture.Pan()
			.minDistance(0)
			.onUpdate((event) => {
				if (isLongPressed.value) {
					translateX.value = event.translationX;
					if (event.translationX < -5 && !hasTriggeredCancel.value) {
						hasTriggeredCancel.value = true;
						runOnJS(cancelRecording)();
					}
				}
			});

		const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

		return (
			<GestureDetector gesture={composedGesture}>
				<Animated.View style={[styles.btnIcon, styles.iconVoice, animatedStyle]}>
					<MezonIconCDN icon={IconCDN.microphoneIcon} width={size.s_18} height={size.s_18} color={themeValue.textStrong} />
				</Animated.View>
			</GestureDetector>
		);
	}
);
