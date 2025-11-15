import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import MezonInput from '../../componentUI/MezonInput';
import type { IMezonOptionData } from '../../componentUI/MezonOption';
import MezonOption from '../../componentUI/MezonOption';
import { IconCDN } from '../../constants/icon_cdn';
import { ETypeCustomUserStatus } from '../../screens/profile/ProfileScreen';
import StatusBarHeight from '../StatusBarHeight/StatusBarHeight';
import { styles } from './AddStatusUserModal.styles';

export interface IAddStatusUserModalProps {
	userCustomStatus: string;
	handleCustomUserStatus?: (customStatus: string, type: ETypeCustomUserStatus, duration: number, noClearStatus: boolean) => void;
}

export const AddStatusUserModal = ({ userCustomStatus, handleCustomUserStatus }: IAddStatusUserModalProps) => {
	const [lineStatus, setLineStatus] = useState<string>('');
	const { themeValue } = useTheme();

	const { t } = useTranslation(['customUserStatus']);
	const [statusDuration, setStatusDuration] = useState<number>(-1);
	const timeOptions = useMemo(
		() =>
			[
				{
					title: t('statusDuration.today'),
					value: -1
				},
				{
					title: t('statusDuration.fourHours'),
					value: 240
				},
				{
					title: t('statusDuration.oneHour'),
					value: 60
				},
				{
					title: t('statusDuration.thirtyMinutes'),
					value: 30
				},
				{
					title: t('statusDuration.dontClear'),
					value: 0
				}
			] as IMezonOptionData,
		[t]
	);

	useEffect(() => {
		setLineStatus(userCustomStatus);
		setStatusDuration(-1);
	}, [userCustomStatus]);

	function handleTimeOptionChange(value: number) {
		setStatusDuration(value);
	}

	const handleSaveCustomStatus = () => {
		let minutes = statusDuration;
		let noClear = false;
		if (statusDuration === -1) {
			const now = new Date();
			const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
			const timeDifference = endOfDay.getTime() - now.getTime();
			minutes = Math.floor(timeDifference / (1000 * 60));
		}
		if (statusDuration === 0) {
			noClear = true;
		}
		handleCustomUserStatus(lineStatus?.trim(), ETypeCustomUserStatus.Save, minutes, noClear);
	};

	const onClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	return (
		<View style={[styles.container, { backgroundColor: themeValue.primary }]}>
			<StatusBarHeight />
			<View style={styles.headerModal}>
				<Pressable style={styles.btnClose} onPress={() => onClose()}>
					<MezonIconCDN icon={IconCDN.closeIcon} width={size.s_28} height={size.s_28} color={themeValue.white} />
				</Pressable>
				<Text style={[styles.titleHeader, { color: themeValue.text }]}>{t('editStatus')}</Text>
				<Pressable style={styles.btnSave} onPress={() => handleSaveCustomStatus()}>
					<Text style={[styles.buttonSave]}>{t('save')}</Text>
				</Pressable>
			</View>
			<View style={styles.from}>
				<MezonInput value={lineStatus} onTextChange={setLineStatus} placeHolder={t('placeholder')} textarea={true} maxCharacter={128} />
				<MezonOption title={t('statusDuration.label')} value={statusDuration} data={timeOptions} onChange={handleTimeOptionChange} />
			</View>
		</View>
	);
};
