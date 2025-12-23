import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { createStyles } from './PanelKeyboard.styles';
import AdvancedFunction from './components/AdvancedFunction';
import Gallery from './components/AttachmentPicker/Gallery';
import HeaderAttachmentPicker from './components/AttachmentPicker/HeaderAttachmentPicker';
import EmojiPicker from './components/EmojiPicker';
import type { EMessageActionType } from './enums';
import type { IMessageActionNeedToResolve } from './types';

interface IProps {
	directMessageId?: string;
	currentChannelId: string;
	currentClanId: string;
	messageAction?: EMessageActionType;
}
const PanelKeyboard = React.memo((props: IProps) => {
	const { themeValue } = useTheme();
	const [typeKeyboardBottomSheet, setTypeKeyboardBottomSheet] = useState<string>('text');
	const bottomPickerRef = useRef<BottomSheetModal>(null);
	const typeKeyboardBottomSheetRef = useRef<string>(null);
	const heightKeyboardShowRef = useRef<number>(0);
	const [messageActionNeedToResolve, setMessageActionNeedToResolve] = useState<IMessageActionNeedToResolve | null>(null);
	const spacerHeightAnim = useRef(new Animated.Value(0)).current;

	const styles = useMemo(() => createStyles(themeValue), [themeValue]);

	useEffect(() => {
		const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
		const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

		const showSub = Keyboard.addListener(showEvent, (e) => {
			const height = e?.endCoordinates?.height ?? 0;
			heightKeyboardShowRef.current = height;
			bottomPickerRef?.current?.present();

			Animated.timing(spacerHeightAnim, {
				toValue: height,
				duration: 200,
				useNativeDriver: false
			}).start();
		});

		const hideSub = Keyboard.addListener(hideEvent, () => {
			if (typeKeyboardBottomSheetRef.current !== 'text') {
				return;
			}
			Animated.timing(spacerHeightAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: false
			}).start();
		});

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, [spacerHeightAnim]);

	const onShowKeyboardBottomSheet = useCallback(
		async (isShow: boolean, type?: string) => {
			const keyboardHeight = heightKeyboardShowRef.current ? heightKeyboardShowRef.current : Platform.OS === 'ios' ? 365 : 300;
			if (isShow) {
				typeKeyboardBottomSheetRef.current = type;
				setTypeKeyboardBottomSheet(type);
				heightKeyboardShowRef.current = keyboardHeight;
				Animated.timing(spacerHeightAnim, {
					toValue: keyboardHeight,
					duration: 200,
					useNativeDriver: false
				}).start();
				bottomPickerRef?.current?.present();
				Keyboard.dismiss();
			} else if (!isShow && typeKeyboardBottomSheetRef.current !== 'text' && (type !== 'text' || type === 'force')) {
				bottomPickerRef?.current?.dismiss();
				bottomPickerRef?.current?.close();
				Animated.timing(spacerHeightAnim, {
					toValue: 0,
					duration: 200,
					useNativeDriver: false
				}).start(() => {
					heightKeyboardShowRef.current = 0;
					setTypeKeyboardBottomSheet('text');
				});
			} else if (!isShow) {
				bottomPickerRef?.current?.dismiss();
				bottomPickerRef?.current?.close();
			}
		},
		[spacerHeightAnim]
	);

	useEffect(() => {
		const eventListener = DeviceEventEmitter.addListener(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, ({ isShow = false, mode = '' }) => {
			onShowKeyboardBottomSheet(isShow, mode as string);
		});

		return () => {
			eventListener.remove();
		};
	}, [onShowKeyboardBottomSheet]);

	const onClose = useCallback(
		(isFocusKeyboard = true) => {
			onShowKeyboardBottomSheet(false, 'text');
			isFocusKeyboard && DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, {});
		},
		[onShowKeyboardBottomSheet]
	);

	useEffect(() => {
		const showKeyboard = DeviceEventEmitter.addListener(ActionEmitEvent.SHOW_KEYBOARD, (value) => {
			setMessageActionNeedToResolve(value);
		});
		return () => {
			showKeyboard.remove();
		};
	}, []);

	const handleSheetChange = (index: number) => {
		if (index === -1) {
			setTypeKeyboardBottomSheet('text');
			DeviceEventEmitter.emit(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, { isShow: false, mode: 'text' });
		}
	};

	return (
		<>
			<Animated.View style={[styles.spacerView, { height: spacerHeightAnim }]}>
				<LinearGradient
					start={{ x: 1, y: 0 }}
					end={{ x: 0, y: 0 }}
					colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
					style={StyleSheet.absoluteFillObject}
				/>
			</Animated.View>
			<BottomSheetModal
				ref={bottomPickerRef}
				snapPoints={[heightKeyboardShowRef.current ? heightKeyboardShowRef.current : 1, Platform.OS === 'ios' ? '95%' : '100%']}
				index={0}
				animateOnMount
				animationConfigs={{
					duration: 200
				}}
				handleComponent={() => (
					<View style={styles.handleIndicatorContainer}>
						<LinearGradient
							start={{ x: 1, y: 0 }}
							end={{ x: 0, y: 0 }}
							colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
							style={[StyleSheet.absoluteFillObject]}
						/>
						<View style={styles.handleIndicator} />
					</View>
				)}
				backdropComponent={null}
				enableDynamicSizing={false}
				enablePanDownToClose={true}
				onChange={handleSheetChange}
			>
				<LinearGradient
					start={{ x: 1, y: 0 }}
					end={{ x: 0, y: 0 }}
					colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
					style={[StyleSheet.absoluteFillObject]}
				/>
				<BottomSheetScrollView
					scrollEnabled={typeKeyboardBottomSheet !== 'attachment'}
					stickyHeaderIndices={[0]}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={typeKeyboardBottomSheet === 'emoji' ? styles.scrollViewContentFlex : undefined}
				>
					{typeKeyboardBottomSheet === 'attachment' ? (
						<View>
							<HeaderAttachmentPicker
								onCancel={onClose}
								messageAction={props?.messageAction}
								currentChannelId={props?.currentChannelId}
							/>
							<Gallery currentChannelId={props?.currentChannelId} />
						</View>
					) : typeKeyboardBottomSheet === 'emoji' ? (
						<EmojiPicker
							onDone={onClose}
							bottomSheetRef={bottomPickerRef}
							directMessageId={props?.directMessageId || ''}
							messageActionNeedToResolve={messageActionNeedToResolve}
							channelId={props?.currentChannelId}
							messageAction={props?.messageAction}
						/>
					) : typeKeyboardBottomSheet === 'advanced' ? (
						<AdvancedFunction
							onClose={onClose}
							messageAction={props?.messageAction}
							directMessageId={props?.directMessageId || ''}
							currentChannelId={props?.currentChannelId}
						/>
					) : null}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
});
export default PanelKeyboard;
