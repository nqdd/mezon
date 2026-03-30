import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { style } from './styles';

const ClanLimitModal = () => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const styles = style(themeValue, isTabletLandscape);
	const { t } = useTranslation(['clan']);

	const handleClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalCard}>
				<View style={styles.modalHeader}>
					<View style={styles.warningIconContainer}>
						<MezonIconCDN icon={IconCDN.unlinkIcon} color={themeValue.text} height={size.s_40} width={size.s_40} />
					</View>
					<Text style={styles.modalTitle}>{t('limitModal.title')}</Text>
				</View>

				<Text style={styles.modalMessage}>{t('limitModal.message')}</Text>

				<View style={styles.actionButtonContainer}>
					<TouchableOpacity style={styles.confirmButton} onPress={handleClose} activeOpacity={0.8}>
						<Text style={styles.confirmButtonText}>{t('limitModal.okayButton')}</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity style={styles.modalBackdrop} onPress={handleClose} />
		</View>
	);
};

export default ClanLimitModal;
