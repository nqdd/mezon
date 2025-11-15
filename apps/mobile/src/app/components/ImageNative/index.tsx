import React, { memo } from 'react';
import type { ViewProps } from 'react-native';
import { Platform, requireNativeComponent } from 'react-native';
import CachedImageWithRetryIOS from './CachedImageWithRetryIOS';

interface CustomImageProps extends ViewProps {
	url: string;
	resizeMode?: 'cover' | 'contain' | 'center';
	style?: any;
	urlOriginal?: string;
}

const CustomImageView = requireNativeComponent<CustomImageProps>('CustomImageView');

const ImageNative = ({ url, urlOriginal, style, resizeMode }: CustomImageProps) => {
	try {
		if (Platform.OS === 'android') {
			return <CustomImageView url={url?.toString()} resizeMode={resizeMode} style={style} />;
		} else {
			return <CachedImageWithRetryIOS source={{ uri: url?.toString() }} urlOriginal={urlOriginal} style={style} resizeMode={resizeMode} />;
		}
	} catch (error) {
		console.error('Error rendering ImageNative component:', error);
		return null;
	}
};

export default memo(ImageNative);
