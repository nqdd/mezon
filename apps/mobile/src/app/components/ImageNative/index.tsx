import React, { memo } from 'react';
import type { ViewProps } from 'react-native';
import { Platform, requireNativeComponent } from 'react-native';
import CachedImageWithRetryIOS from './CachedImageWithRetryIOS';

interface CustomImageProps extends ViewProps {
	url: string;
	resizeMode?: 'cover' | 'contain' | 'center';
	style?: any;
	urlOriginal?: string;
	onLoad?: (event: any) => void;
	onLoadEnd?: () => void;
}

const CustomImageView = requireNativeComponent<CustomImageProps>('CustomImageView');

const ImageNative = ({ url, urlOriginal, style, resizeMode, onLoad, onLoadEnd }: CustomImageProps) => {
	try {
		if (Platform.OS === 'android') {
			return <CustomImageView url={url?.toString()} resizeMode={resizeMode} style={style} onLoad={onLoad} onLoadEnd={onLoadEnd} />;
		} else {
			return (
				<CachedImageWithRetryIOS
					source={{ uri: url?.toString() }}
					urlOriginal={urlOriginal}
					style={style}
					resizeMode={resizeMode}
					onLoad={onLoad}
					onLoadEnd={onLoadEnd}
				/>
			);
		}
	} catch (error) {
		console.error('Error rendering ImageNative component:', error);
		return null;
	}
};

export default memo(ImageNative);
