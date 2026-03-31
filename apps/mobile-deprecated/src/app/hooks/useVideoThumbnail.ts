import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

export const useVideoThumbnail = (videoURL: string, thumbnailPreview?: string, isNotVideo?: boolean) => {
	const [thumbPath, setThumbPath] = useState(thumbnailPreview || '');

	useEffect(() => {
		if (thumbnailPreview) {
			setThumbPath(thumbnailPreview);
			return;
		}

		if (!videoURL || !isNotVideo) return;

		const generateThumbnailIOS = async (videoPath = '') => {
			try {
				const thumbnail = await NativeModules.VideoThumbnailModule.getThumbnail(videoPath);
				setThumbPath(thumbnail?.uri || '');
			} catch (error) {
				console.error('Error generating thumbnail:', error, videoPath);
			}
		};

		if (Platform.OS === 'android') {
			try {
				if (NativeModules?.VideoThumbnail?.getThumbnail) {
					NativeModules.VideoThumbnail.getThumbnail(videoURL)
						.then((path) => {
							path && typeof path === 'string' ? setThumbPath(path) : setThumbPath('');
						})
						.catch((err) => {
							console.error('VideoThumbnail native module error:', err);
							setThumbPath('');
						});
				} else {
					console.warn('VideoThumbnail native module not available');
					setThumbPath('');
				}
			} catch (error) {
				console.error('Error accessing VideoThumbnail native module:', error);
				setThumbPath('');
			}
		} else {
			generateThumbnailIOS(videoURL);
		}
	}, [videoURL, thumbnailPreview]);

	return thumbPath;
};
