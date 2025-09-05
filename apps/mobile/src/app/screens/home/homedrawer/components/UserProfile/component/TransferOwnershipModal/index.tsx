import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { ChannelMembersEntity, selectAllUserClans, selectCurrentClan } from '@mezon/store-mobile';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DeviceEventEmitter, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonAvatar from '../../../../../../../componentUI/MezonAvatar';
import MezonButton, { EMezonButtonSize, EMezonButtonTheme } from '../../../../../../../componentUI/MezonButton';
import MezonIconCDN from '../../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../../constants/icon_cdn';
import { style } from './styles';

interface TransferOwnershipModalProps {
	user: ChannelMembersEntity;
	onTransferOwnership: (newOwnerId: string) => void;
	onClose: () => void;
}

const TransferOwnershipModal = ({ user, onTransferOwnership, onClose }: TransferOwnershipModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['userProfile']);
	const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
	const currentClan = useSelector(selectCurrentClan);
	const clanMembers = useSelector(selectAllUserClans);
	
	const currentOwner = useMemo(() => {
		if (!currentClan?.creator_id || !clanMembers?.length) return null;
		return clanMembers.find(member => member.user?.id === currentClan.creator_id);
	}, [currentClan?.creator_id, clanMembers]);

	const handleTransfer = () => {
		if (isAcknowledged && user?.user?.id) {
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
			onTransferOwnership(user.user.id);
			onClose();
		}
	};

	return (
		<View style={{ height: '100%', overflow: 'hidden' }}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'} style={{ flex: 1 }}>
				<View style={styles.transferVisual}>
					<View style={styles.arrowContainer}>
						<View style={styles.arrowDown} />
					</View>
					<View style={styles.userCircle}>
						<MezonAvatar
							width={size.s_90}
							height={size.s_90}
							avatarUrl={currentOwner.user.avatar_url}
							username={currentOwner.user.username || ''}
							isBorderBoxImage={true}
						/>
					</View>
					<View style={styles.userCircle}>
						<MezonAvatar
							width={size.s_90}
							height={size.s_90}
							avatarUrl={user.user.avatar_url}
							username={user.user.username || ''}
							isBorderBoxImage={true}
						/>
					</View>
				</View>

				<Text style={styles.serverName}>{currentClan?.clan_name}</Text>

				<Text style={styles.warningText}>
					<Trans
						i18nKey={"userProfile:transferOwnershipModal.warning"}
						values={{
							clanName: currentClan?.clan_name,
							username: user?.user?.username || user?.['username']
						}}
						components={{ 
							highlightClan: <Text style={styles.highlightText} />,
							highlightUser: <Text style={styles.highlightText} />
						}}
					/>
				</Text>

				<View style={styles.acknowledgmentSection}>
					<Text style={styles.sectionTitle}>{t('transferOwnershipModal.sectionTitle')}</Text>
					<TouchableOpacity 
						style={styles.checkboxContainer}
						onPress={() => setIsAcknowledged(!isAcknowledged)}
					>
						<View style={[styles.checkbox, isAcknowledged && styles.checkboxChecked]}>
							{isAcknowledged && (
								<MezonIconCDN
									icon={IconCDN.checkmarkSmallIcon}
									width={size.s_16}
									height={size.s_16}
									color={themeValue.text}
								/>
							)}
						</View>
						<Text style={styles.acknowledgmentText}>
							{t('transferOwnershipModal.acknowledgment', { 
								username: user?.user?.username || user?.['username']
							})}
						</Text>
					</TouchableOpacity>
				</View>

				<MezonButton
					onPress={handleTransfer}
					title={t('transferOwnershipModal.transferButton')}
					type={EMezonButtonTheme.THEME}
					size={EMezonButtonSize.LG}
					containerStyle={[styles.button, !isAcknowledged && styles.buttonDisabled]}
					titleStyle={styles.textButton}
					disabled={!isAcknowledged}
				/>
			</KeyboardAvoidingView>
		</View>
	);
};

export default TransferOwnershipModal;
