import { useMemberStatus } from '@mezon/core';
import { size } from '@mezon/mobile-ui';
import React from 'react';
import { UserStatus } from '../../components/UserStatus';

export const UserStatusDM = ({ isOnline, iconSize = size.s_10, userId }: { isOnline: boolean; iconSize?: number; userId: string }) => {
	const statusInfo = useMemberStatus(userId || '');

	return (
		<UserStatus
			status={{ status: isOnline || statusInfo?.online, isMobile: statusInfo?.isMobile }}
			iconSize={iconSize}
			customStatus={statusInfo?.status}
			customStyles={{ zIndex: 100 }}
		/>
	);
};
