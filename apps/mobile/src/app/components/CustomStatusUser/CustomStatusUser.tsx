import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { accountActions, useAppDispatch } from '@mezon/store-mobile';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, View } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import MezonMenu, { IMezonMenuSectionProps } from '../../componentUI/MezonMenu';
import MezonOption, { IMezonOptionData } from '../../componentUI/MezonOption';
import { IconCDN } from '../../constants/icon_cdn';
import { ETypeCustomUserStatus } from '../../screens/profile/ProfileScreen';

interface ICustomStatusUserProps {
	onPressSetCustomStatus?: () => void;
	userStatus?: string;
	userCustomStatus?: string;
	handleCustomUserStatus?: (customStatus: string, type: ETypeCustomUserStatus) => Promise<void>;
}

export enum EUserStatus {
	ONLINE = 'active',
	IDLE = 'Idle',
	DO_NOT_DISTURB = 'Do Not Disturb',
	INVISIBLE = 'Invisible'
}
export const CustomStatusUser = (props: ICustomStatusUserProps) => {
	const { onPressSetCustomStatus, userStatus, userCustomStatus, handleCustomUserStatus } = props;
	const { t } = useTranslation(['customUserStatus']);
	const dispatch = useAppDispatch();
	const { dismiss } = useBottomSheetModal();
	const [localCustomStatus, setLocalCustomStatus] = useState<string>(userCustomStatus || '');

	const { themeValue } = useTheme();
	const [userStatusOption, setUserStatusOption] = useState<string>(EUserStatus.ONLINE);

	useEffect(() => {
		const subscription = DeviceEventEmitter.addListener(ActionEmitEvent.ON_UPDATE_CUSTOM_STATUS, (data: string) => {
			setLocalCustomStatus(data);
		});

		return () => {
			subscription && subscription.remove();
		};
	}, []);

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
							title: localCustomStatus ? localCustomStatus : t('setCustomStatus'),
							icon: <MezonIconCDN icon={IconCDN.reactionIcon} height={20} width={20} color={themeValue.textDisabled} />,
							onPress: () => onPressSetCustomStatus(),
							component: localCustomStatus ? (
								<Pressable
									onPress={async () => {
										await handleCustomUserStatus('', ETypeCustomUserStatus.Close);
										setLocalCustomStatus('');
									}}
								>
									<MezonIconCDN icon={IconCDN.closeIcon} color={themeValue.textStrong} />
								</Pressable>
							) : null
						}
					]
				}
			] as IMezonMenuSectionProps[],
		[handleCustomUserStatus, onPressSetCustomStatus, t, themeValue.textDisabled, themeValue.textStrong, localCustomStatus]
	);

	return (
		<View style={{ paddingHorizontal: size.s_20, paddingVertical: size.s_10 }}>
			<MezonOption title={t('onlineStatus')} data={statusOptions} value={userStatusOption} onChange={handleStatusChange} />

			<MezonMenu menu={statusMenu} />
		</View>
	);
};
