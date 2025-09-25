import React from 'react';
import { requireNativeComponent } from 'react-native';

const VideoPlayerView = requireNativeComponent('VideoPlayerView');

export const RenderVideoIOS = React.memo(({ videoURL }: { videoURL: string }) => {
	return <VideoPlayerView style={{ width: '100%', height: '100%' }} source={videoURL} />;
});
