import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size } from '@mezon/mobile-ui';
import type { AttachmentEntity } from '@mezon/store-mobile';
import { getStore, selectDmGroupCurrentId, selectMemberClanByUserId, selectMessageByMessageId, useAppSelector } from '@mezon/store-mobile';
import { convertTimeString, sleep } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Platform, Text, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import MezonClanAvatar from '../../componentUI/MezonClanAvatar';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { useImage } from '../../hooks/useImage';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { style } from './styles';

interface IRenderFooterModalProps {
	imageSelected?: AttachmentEntity & { channelId?: string };
	onImageSaved?: () => void;
	onLoading?: (isLoading: boolean) => void;
	onImageCopy?: (error?: string) => void;
	onImageShare?: (error?: string) => void;
}

export const RenderHeaderModal = memo(({ imageSelected, onImageSaved, onLoading, onImageCopy, onImageShare }: IRenderFooterModalProps) => {
	const styles = style();
	const uploader = useAppSelector((state) => selectMemberClanByUserId(state, imageSelected?.uploader || ''));
	const { downloadImage, saveMediaToCameraRoll, getImageAsBase64OrFile } = useImage();
	const currentDirectId = useSelector(selectDmGroupCurrentId);
	const navigation = useNavigation<any>();
	const { t } = useTranslation(['common']);

	const onClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	const isAnonymous = useMemo(() => {
		return imageSelected?.uploader === process.env.NX_CHAT_APP_ANNONYMOUS_USER_ID;
	}, [imageSelected?.uploader]);

	const prioritySenderUsername = useMemo(() => {
		if (isAnonymous) {
			return 'Anonymous';
		}

		return uploader?.user?.username || '';
	}, [isAnonymous, uploader?.user?.username]);

	const prioritySenderName = useMemo(() => {
		if (isAnonymous) {
			return 'Anonymous';
		}

		const displayName = uploader?.user?.display_name || uploader?.user?.username || '';
		return currentDirectId ? displayName : uploader?.clan_nick || displayName;
	}, [currentDirectId, isAnonymous, uploader?.clan_nick, uploader?.user?.display_name, uploader?.user?.username]);

	const prioritySenderAvatar = useMemo(() => {
		return (currentDirectId ? uploader?.user?.avatar_url : uploader?.clan_avatar || uploader?.user?.avatar_url) || '';
	}, [currentDirectId, uploader?.clan_avatar, uploader?.user?.avatar_url]);

	const handleDownloadImage = async () => {
		if (!imageSelected?.url) return;

		onLoading(true);
		try {
			const { url, filetype } = imageSelected;
			const filetypeParts = filetype?.split?.('/');
			const filePath = await downloadImage(url, filetypeParts?.[1]);
			if (filePath) {
				await saveMediaToCameraRoll(`file://${filePath}`, filetypeParts?.[0], false);
				onImageSaved();
			}
		} catch (error) {
			console.error('Error downloading image: ', error);
		} finally {
			onLoading(false);
		}
	};

	const handleCopyImage = async () => {
		if (!imageSelected?.url) return;

		onLoading(true);
		try {
			const { url, filetype } = imageSelected;
			const image = await getImageAsBase64OrFile(url, filetype?.split?.('/')?.[1]);
			if (image) onImageCopy();
		} catch (error) {
			console.error('Error copying image: ', error);
			onImageCopy(error);
		} finally {
			onLoading(false);
		}
	};

	const handleShareImage = async () => {
		if (!imageSelected?.url) return;

		onLoading(true);
		try {
			const { url, filetype, filename } = imageSelected;

			if (!url) {
				onImageShare?.('No image URL found');
				return;
			}

			const imageData = await getImageAsBase64OrFile(url, filetype?.split?.('/')?.[1], { forSharing: true });

			if (!imageData?.filePath) {
				onImageShare?.('Failed to process image');
				return;
			}

			await Share.open({
				url: `file://${imageData.filePath}`,
				type: filetype || 'image/png',
				filename: filename || 'image',
				failOnCancel: false
			});
		} catch (error) {
			onImageShare?.('Unknown error');
			console.error('Error sharing image: ', error);
		} finally {
			onLoading(false);
			onClose();
		}
	};

	const handleForwardMessage = async () => {
		if (!imageSelected?.message_id) return;

		try {
			const store = getStore();
			const message = selectMessageByMessageId(store.getState(), imageSelected?.channelId, imageSelected.message_id);
			if (message) {
				onClose();
				DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
				await sleep(500);
				navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
					screen: APP_SCREEN.MESSAGES.FORWARD_MESSAGE,
					params: {
						message
					}
				});
			}
		} catch (error) {
			console.error('Error forwarding message: ', error);
		}
	};

	return (
		<View style={[styles.headerContainer, { paddingTop: Platform.OS === 'ios' ? size.s_40 : size.s_30 }]}>
			<View style={styles.headerLeftSection}>
				<TouchableOpacity onPress={onClose}>
					<MezonIconCDN icon={IconCDN.arrowLargeLeftIcon} color={baseColor.white} />
				</TouchableOpacity>

				<View style={styles.uploaderSection}>
					<View style={styles.wrapperAvatar}>
						<MezonClanAvatar image={prioritySenderAvatar} alt={prioritySenderUsername} />
					</View>
					<View style={styles.messageBoxTop}>
						<Text numberOfLines={1} style={styles.usernameMessageBox}>
							{prioritySenderName}
						</Text>
						<Text style={styles.dateMessageBox}>{imageSelected?.create_time ? convertTimeString(imageSelected.create_time, t) : ''}</Text>
					</View>
				</View>
			</View>
			<View style={styles.option}>
				<TouchableOpacity onPress={handleCopyImage}>
					<MezonIconCDN icon={IconCDN.copyIcon} color={baseColor.white} height={size.s_20} width={size.s_20} />
				</TouchableOpacity>
				<TouchableOpacity onPress={handleShareImage}>
					<MezonIconCDN icon={IconCDN.shareIcon} color={baseColor.white} height={size.s_20} width={size.s_20} />
				</TouchableOpacity>
				{!isAnonymous && (
					<TouchableOpacity onPress={handleForwardMessage}>
						<MezonIconCDN icon={IconCDN.arrowAngleRightUpIcon} color={baseColor.white} height={size.s_20} width={size.s_20} />
					</TouchableOpacity>
				)}
				<TouchableOpacity onPress={handleDownloadImage}>
					<MezonIconCDN icon={IconCDN.downloadIcon} color={baseColor.white} height={size.s_20} width={size.s_20} />
				</TouchableOpacity>
			</View>
		</View>
	);
});
