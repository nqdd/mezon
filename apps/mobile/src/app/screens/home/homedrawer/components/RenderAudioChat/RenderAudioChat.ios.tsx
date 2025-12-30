import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-sound';
import TrackPlayer, {
	Capability,
	Event,
	IOSCategory,
	IOSCategoryMode,
	State,
	useActiveTrack,
	usePlaybackState,
	useProgress
} from 'react-native-track-player';
import { WAY_AUDIO } from '../../../../../../assets/lottie';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

// Enable react-native-sound playback in silence mode
Sound.setCategory('Playback');

// Use a promise to ensure only one initialization happens
let playerSetupPromise: Promise<void> | null = null;

const initializePlayer = async () => {
	if (playerSetupPromise) {
		return playerSetupPromise;
	}

	playerSetupPromise = (async () => {
		try {
			await TrackPlayer.setupPlayer({
				waitForBuffer: true,
				autoHandleInterruptions: true,
				iosCategory: IOSCategory.Playback,
				iosCategoryMode: IOSCategoryMode.Default
			});
			await TrackPlayer.updateOptions({
				capabilities: [Capability.Play, Capability.Pause, Capability.Stop, Capability.SeekTo],
				compactCapabilities: [Capability.Play, Capability.Pause],
				progressUpdateEventInterval: 1
			});
		} catch (error) {
			// If setup fails or player already initialized, continue
		}
	})();

	return playerSetupPromise;
};

const formatTime = (millis: number) => {
	const minutes = Math.floor(millis / 60000);
	const seconds = Math.floor((millis % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

interface IRenderAudioChatProps {
	audioURL: string;
	stylesContainerCustom?: ViewStyle;
	styleLottie?: ViewStyle;
	duration?: number;
}

const RenderAudioChat = React.memo(({ audioURL, stylesContainerCustom, styleLottie, duration }: IRenderAudioChatProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const recordingWaveRef = useRef(null);
	const soundRef = useRef<Sound | null>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);
	const [isPlayingSound, setIsPlayingSound] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [totalDuration, setTotalDuration] = useState(duration || 0);

	const isUploading = !audioURL?.includes('http');
	const playbackState = usePlaybackState();
	const progress = useProgress();
	const activeTrack = useActiveTrack();

	const isThisTrackActive = activeTrack?.url === audioURL;
	const isCurrentlyPlaying = playbackState.state === State.Playing || playbackState.state === State.Buffering;
	const isPlayingTrackPlayer = isThisTrackActive && isCurrentlyPlaying;
	const isPlaying = useFallbackPlayer ? isPlayingSound : isPlayingTrackPlayer;

	useEffect(() => {
		initializePlayer();
		recordingWaveRef?.current?.reset();
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
					// Ignore cleanup errors
				}

				if (progressIntervalRef.current) {
					clearInterval(progressIntervalRef.current);
				}
				if (soundRef.current) {
					soundRef.current.stop(() => {
						soundRef.current?.release();
						soundRef.current = null;
					});
				}
			};
			cleanup();
		};
	}, [audioURL]);

	useEffect(() => {
		const shouldPlay = (useFallbackPlayer && isPlayingSound) || (isThisTrackActive && isPlayingTrackPlayer);
		const shouldReset = !isThisTrackActive && !useFallbackPlayer;

		if (shouldPlay) {
			recordingWaveRef?.current?.play(0, 45);
		} else {
			recordingWaveRef?.current?.pause();
			if (shouldReset) {
				recordingWaveRef?.current?.reset();
			}
		}
	}, [isPlayingTrackPlayer, isThisTrackActive, isPlayingSound, useFallbackPlayer]);

	useEffect(() => {
		if (!isThisTrackActive) {
			recordingWaveRef?.current?.reset();
		}
	}, [isThisTrackActive]);

	useEffect(() => {
		const listener = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
			try {
				await TrackPlayer.seekTo(0);
				if (isThisTrackActive) {
					recordingWaveRef?.current?.reset();
				}
			} catch (error) {
				// Ignore errors
			}
		});

		return () => listener.remove();
	}, [isThisTrackActive]);

	const loadTrack = useCallback(async () => {
		setIsLoading(true);
		try {
			await initializePlayer();
			await TrackPlayer.reset();
			await TrackPlayer.add({
				url: audioURL,
				title: 'Audio Message',
				artist: 'Mezon',
				duration: duration || undefined
			});
		} catch (error) {
			console.error('log => error loadTrack: ', error);
		} finally {
			setIsLoading(false);
		}
	}, [audioURL, duration]);

	const startProgressInterval = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		progressIntervalRef.current = setInterval(() => {
			soundRef.current?.getCurrentTime(setCurrentTime);
		}, 100);
	}, []);

	const stopProgressInterval = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
			progressIntervalRef.current = null;
		}
	}, []);

	const loadSoundFallback = useCallback(
		() =>
			new Promise<Sound>((resolve, reject) => {
				const sound = new Sound(audioURL, '', (error) => {
					if (error) {
						reject(error);
						return;
					}
					setTotalDuration(sound.getDuration());
					resolve(sound);
				});
			}),
		[audioURL]
	);

	const resetSoundPlayback = useCallback(() => {
		setIsPlayingSound(false);
		setCurrentTime(0);
		stopProgressInterval();
		recordingWaveRef?.current?.reset();
		soundRef.current?.setCurrentTime(0);
	}, [stopProgressInterval]);

	const handlePressSoundFallback = useCallback(async () => {
		try {
			if (soundRef.current) {
				if (isPlayingSound) {
					soundRef.current.pause();
					setIsPlayingSound(false);
					stopProgressInterval();
				} else {
					soundRef.current.play((success) => {
						if (success) {
							resetSoundPlayback();
						}
					});
					setIsPlayingSound(true);
					startProgressInterval();
				}
			} else {
				setIsLoading(true);
				const sound = await loadSoundFallback();
				soundRef.current = sound;

				sound.play((success) => {
					if (success) {
						resetSoundPlayback();
					} else {
						setIsPlayingSound(false);
						stopProgressInterval();
					}
				});

				setIsPlayingSound(true);
				setIsLoading(false);
				startProgressInterval();
			}
		} catch (error) {
			setIsLoading(false);
			setIsPlayingSound(false);
		}
	}, [isPlayingSound, loadSoundFallback, startProgressInterval, stopProgressInterval, resetSoundPlayback]);

	const handlePress = useCallback(async () => {
		if (isLoading || isUploading) return;

		if (useFallbackPlayer) {
			await handlePressSoundFallback();
			return;
		}

		try {
			if (isThisTrackActive) {
				if (isPlayingTrackPlayer) {
					await TrackPlayer.pause();
				} else {
					await TrackPlayer.play();
				}
			} else {
				await loadTrack();

				// Retry checking state up to 5 times if still loading
				let retries = 5;
				let state = await TrackPlayer.getPlaybackState();

				while (retries > 0 && state.state !== 'error' && state.state !== 'ready') {
					await new Promise((resolve) => setTimeout(resolve, 200));
					state = await TrackPlayer.getPlaybackState();
					retries--;
				}
				if (state.state === 'error') {
					setUseFallbackPlayer(true);
					await handlePressSoundFallback();
					return;
				}

				await TrackPlayer.play();
			}
		} catch (error) {
			// Ignore errors
		}
	}, [isLoading, isUploading, isThisTrackActive, isPlayingTrackPlayer, loadTrack, useFallbackPlayer, handlePressSoundFallback]);

	const renderPlayButton = () => {
		if (isLoading) {
			return <ActivityIndicator size="small" color="white" />;
		}
		if (isPlaying) {
			return <MezonIconCDN icon={IconCDN.pauseIcon} width={size.s_16} height={size.s_16} color="white" />;
		}
		return <MezonIconCDN icon={IconCDN.playIcon} width={size.s_16} height={size.s_16} color="white" />;
	};

	const getDisplayTime = () => {
		if (useFallbackPlayer) {
			if (totalDuration === 0) return '--:--';
			const remaining = totalDuration - currentTime;
			return isPlayingSound || currentTime > 0 ? formatTime(Math.max(0, remaining * 1000)) : formatTime(totalDuration * 1000);
		}

		if (isThisTrackActive) {
			const trackDuration = progress.duration || duration || 0;
			if (trackDuration === 0) return '--:--';

			const currentPosition = progress.position || 0;
			const remaining = trackDuration - currentPosition;
			return isPlayingTrackPlayer || currentPosition > 0 ? formatTime(Math.max(0, remaining * 1000)) : formatTime(trackDuration * 1000);
		}

		const trackDuration = duration || 0;
		return trackDuration === 0 ? '--:--' : formatTime(trackDuration * 1000);
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
