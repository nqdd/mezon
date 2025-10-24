import React from 'react';
import { StyleProp, ViewStyle, requireNativeComponent } from 'react-native';

const COMPONENT_NAME = 'FastNativeImageView';

const FastNativeImageView = requireNativeComponent(COMPONENT_NAME);

interface ImageSource {
	uri: string;
	priority?: 'low' | 'normal' | 'high';
}

interface FastNativeImageProps {
	source: ImageSource;
	resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
	style?: StyleProp<ViewStyle>;
	placeholder?: string;
	onLoadStart?: () => void;
	onLoad?: (event: {
		nativeEvent: {
			width: number;
			height: number;
			cacheType: string;
		};
	}) => void;
	onError?: (event: { nativeEvent: { error: string } }) => void;
}

export const FastNativeImage: React.FC<FastNativeImageProps> = (props) => {
	return <FastNativeImageView {...props} />;
};
