import { ActionEmitEvent } from '@mezon/mobile-components';
import { size } from '@mezon/mobile-ui';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, Platform, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { RenderVideoIOS } from './RenderVideoIOS';
import { styles } from './styles';

export const RenderVideoDetail = React.memo(({ route }: { route: any }) => {
	const videoURL = route?.params?.videoURL as string;
	const videoRef = useRef(null);
	const [isBuffering, setIsBuffering] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isReadyDisplay, setIsReadyDisplay] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsReadyDisplay(true);
		}, 200);
		return () => {
			clearTimeout(timer);
		};
	}, []);

	const handleClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
		setIsBuffering(isBuffering);
	};

	const renderVideoPlayer = () => {
		return Platform.OS === 'ios' ? (
			<RenderVideoIOS videoURL={videoURL} />
		) : (
			<Video
				ref={videoRef}
				source={{
					uri: videoURL,
					headers: {
						'Cache-Control': 'max-age=3600, public',
						'Accept-Encoding': 'gzip, deflate'
					},
					shouldCache: true
				}}
				style={styles.videoFullSize}
				resizeMode="contain"
				controls={true}
				paused={false}
				disableFocus={true}
				muted={false}
				bufferConfig={{
					minBufferMs: 3000,
					maxBufferMs: 10000,
					bufferForPlaybackMs: 2000,
					bufferForPlaybackAfterRebufferMs: 3000
				}}
				maxBitRate={3000000}
				onBuffer={onBuffer}
				onReadyForDisplay={() => {
					setIsPlaying(true);
					setIsBuffering(false);
				}}
				enterPictureInPictureOnLeave={true}
				ignoreSilentSwitch="ignore"
				mixWithOthers="mix"
				playWhenInactive={true}
				playInBackground={true}
				controlsStyles={{
					hidePosition: false,
					hidePlayPause: false,
					hideForward: true,
					hideRewind: false,
					hideNext: false,
					hidePrevious: false,
					hideFullscreen: false,
					hideSeekBar: false,
					hideDuration: false,
					hideNavigationBarOnFullScreenMode: true,
					hideNotificationBarOnFullScreenMode: true,
					hideSettingButton: true,
					seekIncrementMS: 10000,
					liveLabel: 'LIVE'
				}}
			/>
		);
	};

	return (
		<View style={styles.container}>
			{!!videoURL && isReadyDisplay && renderVideoPlayer()}

			<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
				<MezonIconCDN icon={IconCDN.closeIcon} height={size.s_40} width={size.s_40} />
			</TouchableOpacity>

			{(isBuffering || !isPlaying) && Platform.OS === 'android' && <ActivityIndicator style={styles.loadingIndicator} />}
		</View>
	);
});
