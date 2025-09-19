import { RTCView } from '@livekit/react-native-webrtc';
import React from 'react';

interface IRenderVideoViewProps {
	stream: any;
	mirror: boolean;
	isLocal?: boolean;
}

const RenderVideoStream = ({ stream, mirror = false, isLocal = false }: IRenderVideoViewProps) => {
	const getURL = (stream) => {
		try {
			if (!stream) return null;

			const videoTracks = stream.getVideoTracks();
			if (videoTracks.length === 0) return null;

			const videoOnlyStream: any = new MediaStream(videoTracks);
			return videoOnlyStream?.toURL?.();
		} catch (error) {
			return null;
		}
	};

	return (
		<RTCView
			streamURL={getURL(stream)}
			style={{ flex: 1, zIndex: isLocal ? 2 : 1 }}
			mirror={mirror}
			objectFit={'cover'}
			zOrder={isLocal ? 2 : 1}
		/>
	);
};

export default React.memo(RenderVideoStream);
