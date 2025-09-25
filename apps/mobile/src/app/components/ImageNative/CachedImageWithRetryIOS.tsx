import React, { memo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

interface ICachedImageWithRetryIOSProps {
	source: { uri: string };
	urlOriginal?: string;
	retryCount?: number;
	style?: any;
	[key: string]: any;
}
// For covert old records
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
	({ source, urlOriginal, retryCount = 1, style, ...props }: ICachedImageWithRetryIOSProps) => {
		const [key, setKey] = useState(Date.now());
		const [loading, setLoading] = useState<boolean>(false);
		const [isError, setIsError] = useState<boolean>(false);
		const [fallbackUrl, setFallbackUrl] = useState<string>(urlOriginal);
		const [hasTriedFallback, setHasTriedFallback] = useState<boolean>(false);
		const retryAttempts = useRef<number>(0);
		const hasExhaustedRetries = useRef<boolean>(false);

		const handleExhaustedRetries = () => {
			retryAttempts.current += 1;
			if (retryAttempts.current > retryCount) {
				hasExhaustedRetries.current = true;
				setLoading(false);
				setIsError(true);
				return;
			}

			if (!hasTriedFallback) {
				const getOriginalUrl = urlOriginal || extractOriginalUrl(source?.uri);
				if (getOriginalUrl) {
					setHasTriedFallback(true);
					setKey(Date.now());
					setFallbackUrl(getOriginalUrl);
					setIsError(true);
					return;
				}
			}

			if (hasTriedFallback && fallbackUrl) {
				hasExhaustedRetries.current = true;
				setLoading(false);
				setIsError(true);
				return;
			}

			hasExhaustedRetries.current = true;
			setLoading(false);
			setIsError(true);
		};

		const handleLoadStart = () => {
			if (!hasExhaustedRetries.current) {
				setLoading(true);
			}
		};

		const handleLoadEnd = () => {
			setLoading(false);
		};

		const handleLoadSuccess = () => {
			retryAttempts.current = 0;
			hasExhaustedRetries.current = false;
			setLoading(false);
			setIsError(false);
		};

		if (hasExhaustedRetries.current && isError) {
			return (
				<View style={[styles.container, style]}>
					<View style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%' }} />
				</View>
			);
		}

		return (
			<View style={[styles.container, style]}>
				{loading && <ActivityIndicator style={styles.loader} size="small" color="#333333" />}
				<FastImage
					key={`${key}_${source?.uri}_${retryAttempts.current}`}
					source={{
						uri: isError && fallbackUrl ? fallbackUrl : source?.uri,
						priority: FastImage.priority.high,
						cache: FastImage.cacheControl.immutable
					}}
					onLoadStart={handleLoadStart}
					onError={handleExhaustedRetries}
					onLoad={handleLoadSuccess}
					onLoadEnd={handleLoadEnd}
					style={StyleSheet.absoluteFill}
					{...props}
				/>
			</View>
		);
	},
	(prevProps, nextProps) => {
		return prevProps.source?.uri === nextProps.source?.uri && prevProps.retryCount === nextProps.retryCount;
	}
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	loader: {
		position: 'absolute',
		zIndex: 1
	}
});

export default CachedImageWithRetryIOS;
