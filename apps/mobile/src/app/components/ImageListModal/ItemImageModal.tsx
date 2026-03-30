import { ActionEmitEvent } from '@mezon/mobile-components';
import { EMimeTypes, createImgproxyUrl, sleep } from '@mezon/utils';
import type { ApiMessageAttachment } from 'mezon-js/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, Dimensions, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { RenderItemInfo } from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';
import { RenderVideoDetail } from '../../screens/home/homedrawer/components/RenderVideoDetail';
import { isVideo } from '../../utils/helpers';
import ImageNative from '../ImageNative';
import { style } from './styles';

const calculateImageSize = (imageWidth: number, imageHeight: number) => {
	const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
	const screenAspectRatio = screenWidth / screenHeight;
	const imageAspectRatio = imageWidth / imageHeight;

	let calculatedWidth = screenWidth;
	let calculatedHeight = screenHeight;

	if (imageAspectRatio > screenAspectRatio) {
		// Image is wider than the screen
		calculatedWidth = screenWidth;
		calculatedHeight = screenWidth / imageAspectRatio;
	} else {
		// Image is taller than the screen
		calculatedHeight = screenHeight;
		calculatedWidth = screenHeight * imageAspectRatio;
	}

	return {
		width: Math.round(calculatedWidth),
		height: Math.round(calculatedHeight)
	};
};

export const ItemImageModal = React.memo(
	({ item, setImageDimensions }: RenderItemInfo<ApiMessageAttachment>) => {
		const [dims, setDims] = useState(Dimensions.get('screen'));
		const [ready, setReady] = useState(true);
		const [isLoading, setIsLoading] = useState(false);
		const [retryCount, setRetryCount] = useState(0);
		const [imageOriginal, setImageOriginal] = useState<ApiMessageAttachment | null>(null);
		const MAX_RETRY_COUNT = 1;
		const isVideoItem = isVideo(item?.url || '');
		const thumbnail = useVideoThumbnail(item?.url || '', item?.thumbnail, isVideoItem);
		const styles = style();

		const handleImageError = useCallback(() => {
			if (retryCount < MAX_RETRY_COUNT) {
				setRetryCount((prev) => prev + 1);
			} else {
				setImageOriginal(item);
			}
		}, [item, retryCount]);

		const imageProxyObj = useMemo(() => {
			if (!item?.url || imageOriginal?.url) {
				return { isProxyImage: false, url: imageOriginal?.url ?? item?.url ?? '' };
			}

			const isSpecialFormat =
				['image/gif', 'image/webp', 'gif', 'webp'].includes(item?.filetype || '') || item?.url?.includes(EMimeTypes.tenor);

			if (isSpecialFormat) {
				return {
					isProxyImage: false,
					url: item.url
				};
			}

			return {
				isProxyImage: true,
				url: createImgproxyUrl(item?.url ?? '', {
					...calculateImageSize(item?.width || 500, item?.height || 500),
					resizeType: 'fit'
				}) as string,
				urlOriginal: item?.url
			};
		}, [item, imageOriginal?.url]);

		useEffect(() => {
			const sub = Dimensions.addEventListener('change', async ({ screen }) => {
				setReady(false);
				setDims(screen);
				await sleep(100);
				setReady(true);
			});
			return () => sub.remove();
		}, [item?.url]);

		const onPlayVideo = () => {
			const data = {
				children: <RenderVideoDetail route={{ params: { videoURL: item?.url } }} />
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		};

		if (!ready) {
			return <View />;
		}

		if (isVideoItem) {
			return (
				<View style={{ width: dims.width, height: dims.height, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity onPress={onPlayVideo} activeOpacity={0.9}>
						<FastImage source={{ uri: thumbnail || item?.url }} style={{ width: dims.width, height: dims.height }} resizeMode="contain" />
						<View style={styles.wrapperButtonPlay}>
							<View style={styles.buttonPlay}>
								<Entypo name="controller-play" size={30} color="#FFF" style={{ marginLeft: 4 }} />
							</View>
						</View>
					</TouchableOpacity>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				{imageProxyObj?.isProxyImage ? (
					<ImageNative
						url={imageProxyObj?.url}
						urlOriginal={item?.url}
						resizeMode="contain"
						style={[StyleSheet.absoluteFill, { width: dims.width, height: dims.height }]}
						onLoadEnd={() => {
							setIsLoading(true);
						}}
						onLoad={(event) => {
							const { width = dims.width, height = dims.height } = event?.nativeEvent || {};
							const widthResult = width < dims.width ? width : dims.width;
							const heightResult = height < dims.height ? height : dims.height;
							setImageDimensions({ width: widthResult, height: heightResult });
						}}
					/>
				) : Platform.OS === 'ios' ? (
					<FastImage
						source={{ uri: imageProxyObj?.url }}
						style={[StyleSheet.absoluteFill, { width: dims.width, height: dims.height }]}
						resizeMode="contain"
						onLoadEnd={() => {
							setIsLoading(true);
						}}
						onLoad={(event) => {
							const { width = dims.width, height = dims.height } = event.nativeEvent;
							const widthResult = width < dims.width ? width : dims.width;
							const heightResult = height < dims.height ? height : dims.height;
							setImageDimensions({ width: widthResult, height: heightResult });
						}}
						onError={handleImageError}
					/>
				) : (
					<Image
						source={{ uri: imageProxyObj?.url }}
						style={[StyleSheet.absoluteFill, { width: dims.width, height: dims.height }]}
						resizeMode="contain"
						onLoadEnd={() => {
							setIsLoading(true);
						}}
						onLoad={(event) => {
							const { width = dims.width, height = dims.height } = event.nativeEvent.source;
							const widthResult = width < dims.width ? width : dims.width;
							const heightResult = height < dims.height ? height : dims.height;
							setImageDimensions({ width: widthResult, height: heightResult });
						}}
						onError={handleImageError}
					/>
				)}
				{!isLoading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator color={'white'} size={'large'} />
					</View>
				)}
			</View>
		);
	},
	(prev, next) => prev.item?.url === next.item?.url
);
