import { useTheme } from '@mezon/mobile-ui';
import { default as React, memo, useEffect } from 'react';
import { style } from './styles';

import { RTCView } from '@livekit/react-native-webrtc';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import InCallManager from 'react-native-incall-manager';
import Images from '../../../../../../../assets/Images';
import { useWebRTCStream } from '../../../../../../components/StreamContext/StreamContext';

interface IStreamingScreenProps {
	isAnimationComplete?: boolean;
}

export function StreamingScreen({ isAnimationComplete = true }: IStreamingScreenProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { isStream, isRemoteVideoStream, remoteStream } = useWebRTCStream();
	const { t } = useTranslation(['streamingRoom']);

	useEffect(() => {
		InCallManager.setSpeakerphoneOn(true);
	}, []);
	return (
		<View style={styles.container}>
			{remoteStream && isStream ? (
				<View style={styles.streamContainer}>
					{!isRemoteVideoStream && (
						<FastImage source={Images.RADIO_NCC8} style={styles.imageFullSize} resizeMode={isAnimationComplete ? 'contain' : 'cover'} />
					)}
					<RTCView streamURL={remoteStream?.toURL?.()} style={styles.rtcViewFlex} mirror={true} objectFit={'cover'} />
				</View>
			) : (
				<View style={styles.streamContainer}>
					<Text style={styles.errorText}>{t('noDisplay')}</Text>
				</View>
			)}
		</View>
	);
}

export const StreamingScreenComponent = memo(StreamingScreen);
