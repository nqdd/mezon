import { ActionEmitEvent } from '@mezon/mobile-components';
import { Metrics, size } from '@mezon/mobile-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, DeviceEventEmitter, NativeModules, Platform, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageNative from '../../../../../components/ImageNative';
import { RenderVideoDetail } from '../RenderVideoDetail';

const widthMedia = Metrics.screenWidth - 150;
interface IRenderVideoChatProps {
	videoURL: string;
	onLongPress: () => void;
	isMultiple?: boolean;
	thumbnailPreview?: string;
}

export const RenderVideoChat = React.memo(
	({ videoURL, onLongPress, isMultiple = false, thumbnailPreview = '' }: IRenderVideoChatProps) => {
		const [thumbPath, setThumbPath] = useState('');

		const handlePlayVideo = () => {
			DeviceEventEmitter.emit(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, {
				isShow: false
			});
			const data = {
				children: <RenderVideoDetail route={{ params: { videoURL } }} />
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		};

		useEffect(() => {
			if (videoURL) {
				if (Platform.OS === 'android') {
					// Safe native module call with error handling
					try {
						if (NativeModules?.VideoThumbnail?.getThumbnail) {
							NativeModules.VideoThumbnail.getThumbnail(videoURL)
								.then((path) => {
									path && typeof path === 'string' ? setThumbPath(path) : setThumbPath(thumbnailPreview);
								})
								.catch((err) => {
									console.error('VideoThumbnail native module error:', err);
									setThumbPath(thumbnailPreview);
								});
						} else {
							console.warn('VideoThumbnail native module not available');
							setThumbPath(thumbnailPreview);
						}
					} catch (error) {
						console.error('Error accessing VideoThumbnail native module:', error);
						setThumbPath(thumbnailPreview);
					}
				} else {
					createThumbnail({ url: videoURL, timeStamp: 1000 })
						.then((response) => {
							if (response?.path) {
								setThumbPath(response.path);
							} else {
								setThumbPath('');
							}
						})
						.catch((error) => {
							console.error('Error creating thumbnail:', error);
							setThumbPath('');
						});
				}
			}
		}, [thumbnailPreview, videoURL]);

		const videoSize = useMemo(() => {
			const baseWidth = Math.max(widthMedia, Metrics.screenWidth - size.s_60 * 2);
			return {
				width: isMultiple ? baseWidth / 2 : baseWidth,
				height: Math.max(160, size.s_100 * 2.5)
			};
		}, [isMultiple]);

		if (!videoURL) return null;
		const isUploading = !videoURL.startsWith('http');

		const renderThumbnailPreview = () => {
			if (!thumbnailPreview) {
				return (
					<View
						style={{
							width: '100%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: '#5a5b5c30'
						}}
					>
						<ActivityIndicator />
					</View>
				);
			}

			return (
				<>
					<FastImage
						source={{ uri: thumbnailPreview }}
						style={{
							width: '100%',
							height: '100%',
							borderRadius: size.s_4
						}}
						resizeMode={isMultiple ? 'cover' : 'contain'}
					/>

					<View
						style={{
							position: 'absolute',
							top: size.s_8,
							right: size.s_8,
							borderRadius: size.s_12,
							padding: size.s_4
						}}
					>
						<Entypo size={size.s_16} name="video" style={{ color: '#ffffff' }} />
					</View>
				</>
			);
		};

		return (
			<View
				style={{
					marginTop: size.s_10,
					marginBottom: size.s_6,
					opacity: isUploading ? 0.5 : 1,
					width: videoSize.width,
					height: videoSize.height
				}}
			>
				{isUploading ? (
					renderThumbnailPreview()
				) : (
					<TouchableOpacity
						onPress={handlePlayVideo}
						onLongPress={onLongPress}
						style={{ alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden', borderRadius: size.s_4 }}
					>
						<ImageNative
							url={thumbPath || ''}
							style={{
								width: '100%',
								height: '100%',
								borderRadius: size.s_4,
								backgroundColor: '#5a5b5c30'
							}}
							resizeMode={isMultiple ? 'cover' : 'contain'}
						/>
						<View
							style={{
								position: 'absolute',
								alignSelf: 'center',
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								borderRadius: size.s_60,
								width: size.s_60,
								height: size.s_60,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Entypo size={size.s_40} name="controller-play" style={{ color: '#eaeaea' }} />
						</View>
					</TouchableOpacity>
				)}
			</View>
		);
	},
	(prevProps, nextProps) =>
		prevProps.videoURL === nextProps.videoURL &&
		prevProps.isMultiple === nextProps.isMultiple &&
		prevProps.thumbnailPreview === nextProps.thumbnailPreview
);
