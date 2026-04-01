import { size } from '@mezon/mobile-ui';
import type { AttachmentEntity } from '@mezon/store-mobile';
import { createImgproxyUrl } from '@mezon/utils';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import { getAspectRatioSize, useImageResolution } from 'react-native-zoom-toolkit';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';
import { isVideo } from '../../utils/helpers';
import ImageNative from '../ImageNative';
import { style } from './styles';

interface IRenderFooterModalProps {
	imageSelected?: AttachmentEntity;
	onImageThumbnailChange: (image: AttachmentEntity) => void;
	visible?: boolean;
	allImageList: AttachmentEntity[];
}

const FooterItem = memo(
	({ item, imageSelected, onPress }: { item: AttachmentEntity; imageSelected?: AttachmentEntity; onPress: (item: AttachmentEntity) => void }) => {
		const styles = style();
		const isSelected = item?.id === imageSelected?.id;
		const { resolution } = useImageResolution({ uri: item?.url });
		const imageSize = getAspectRatioSize({
			aspectRatio: resolution?.width / resolution?.height,
			width: size.s_60
		});

		const isVideoType = isVideo(item?.url);
		const thumbnail = useVideoThumbnail(item?.url || '', (item as any)?.thumbnail, isVideoType);
		const animatedWidth = useRef(new Animated.Value(size.s_40)).current;
		const animationRef = useRef<Animated.CompositeAnimation | null>(null);

		useEffect(() => {
			// Cancel any ongoing animation before starting a new one
			if (animationRef.current) {
				animationRef.current.stop();
			}

			animationRef.current = Animated.timing(animatedWidth, {
				toValue: isSelected ? imageSize.width * 1.2 : size.s_40,
				duration: 200,
				useNativeDriver: false
			});
			animationRef.current.start();

			return () => {
				if (animationRef.current) {
					animationRef.current.stop();
				}
			};
		}, [isSelected, imageSize.width, animatedWidth]);

		const handlePress = useCallback(() => {
			onPress(item);
		}, [onPress, item]);

		return (
			<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
				<Animated.View style={[styles.imageWrapper, isSelected && styles.imageSelected, { width: animatedWidth }]}>
					{isVideoType ? (
						<>
							<FastImage
								source={{ uri: thumbnail || item?.url }}
								style={[styles.image]}
								resizeMode={imageSelected ? 'cover' : 'contain'}
							/>
							<View style={styles.itemVideoFooter}>
								<Entypo name="controller-play" size={20} color="#FFF" />
							</View>
						</>
					) : (
						<ImageNative
							url={createImgproxyUrl(item?.url ?? '', { width: 50, height: 50, resizeType: 'fit' })}
							style={[styles.image]}
							resizeMode={imageSelected ? 'cover' : 'contain'}
						/>
					)}
				</Animated.View>
			</TouchableOpacity>
		);
	},
	(prevProps, nextProps) => {
		// Only re-render if these specific props change
		return prevProps.item?.id === nextProps.item?.id && prevProps.imageSelected?.id === nextProps.imageSelected?.id;
	}
);

export const RenderFooterModal = memo((props: IRenderFooterModalProps) => {
	const { imageSelected, onImageThumbnailChange, visible, allImageList } = props;
	const flatListRef = useRef<Animated.FlatList<AttachmentEntity>>(null);
	const styles = style();
	const animatedHeight = useRef(new Animated.Value(0)).current;
	const heightAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

	// Animate footer height when visibility changes
	useEffect(() => {
		// Cancel previous animation if exists
		if (heightAnimationRef.current) {
			heightAnimationRef.current.stop();
		}

		heightAnimationRef.current = Animated.timing(animatedHeight, {
			toValue: visible ? size.s_100 : 0,
			duration: 300,
			useNativeDriver: false
		});
		heightAnimationRef.current.start();

		return () => {
			if (heightAnimationRef.current) {
				heightAnimationRef.current.stop();
			}
		};
	}, [visible, animatedHeight]);

	useEffect(() => {
		if (imageSelected?.id) {
			const index = allImageList?.findIndex((file) => file?.id === imageSelected?.id);
			if (index >= 0 && flatListRef.current && visible) {
				// Use setTimeout to ensure the FlatList is ready
				setTimeout(() => {
					flatListRef.current?.scrollToIndex({
						animated: true,
						viewPosition: 0.5,
						index
					});
				}, 50);
			}
		}
	}, [imageSelected?.id, visible, allImageList]);

	const handlePress = useCallback(
		(imageFile: AttachmentEntity) => {
			if (imageFile?.id !== imageSelected?.id) {
				onImageThumbnailChange(imageFile);
			}
		},
		[imageSelected?.id, onImageThumbnailChange]
	);

	const renderItem = useCallback(
		({ item }: { item: AttachmentEntity }) => {
			return <FooterItem item={item} imageSelected={imageSelected} onPress={handlePress} />;
		},
		[imageSelected, handlePress]
	);

	const keyExtractor = useCallback((item: AttachmentEntity, index: number) => `${item?.id}_${index}`, []);

	const handleScrollToIndexFailed = useCallback((info: { index: number; highestMeasuredFrameIndex: number }) => {
		const wait = new Promise((resolve) => setTimeout(resolve, 200));
		if (info.highestMeasuredFrameIndex < info.index) {
			flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
			wait.then(() => {
				flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
			});
		}
	}, []);

	return (
		<Animated.View style={[styles.wrapperFooterModal, { height: animatedHeight }]}>
			<View>
				<Animated.FlatList
					horizontal
					ref={flatListRef}
					data={allImageList}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					showsHorizontalScrollIndicator={false}
					decelerationRate="fast"
					onScrollToIndexFailed={handleScrollToIndexFailed}
					windowSize={5}
					maxToRenderPerBatch={5}
					initialNumToRender={5}
					removeClippedSubviews={true}
					getItemLayout={(data, index) => ({
						length: size.s_40 + size.s_4,
						offset: (size.s_40 + size.s_4) * index,
						index
					})}
				/>
			</View>
		</Animated.View>
	);
});
