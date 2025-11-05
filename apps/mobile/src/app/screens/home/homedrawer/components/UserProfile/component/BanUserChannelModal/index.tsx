import { ActionEmitEvent } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import type { ChannelMembersEntity } from '@mezon/store-mobile';
import { channelMembersActions, useAppDispatch } from '@mezon/store-mobile';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import type { IMezonOptionData } from '../../../../../../../componentUI/MezonOption';
import MezonOption from '../../../../../../../componentUI/MezonOption';
import useTabletLandscape from '../../../../../../../hooks/useTabletLandscape';
import { style } from './styles';

interface IBuzzMessageModalProps {
	clanId: string;
	channelId: string;
	user: ChannelMembersEntity;
}

export const BanUserChannelModal = memo((props: IBuzzMessageModalProps) => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { user, clanId, channelId } = props;
	const [timeOption, setTimeOption] = useState(10);
	const { t } = useTranslation('userProfile');
	const dispatch = useAppDispatch();

	const timeOptions = useMemo(
		() =>
			[
				{
					title: t('ban.time.tenMinutes'),
					value: 10
				},
				{
					title: t('ban.time.thirtyMinutes'),
					value: 30
				},
				{
					title: t('ban.time.oneHour'),
					value: 60
				},
				{
					title: t('ban.time.sixHours'),
					value: 360
				},
				{
					title: t('ban.time.twelveHours'),
					value: 720
				},
				{
					title: t('ban.time.oneDay'),
					value: 1440
				},
				{
					title: t('ban.time.threeDays'),
					value: 4320
				}
			] as IMezonOptionData,
		[t]
	);

	const onConfirm = useCallback(async () => {
		dispatch(channelMembersActions.banUserChannel({ clanId, channelId, userIds: [user?.id], banTime: timeOption, banMember: true }));
		onClose();
	}, [channelId, clanId, dispatch, timeOption, user?.id]);

	const handleTimeOptionChange = (value: number) => {
		setTimeOption(value);
	};

	const onClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
	};

	return (
		<View style={styles.main}>
			<View style={[styles.container, isTabletLandscape && { maxWidth: '40%' }]}>
				<Text style={styles.modalTitle}>{`${t('ban.title')} ${user?.clan_nick || user?.user?.display_name || user?.user?.username}`}</Text>
				<MezonOption title={t('ban.time.title')} value={timeOption} data={timeOptions} onChange={handleTimeOptionChange} />
				<TouchableOpacity onPress={onConfirm} style={styles.yesButton}>
					<Text style={styles.buttonText}>{t('ban.banButton')}</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity style={styles.backdrop} onPress={onClose} />
		</View>
	);
});
