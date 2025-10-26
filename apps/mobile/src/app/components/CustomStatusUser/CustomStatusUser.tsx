import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { size, useTheme } from '@mezon/mobile-ui';
import { accountActions, selectAccountCustomStatus, useAppDispatch } from '@mezon/store-mobile';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import type { IMezonMenuSectionProps } from '../../componentUI/MezonMenu';
import MezonMenu from '../../componentUI/MezonMenu';
import type { IMezonOptionData } from '../../componentUI/MezonOption';
import MezonOption from '../../componentUI/MezonOption';
import { IconCDN } from '../../constants/icon_cdn';
import { ETypeCustomUserStatus } from '../../screens/profile/ProfileScreen';
import { styles } from './CustomStatusUser.styles';

interface ICustomStatusUserProps {
	onPressSetCustomStatus?: () => void;
	userStatus?: string;
	handleCustomUserStatus?: (customStatus: string, type: ETypeCustomUserStatus) => void;
}

export enum EUserStatus {
	ONLINE = 'active',
	IDLE = 'Idle',
	DO_NOT_DISTURB = 'Do Not Disturb',
	INVISIBLE = 'Invisible'
}
export const CustomStatusUser = (props: ICustomStatusUserProps) => {
	const { onPressSetCustomStatus, userStatus, handleCustomUserStatus } = props;
	const { t } = useTranslation(['customUserStatus']);
	const dispatch = useAppDispatch();
	const { dismiss } = useBottomSheetModal();
	const { themeValue } = useTheme();
	const [userStatusOption, setUserStatusOption] = useState<string>(EUserStatus.ONLINE);
	const userCustomStatus = useSelector(selectAccountCustomStatus);

	useEffect(() => {
		switch (userStatus) {
			case EUserStatus.ONLINE:
				setUserStatusOption(EUserStatus.ONLINE);
				break;
			case EUserStatus.DO_NOT_DISTURB:
				setUserStatusOption(EUserStatus.DO_NOT_DISTURB);
				break;
			case EUserStatus.IDLE:
				setUserStatusOption(EUserStatus.IDLE);
				break;
			case EUserStatus.INVISIBLE:
				setUserStatusOption(EUserStatus.INVISIBLE);
				break;
			default:
				setUserStatusOption(EUserStatus.ONLINE);
				break;
		}
	}, [userStatus]);

	const handleStatusChange = useCallback(
		(value: string) => {
			if (!value) return;
			dismiss();
			dispatch(
				accountActions.updateAccountStatus({
					status: value,
					minutes: 0,
					until_turn_on: true
				})
			);
			setUserStatusOption(value);
		},
		[dismiss, dispatch]
	);

	const statusOptions = useMemo(
		() =>
			[
				{
					title: t('userStatus.online'),
					value: EUserStatus.ONLINE,
					icon: <MezonIconCDN icon={IconCDN.onlineStatusIcon} color="#16A34A" height={size.s_12} width={size.s_20} />
				},
				{
					title: t('userStatus.idle'),
					value: EUserStatus.IDLE,
					icon: <MezonIconCDN icon={IconCDN.idleStatusIcon} color="#F0B232" height={size.s_20} width={size.s_20} />
				},
				{
					title: t('userStatus.doNotDisturb'),
					value: EUserStatus.DO_NOT_DISTURB,
					icon: <MezonIconCDN icon={IconCDN.disturbStatusIcon} color="#F23F43" height={size.s_20} width={size.s_20} />
				},
				{
					title: t('userStatus.invisible'),
					value: EUserStatus.INVISIBLE,
					icon: <MezonIconCDN icon={IconCDN.offlineStatusIcon} color="#AEAEAE" height={size.s_12} width={size.s_20} />
				}
			] as IMezonOptionData,
		[]
	);

	const statusMenu = useMemo(
		() =>
			[
				{
					items: [
						{
							title: userCustomStatus ? userCustomStatus : t('setCustomStatus'),
							icon: <MezonIconCDN icon={IconCDN.reactionIcon} height={20} width={20} color={themeValue.textDisabled} />,
							onPress: () => onPressSetCustomStatus(),
							component: userCustomStatus ? (
								<Pressable onPress={() => handleCustomUserStatus('', ETypeCustomUserStatus.Close)}>
									<MezonIconCDN icon={IconCDN.closeIcon} color={themeValue.textStrong} />
								</Pressable>
							) : null
						}
					]
				}
			] as IMezonMenuSectionProps[],
		[handleCustomUserStatus, onPressSetCustomStatus, t, themeValue.textDisabled, themeValue.textStrong, userCustomStatus]
	);

	return (
		<View style={styles.container}>
			<MezonOption title={t('onlineStatus')} data={statusOptions} value={userStatusOption} onChange={handleStatusChange} />

			<MezonMenu menu={statusMenu} />
		</View>
	);
};
