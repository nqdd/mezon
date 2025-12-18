import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import Sound from 'react-native-sound';
import { WAY_AUDIO } from '../../../../../../assets/lottie';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

const formatTime = (millis: number) => {
	const minutes = Math.floor(millis / 60000);
	const seconds = Math.floor((millis % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

interface IRenderAudioChatProps {
	audioURL: string;
	stylesContainerCustom?: ViewStyle;
	styleLottie?: ViewStyle;
	duration?: number; // Duration in seconds (optional)
}

const RenderAudioChat = React.memo(({ audioURL, stylesContainerCustom, styleLottie, duration }: IRenderAudioChatProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const recordingWaveRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [sound, setSound] = useState<Sound | null>(null);
	const [totalTime, setTotalTime] = useState(duration ? duration * 1000 : 0); // Initialize with prop if available
	const [remainingTime, setRemainingTime] = useState(duration ? duration * 1000 : 0);
	const soundRef = useRef<Sound | null>(null);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const isUploading = !audioURL?.includes('http');

	useEffect(() => {
		recordingWaveRef?.current?.reset();
		return () => {
			if (Platform.OS === 'android') {
				InCallManager.setSpeakerphoneOn(false);
				InCallManager.setForceSpeakerphoneOn(false);
			}
		};
	}, []);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const startTimer = useCallback(
		(duration: number) => {
			clearTimer();
			timerRef.current = setInterval(() => {
				if (soundRef.current) {
					soundRef.current.getCurrentTime((seconds) => {
						const currentMs = seconds * 1000;
						const remaining = Math.max(0, duration - currentMs);
						setRemainingTime(remaining);
					});
				}
			}, 500);
		},
		[clearTimer]
	);

	const playLoadedSound = useCallback(
		(soundToPlay: Sound, duration: number) => {
			if (Platform.OS === 'ios') {
				Sound.setCategory('Playback', true);
			}
			if (Platform.OS === 'android') {
				InCallManager.setSpeakerphoneOn(true);
				InCallManager.setForceSpeakerphoneOn(true);
			}
			soundToPlay.play((success) => {
				if (success) {
					soundToPlay.setCurrentTime(0);
					recordingWaveRef?.current?.reset();
					setIsPlaying(false);
					setRemainingTime(duration);
					clearTimer();
				}
			});
			setIsPlaying(true);
			startTimer(duration);
		},
		[clearTimer, startTimer]
	);

	const loadAndPlaySound = useCallback(() => {
		if (soundRef.current) {
			playLoadedSound(soundRef.current, totalTime);
			return;
		}

		setIsLoading(true);

		const newSound = new Sound(audioURL, '', (error) => {
			setIsLoading(false);

			if (error) {
				console.error('Failed to load sound:', error);
				return;
			}

			const soundDuration = duration ? duration * 1000 : newSound.getDuration() * 1000;
			setTotalTime(soundDuration);
			setRemainingTime(soundDuration);
			recordingWaveRef?.current?.play(0, 45);
			if (Platform.OS === 'ios') {
				newSound.setNumberOfLoops(0);
				newSound.setVolume(1.0);
			}

			soundRef.current = newSound;
			setSound(newSound);
			playLoadedSound(newSound, soundDuration);
		});
	}, [audioURL, duration, totalTime, playLoadedSound]);

	const handlePress = useCallback(() => {
		if (isLoading) return;

		if (isPlaying && sound) {
			sound.pause();
			recordingWaveRef?.current?.pause();
			setIsPlaying(false);
			clearTimer();
		} else if (sound) {
			playLoadedSound(sound, totalTime);
		} else {
			loadAndPlaySound();
		}
	}, [isLoading, isPlaying, sound, totalTime, loadAndPlaySound, playLoadedSound, clearTimer]);

	useEffect(() => {
		return () => {
			clearTimer();
			if (soundRef.current) {
				soundRef.current.stop();
				soundRef.current.release();
				soundRef.current = null;
			}
		};
	}, [clearTimer]);

	useEffect(() => {
		return () => {
			clearTimer();
			if (soundRef.current) {
				soundRef.current.stop();
				soundRef.current.release();
				soundRef.current = null;
				setSound(null);
				setTotalTime(0);
				setRemainingTime(0);
				setIsPlaying(false);
			}
		};
	}, [audioURL, clearTimer]);

	const renderPlayButton = () => {
		if (isLoading) {
			return <ActivityIndicator size="small" color="white" />;
		}
		if (isPlaying) {
			return <MezonIconCDN icon={IconCDN.pauseIcon} width={size.s_16} height={size.s_16} color={'white'} />;
		}
		return <MezonIconCDN icon={IconCDN.playIcon} width={size.s_16} height={size.s_16} color={'white'} />;
	};

	const getDisplayTime = () => {
		if (totalTime === 0) return '--:--';
		if (isPlaying || remainingTime < totalTime) {
			return formatTime(remainingTime);
		}
		return formatTime(totalTime);
	};

	return (
		<View style={[styles.wrapper, isUploading && { opacity: 0.6 }]}>
			<TouchableOpacity onPress={handlePress} activeOpacity={0.6} style={[styles.container, stylesContainerCustom]} disabled={isLoading}>
				<View style={styles.innerContainer}>
					<View style={styles.playButton}>{renderPlayButton()}</View>
					<LottieView source={WAY_AUDIO} ref={recordingWaveRef} resizeMode="cover" style={[styles.soundLottie, styleLottie]} />
					{isUploading ? (
						<ActivityIndicator size="small" color={baseColor.blurple} />
					) : (
						<Text style={styles.currentTime}>{getDisplayTime()}</Text>
					)}
				</View>
			</TouchableOpacity>
		</View>
	);
});

export default RenderAudioChat;
