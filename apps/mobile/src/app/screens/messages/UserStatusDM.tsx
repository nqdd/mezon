import { size } from '@mezon/mobile-ui';
import { getStore, selectClanMembersMetaEntities } from '@mezon/store-mobile';
import React from 'react';
import { UserStatus } from '../../components/UserStatus';

export const UserStatusDM = ({ isOnline, status = '', userId }: { isOnline: boolean; status?: string; userId: string }) => {
	const customStatus = (): {
		status: string;
		isMobile: boolean;
		online: boolean;
	} => {
		try {
			let isMobile = false;
			let online = false;
			const store = getStore();
			const membersMetaEntities = selectClanMembersMetaEntities(store.getState());
			if (membersMetaEntities[userId]?.isMobile) {
				isMobile = true;
			}
			if (membersMetaEntities[userId]?.online) {
				online = true;
			}

			return {
				online,
				status,
				isMobile
			};
		} catch (e) {
			return {
				status,
				online: false,
				isMobile: false
			};
		}
	};

	return (
		<UserStatus
			status={{ status: isOnline || customStatus()?.online, isMobile: customStatus()?.isMobile }}
			iconSize={size.s_10}
			customStatus={customStatus()?.status}
			customStyles={{ zIndex: 100 }}
		/>
	);
};
