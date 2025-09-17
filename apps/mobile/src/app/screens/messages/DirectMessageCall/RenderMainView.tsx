import type { MediaStream, RTCIceCandidate } from '@livekit/react-native-webrtc';
import { useTheme } from '@mezon/mobile-ui';
import { selectRemoteVideo } from '@mezon/store-mobile';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import AvatarCall from './AvatarCall';
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
	route: any;
	isMirror: boolean;
}
export const RenderMainView = memo(({ callState, route, isAnswerCall, isConnected, isMirror, isOnLocalCamera }: IRenderMainViewProps) => {
	const { themeValue } = useTheme();
	const isRemoteVideo = useSelector(selectRemoteVideo);
	const receiverAvatar = route?.params?.receiverAvatar;
	const receiverName = route?.params?.receiverName;
	const styles = style(themeValue);

	return (
		<View style={{ flex: 1 }}>
			{callState.remoteStream && isRemoteVideo && isConnected ? (
				<View style={{ flex: 1 }}>
					<RenderVideoStream stream={callState?.remoteStream} mirror={false} />
				</View>
			) : (
				<AvatarCall receiverAvatar={receiverAvatar} receiverName={receiverName} isAnswerCall={isAnswerCall} isConnected={isConnected} />
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
});
