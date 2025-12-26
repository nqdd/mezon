import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import TrackPlayer, {
	Capability,
	Event,
	State,
	useActiveTrack,
	usePlaybackState,
	useProgress
} from 'react-native-track-player';
import { WAY_AUDIO } from '../../../../../../assets/lottie';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

let isPlayerInitialized = false;
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
	const [isLoading, setIsLoading] = useState(false);
	const [totalDuration, setTotalDuration] = useState(duration || 0);
	const isUploading = !audioURL?.includes('http');
	const playbackState = usePlaybackState();
	const progress = useProgress();
	const activeTrack = useActiveTrack();
	const isThisTrackActive = activeTrack?.url === audioURL;
	const isPlaying = isThisTrackActive && playbackState.state === State.Playing;
	useEffect(() => {
		const setupPlayer = async () => {
			if (isPlayerInitialized) return;

			try {
				await TrackPlayer.setupPlayer();
				await TrackPlayer.updateOptions({
					capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
					compactCapabilities: [Capability.Play, Capability.Pause]
				});
				isPlayerInitialized = true;
			} catch (error) {
				// Player might already be initialized, which is fine
			}
		};

		setupPlayer();

		recordingWaveRef?.current?.reset();
		return () => {
			if (Platform.OS === 'android') {
				InCallManager.setSpeakerphoneOn(false);
				InCallManager.setForceSpeakerphoneOn(false);
			}
		};
	}, []);

	useEffect(() => {
		return () => {
			const cleanup = async () => {
				try {
					const currentTrack = await TrackPlayer.getActiveTrack();
					if (currentTrack?.url === audioURL) {
						await TrackPlayer.reset();
					}
				} catch (error) {
					console.error('Error cleaning up TrackPlayer:', error);
				}
			};
			cleanup();
		};
	}, [audioURL]);

	useEffect(() => {
		if (isPlaying) {
			recordingWaveRef?.current?.play(0, 45);
		} else {
			recordingWaveRef?.current?.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		const listener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
			try {
				await TrackPlayer.seekTo(0);
				recordingWaveRef?.current?.reset();
			} catch (error) {
				console.error('Error resetting track:', error);
			}
		});

		return () => {
			listener.remove();
		};
	}, []);

	const loadTrack = useCallback(async () => {
		setIsLoading(true);
		try {
			await TrackPlayer.reset();

			const track = {
				url: audioURL,
				title: 'Audio Message',
				artist: 'Mezon',
				duration: duration || undefined
			};

			await TrackPlayer.add(track);

			if (!duration) {
				const trackInfo = await TrackPlayer.getActiveTrack();
				if (trackInfo?.duration) {
					setTotalDuration(trackInfo.duration);
				}
			}
		} catch (error) {
			console.error('Error loading track:', error);
		} finally {
			setIsLoading(false);
		}
	}, [audioURL, duration]);

	const handlePress = useCallback(async () => {
		if (isLoading || isUploading) return;

		try {
			if (isThisTrackActive) {
				if (isPlaying) {
					await TrackPlayer.pause();
				} else {
					if (Platform.OS === 'android') {
						InCallManager.setSpeakerphoneOn(true);
						InCallManager.setForceSpeakerphoneOn(true);
					}
					await TrackPlayer.play();
				}
			} else {
				await loadTrack();

				if (Platform.OS === 'android') {
					InCallManager.setSpeakerphoneOn(true);
					InCallManager.setForceSpeakerphoneOn(true);
				}

				await TrackPlayer.play();
			}
		} catch (error) {
			console.error('Error handling playback:', error);
		}
	}, [isLoading, isUploading, isThisTrackActive, isPlaying, loadTrack]);

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
		const duration = isThisTrackActive ? progress.duration || totalDuration : totalDuration;

		if (duration === 0) return '--:--';

		const currentPosition = isThisTrackActive ? progress.position : 0;
		const remaining = duration - currentPosition;

		if (isThisTrackActive && (isPlaying || currentPosition > 0)) {
			return formatTime(Math.max(0, remaining * 1000));
		}

		return formatTime(duration * 1000);
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
