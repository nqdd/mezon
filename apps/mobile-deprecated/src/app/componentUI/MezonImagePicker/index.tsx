import { ActionEmitEvent, QUALITY_IMAGE_UPLOAD } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { handleUploadFileMobile, useMezon } from '@mezon/transport';
import { iosRequestReadWriteGalleryPermission } from '@react-native-camera-roll/camera-roll';
import { iosReadGalleryPermission } from '@react-native-camera-roll/camera-roll/src/CameraRollIOSPermission';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { DeviceEventEmitter, Linking, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';
import { openCropper, openPicker } from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import MezonClanAvatar from '../MezonClanAvatar';
import MezonConfirm from '../MezonConfirm';
import { style as _style } from './styles';

export interface IFile {
	uri: string;
	name: string;
	type: string;
	size: number | string;
	fileData: any;
	height?: number;
	width?: number;
	thumbnailPreview?: string;
}

interface IMezonImagePickerProps {
	onChange?: (file: any) => void;
	onLoad?: (url: string) => void;
	defaultValue: string;
	localValue?: any;
	height?: DimensionValue;
	width?: DimensionValue;
	rounded?: boolean;
	showHelpText?: boolean;
	autoUpload?: boolean;
	alt?: string;
	style?: StyleProp<ViewStyle>;
	defaultColor?: string;
	noDefaultText?: boolean;
	disabled?: boolean;
	onPressAvatar?: () => void;
	imageWidth?: number;
	imageHeight?: number;
	autoCloseBottomSheet?: boolean;
	isOauth?: boolean;
	imageSizeLimit?: number;
}

export interface IMezonImagePickerHandler {
	openSelector: () => void;
}

const SCALE = 5;

export async function handleSelectImage() {
	const response = await launchImageLibrary({
		mediaType: 'photo',
		includeBase64: true,
		quality: 1
	});

	if (response.didCancel) {
		//
	} else if (response.errorCode) {
		//
	} else {
		const file = response.assets[0];
		return {
			uri: file?.uri,
			name: file?.fileName,
			type: file?.type,
			size: file?.fileSize,
			fileData: file?.base64
		} as IFile;
	}
}

export default memo(
	forwardRef(function MezonImagePicker(
		{
			onChange,
			onLoad,
			defaultValue,
			height = 60,
			width = 60,
			showHelpText,
			autoUpload = false,
			rounded = false,
			localValue,
			alt,
			style,
			defaultColor,
			noDefaultText,
			disabled,
			onPressAvatar,
			imageHeight,
			imageWidth,
			autoCloseBottomSheet = true,
			isOauth = false,
			imageSizeLimit
		}: IMezonImagePickerProps,
		ref
	) {
		const { themeValue } = useTheme();
		const styles = _style(themeValue);
		const [image, setImage] = useState<string>(defaultValue);
		const { sessionRef, clientRef } = useMezon();
		const timerRef = useRef<any>(null);
		const { t } = useTranslation(['profile']);

		useEffect(() => {
			setImage(defaultValue);
		}, [defaultValue]);

		useEffect(() => {
			return () => {
				timerRef?.current && clearTimeout(timerRef.current);
			};
		}, []);

		async function handleUploadImage(file: IFile, isOauth = false) {
			const session = sessionRef.current;
			const client = clientRef.current;

			if (!file || !client || !session) {
				throw new Error('Client is not initialized');
			}
			const res = await handleUploadFileMobile(client, session, file.name, file, isOauth);
			return res.url;
		}

		const getCheckPermissionPromise = async () => {
			try {
				if (Platform.OS === 'android') {
					if (Platform.Version >= 33) {
						const hasImagePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
						const hasVideoPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);

						return hasImagePermission && hasVideoPermission;
					} else {
						return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
					}
				}
				return false;
			} catch (error) {
				console.warn('Permission check error:', error);
				return false;
			}
		};

		const alertOpenSettings = (title?: string, desc?: string) => {
			const data = {
				children: (
					<MezonConfirm
						title={title || t('common:permissionNotification.photoTitle')}
						content={desc || t('common:permissionNotification.photoDesc')}
						confirmText={t('common:openSettings')}
						onConfirm={() => {
							openAppSettings();
							DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
						}}
					/>
				)
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		};

		const requestPermission = async () => {
			if (Platform.OS === 'android') {
				const hasPermission = await getCheckPermissionPromise();
				if (hasPermission) {
					return true;
				}

				try {
					if (Platform.Version >= 33) {
						const granted = await PermissionsAndroid.requestMultiple([
							PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
							PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
						]);

						if (
							granted['android.permission.READ_MEDIA_IMAGES'] !== PermissionsAndroid.RESULTS.GRANTED ||
							granted['android.permission.READ_MEDIA_VIDEO'] !== PermissionsAndroid.RESULTS.GRANTED
						) {
							alertOpenSettings();
						}

						return (
							granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED &&
							granted['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED
						);
					} else {
						const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
							title: 'Photo Library Access',
							message: 'This app needs access to your photo library.',
							buttonNeutral: 'Ask Me Later',
							buttonNegative: 'Cancel',
							buttonPositive: 'OK'
						});

						if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
							alertOpenSettings();
						}

						return granted === PermissionsAndroid.RESULTS.GRANTED;
					}
				} catch (err) {
					console.warn('Permission request error:', err);
					return false;
				}
			} else if (Platform.OS === 'ios') {
				const result = await iosReadGalleryPermission('readWrite');

				if (result === 'not-determined' || result === 'denied') {
					const requestResult = await iosRequestReadWriteGalleryPermission();
					if (requestResult === 'not-determined' || requestResult === 'denied' || requestResult === 'blocked') {
						alertOpenSettings();
					}
					return requestResult === 'granted' || requestResult === 'limited';
				}

				return result === 'granted' || result === 'limited';
			}

			return false;
		};

		const openAppSettings = () => {
			if (Platform.OS === 'ios') {
				Linking.openURL('app-settings:');
			} else {
				Linking.openSettings();
			}
		};

		async function handleImage() {
			try {
				const hasPermission = await requestPermission();
				if (!hasPermission) return;
				const selectedFile = await openPicker({
					mediaType: 'photo',
					includeBase64: true,
					cropping: false
				});

				if (!!imageSizeLimit && selectedFile.size > imageSizeLimit) {
					const maxSizeMB = Math.round(imageSizeLimit / 1024 / 1024);
					const maxSizeKB = Math.round(imageSizeLimit / 1024);
					Toast.show({
						type: 'error',
						text1: t('imageSizeLimit', { size: maxSizeMB > 0 ? maxSizeMB : maxSizeKB, unit: maxSizeMB > 0 ? 'MB' : 'KB' })
					});
					return;
				}

				const isGif = selectedFile.mime === 'image/gif';

				let finalFile;
				if (isGif) {
					// For GIFs, don't crop to preserve animation
					finalFile = selectedFile;
				} else {
					// For other images, apply cropping and compression
					finalFile = await openCropper({
						path: selectedFile.path,
						mediaType: 'photo',
						includeBase64: true,
						cropping: true,
						compressImageQuality: QUALITY_IMAGE_UPLOAD,
						...(typeof width === 'number' && { width: imageWidth || width * SCALE }),
						...(typeof height === 'number' && { height: imageWidth || height * SCALE })
					});
				}

				setImage(finalFile.path);
				onChange && onChange(finalFile);
				if (autoUpload) {
					const uploadImagePayload = {
						fileData: finalFile?.data,
						name: finalFile?.filename || finalFile?.path?.split?.('/')?.pop?.().trim() || 'image',
						uri: finalFile.path,
						size: finalFile.size,
						type: finalFile.mime,
						height: finalFile.height,
						width: finalFile.width
					} as IFile;
					const url = await handleUploadImage(uploadImagePayload, isOauth);
					if (url) {
						onLoad && onLoad(url);
					}
				}
				autoCloseBottomSheet && DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
			} catch (error) {
				autoCloseBottomSheet && DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
				console.error('Error in handleImage:', error?.message || error);
				if (error?.message && error?.code !== 'E_PICKER_CANCELLED') {
					Toast.show({
						type: 'error',
						text1: error?.message
					});
				}
			}
		}

		function handlePress() {
			if (onPressAvatar) onPressAvatar();
			else handleImage();
		}

		useImperativeHandle(ref, () => ({
			openSelector() {
				handleImage();
			}
		}));

		return (
			<TouchableOpacity onPress={handlePress} disabled={disabled}>
				<View style={styles.bannerContainer}>
					<View style={[styles.bannerWrapper, { height, width }, rounded && { borderRadius: 999 }, style]}>
						{localValue ? (
							localValue
						) : image || !showHelpText ? (
							<MezonClanAvatar
								image={image}
								alt={alt}
								defaultColor={defaultColor}
								noDefaultText={noDefaultText}
								imageHeight={imageHeight}
								imageWidth={imageWidth}
							/>
						) : (
							<Text style={styles.textPlaceholder}>{t('chooseImage')}</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
		);
	})
);
