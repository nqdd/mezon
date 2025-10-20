// CachedImageWithRetryIOS.tsx
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

interface ICachedImageWithRetryIOSProps {
	source: { uri: string };
	urlOriginal?: string;
	style?: any;
	resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
	placeholder?: React.ReactNode;
	isVisible?: boolean; // NEW: Only load when visible
	[key: string]: any;
}

const NX_BASE_IMG_URL_OLD = 'https://cdn.mezon.vn';

const extractOriginalUrl = (url: string): string | null => {
	if (url?.includes?.(process.env.NX_IMGPROXY_BASE_URL) && (url?.includes?.(process.env.NX_BASE_IMG_URL) || url?.includes?.(NX_BASE_IMG_URL_OLD))) {
		const parts = url?.split?.('/plain/');
		if (parts?.length > 1 && (parts?.[1]?.startsWith(process.env.NX_BASE_IMG_URL) || parts?.[1]?.startsWith(NX_BASE_IMG_URL_OLD))) {
			return parts?.[1]?.split?.('@')?.[0];
		}
	}
	return null;
};

const CachedImageWithRetryIOS = memo(
	({ source, urlOriginal, style, resizeMode = 'cover', placeholder, isVisible = true, ...props }: ICachedImageWithRetryIOSProps) => {
		const [loading, setLoading] = useState<boolean>(false);
		const [hasError, setHasError] = useState<boolean>(false);
		const [shouldLoad, setShouldLoad] = useState<boolean>(isVisible);
		const isMountedRef = useRef<boolean>(true);
		const hasLoadedOnceRef = useRef<boolean>(false);

		useEffect(() => {
			isMountedRef.current = true;
			return () => {
				isMountedRef.current = false;
			};
		}, []);

		// Only trigger load when item becomes visible
		useEffect(() => {
			if (isVisible && !hasLoadedOnceRef.current) {
				// Small delay to batch loads
				const timer = setTimeout(() => {
					if (isMountedRef.current) {
						setShouldLoad(true);
					}
				}, 50);
				return () => clearTimeout(timer);
			}
		}, [isVisible]);

		// Reset on URI change
		useEffect(() => {
			setHasError(false);
			hasLoadedOnceRef.current = false;
			setShouldLoad(isVisible);
		}, [source?.uri, isVisible]);

		const handleLoadStart = useCallback(() => {
			if (isMountedRef.current) {
				setLoading(true);
			}
		}, []);

		const handleLoadEnd = useCallback(() => {
			if (isMountedRef.current) {
				setLoading(false);
				hasLoadedOnceRef.current = true;
			}
		}, []);

		const handleError = useCallback(() => {
			if (isMountedRef.current) {
				const fallbackUrl = urlOriginal || extractOriginalUrl(source?.uri);
				if (fallbackUrl && !hasError) {
					setHasError(true);
				} else {
					setLoading(false);
				}
			}
		}, [source?.uri, urlOriginal, hasError]);

		// Don't render image if not visible yet
		if (!shouldLoad) {
			return <View style={[styles.container, style]}>{placeholder || <View style={styles.placeholder} />}</View>;
		}

		const imageUri = hasError && urlOriginal ? urlOriginal : source?.uri;

		if (!imageUri) {
			return <View style={[styles.container, style]} />;
		}

		return (
			<View style={[styles.container, style]}>
				{loading && <ActivityIndicator style={styles.loader} size="small" color="#999" />}
				<FastImage
					source={{
						uri: imageUri,
						priority: FastImage.priority.normal,
						cache: FastImage.cacheControl.web
					}}
					onLoadStart={handleLoadStart}
					onError={handleError}
					onLoadEnd={handleLoadEnd}
					resizeMode={resizeMode}
					style={StyleSheet.absoluteFill}
					{...props}
				/>
			</View>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.source?.uri === nextProps.source?.uri && prevProps?.isVisible === nextProps?.isVisible && prevProps?.style === nextProps?.style
		);
	}
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden'
	},
	loader: {
		position: 'absolute',
		zIndex: 1
	},
	placeholder: {
		width: '100%',
		height: '100%'
	}
});

export default CachedImageWithRetryIOS;
