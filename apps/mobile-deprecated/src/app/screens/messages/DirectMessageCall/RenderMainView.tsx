import { MediaStream, RTCIceCandidate } from '@livekit/react-native-webrtc';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectRemoteAudio, selectRemoteVideo } from '@mezon/store-mobile';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../constants/icon_cdn';
import AvatarCall from './AvatarCall';
import CallDuration from './CallDuration';
import RenderVideoStream from './RenderVideoStream';
import { style } from './styles';

interface CallState {
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	storedIceCandidates?: RTCIceCandidate[] | null;
}
interface IRenderMainViewProps {
	callState: CallState;
	isConnected: boolean;
	isAnswerCall: boolean;
	isOnLocalCamera: boolean;
	route?: any;
	isMirror: boolean;
	receiverAvatarProp?: string;
	receiverNameProp?: string;
}
export const RenderMainView = memo(
	({ callState, route, isAnswerCall, isConnected, isMirror, isOnLocalCamera, receiverAvatarProp, receiverNameProp }: IRenderMainViewProps) => {
		const { themeValue } = useTheme();
		const isRemoteVideo = useSelector(selectRemoteVideo);
		const isRemoteAudio = useSelector(selectRemoteAudio);
		const receiverAvatar = route?.params?.receiverAvatar || receiverAvatarProp;
		const receiverName = route?.params?.receiverName || receiverNameProp;
		const styles = style(themeValue);
		const { t } = useTranslation(['dmMessage']);

		return (
			<View style={styles.flexContainer}>
				{callState.remoteStream && isRemoteVideo && isConnected ? (
					<View style={styles.flexContainer}>
						<RenderVideoStream stream={callState?.remoteStream} mirror={false} />
						{!isRemoteAudio && (
							<View style={styles.mutedAudioContainer}>
								<MezonIconCDN icon={IconCDN.microphoneDenyIcon} width={size.s_18} height={size.s_18} color={themeValue.text} />
								<Text style={styles.mutedAudioText}>
									{receiverName || ''} {t('turnedMicOff')}
								</Text>
							</View>
						)}
					</View>
				) : (
					<View>
						<AvatarCall
							receiverAvatar={receiverAvatar}
							receiverName={receiverName}
							isAnswerCall={isAnswerCall}
							isConnected={isConnected}
						/>
						<View style={isRemoteAudio ? styles.mutedAudioAvatarContainerHidden : styles.mutedAudioAvatarContainerVisible}>
							<MezonIconCDN icon={IconCDN.microphoneDenyIcon} width={size.s_18} height={size.s_18} color={themeValue.text} />
							<Text style={styles.mutedAudioText}>
								{receiverName || ''} {t('turnedMicOff')}
							</Text>
						</View>
					</View>
				)}
				{isConnected && (
					<View style={callState.remoteStream && isRemoteVideo ? styles.callDurationTopVideo : styles.callDurationTopAvatar}>
						<CallDuration isConnected={isConnected} />
					</View>
				)}
				{callState.localStream && isOnLocalCamera ? (
					<View style={styles.cardMyVideoCall}>
						<RenderVideoStream stream={callState?.localStream} mirror={isMirror} isLocal={true} />
					</View>
				) : (
					<View />
				)}
			</View>
		);
	}
);
