import { useTheme } from '@mezon/mobile-ui';
import { referencesActions, useAppDispatch } from '@mezon/store-mobile';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { style } from './style';

interface IChatInputProps {
	channelId: string;
	topicChannelId: string;
	onSetShowOptionPaste: (status: boolean) => void;
}

export const OptionPasteTooltip = memo(({ channelId = '', topicChannelId = '', onSetShowOptionPaste }: IChatInputProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const { t } = useTranslation('message');

	const getImageDimension = useCallback((imageUri: string): Promise<{ width: number; height: number }> => {
		return new Promise((resolve) => {
			Image.getSize(
				imageUri,
				(width, height) => {
					resolve({ width, height });
				},
				(error) => {
					console.error('Error getting image dimensions:', error);
				}
			);
		});
	}, []);

	const handlePasteImage = useCallback(
		async (imageData: string) => {
			try {
				if (imageData) {
					const now = Date.now();
					let fileName: string;
					let destPath: string;
					let mimeType: string;

					if (imageData.startsWith('data:image/')) {
						// Handle base64 image data
						mimeType = imageData.split(';')?.[0]?.split(':')?.[1] || 'image/jpeg';
						const extension = mimeType?.split('/')?.[1]?.replace('jpeg', 'jpg')?.replace('svg+xml', 'svg') || 'jpg';
						fileName = `paste_image_${now}.${extension}`;
						destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

						await RNFS.writeFile(destPath, imageData.split(',')?.[1], 'base64');
					} else if (imageData.startsWith('content://')) {
						// Handle Android content:// URI
						fileName = `paste_image_${now}.jpg`;
						destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
						mimeType = 'image/jpeg';

						// Copy file from content URI to app cache
						await RNFS.copyFile(imageData, destPath);
					} else {
						throw new Error('Unsupported image format');
					}

					const fileInfo = await RNFS.stat(destPath);
					const filePath = `file://${fileInfo?.path}`;
					const { width, height } = await getImageDimension(filePath);

					const imageFile = {
						filename: fileName,
						filetype: mimeType,
						url: filePath,
						size: fileInfo?.size,
						width: width ?? 250,
						height: height ?? 250
					};

					dispatch(
						referencesActions.setAtachmentAfterUpload({
							channelId: topicChannelId || channelId,
							files: [imageFile]
						})
					);
				}
			} catch (error) {
				console.error('Error pasting image:', error);
			}
		},
		[channelId, dispatch, getImageDimension, topicChannelId]
	);

	const handlePasteImageFromClipboard = async () => {
		try {
			const imageUri = await Clipboard.getImage();
			if (imageUri?.startsWith('data:image/')) {
				const base64Data = imageUri.split(',')?.[1];
				if (base64Data?.length > 10) {
					await handlePasteImage(imageUri);
					onSetShowOptionPaste(false);
					return;
				}
			}

			const clipboardText = await Clipboard.getString();
			if (
				clipboardText?.startsWith('content://') &&
				(clipboardText.includes('image') || clipboardText.includes('photo') || clipboardText.includes('media'))
			) {
				await handlePasteImage(clipboardText);
				onSetShowOptionPaste(false);
				return;
			}
		} catch (error) {
			console.error('Error pasting image from clipboard:', error);
		}
	};

	return (
		<TouchableOpacity style={styles.pasteTooltip} onPress={handlePasteImageFromClipboard} activeOpacity={0.8}>
			<View style={styles.tooltipContent}>
				<Text style={styles.tooltipText}>{t('pasteOption')}</Text>
			</View>
			<View style={styles.tooltipArrow} />
		</TouchableOpacity>
	);
});
