import { useMemberStatus } from '@mezon/core';
import { size, useTheme } from '@mezon/mobile-ui';
import { selectAllAccount, selectUserStatus } from '@mezon/store-mobile';
import { EUserStatus } from '@mezon/utils';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { style } from './styles';

const StatusProfile = () => {
	const isTabletLandscape = useTabletLandscape();
	const userProfile = useSelector(selectAllAccount);
	const { themeValue } = useTheme();
	const styles = style(themeValue, isTabletLandscape);
	const memberStatus = useMemberStatus(userProfile?.user?.id || '');
	const userStatus = useSelector(selectUserStatus);

	const userStatusIcon = useMemo(() => {
		const mobileIconSize = isTabletLandscape ? size.s_20 : size.s_18;
		switch (userStatus?.status) {
			case EUserStatus.ONLINE:
				if (memberStatus?.isMobile) {
					return <MezonIconCDN icon={IconCDN.mobileDeviceIcon} color="#16A34A" width={mobileIconSize} height={mobileIconSize} />;
				}
				return memberStatus?.status ? (
					<MezonIconCDN icon={IconCDN.onlineStatusIcon} color="#16A34A" width={size.s_20} height={size.s_20} />
				) : (
					<MezonIconCDN icon={IconCDN.offlineStatusIcon} color="#AEAEAE" width={size.s_16} height={size.s_16} />
				);

			case EUserStatus.IDLE:
				return <MezonIconCDN icon={IconCDN.idleStatusIcon} color="#F0B232" width={size.s_20} height={size.s_20} />;

			case EUserStatus.DO_NOT_DISTURB:
				return <MezonIconCDN icon={IconCDN.disturbStatusIcon} color="#F23F43" />;

			case EUserStatus.INVISIBLE:
				return <MezonIconCDN icon={IconCDN.offlineStatusIcon} color="#AEAEAE" width={size.s_16} height={size.s_16} />;

			default:
				return <MezonIconCDN icon={IconCDN.onlineStatusIcon} color="#16A34A" width={size.s_20} height={size.s_20} />;
		}
	}, [isTabletLandscape, memberStatus, userStatus]);

	return (
		<View
			style={[
				{
					backgroundColor: themeValue.tertiary,
					borderRadius: size.s_20,
					position: 'absolute',
					bottom: -size.s_2,
					right: -size.s_4
				},
				styles.dotStatusUser
			]}
		>
			{userStatusIcon}
		</View>
	);
};

export default memo(StatusProfile);
