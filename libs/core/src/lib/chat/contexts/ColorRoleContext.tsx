import { selectAllRolesClan, selectAllUserClans } from '@mezon/store';
import { DEFAULT_ROLE_COLOR } from '@mezon/utils';
import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

type ColorRoleContextType = {
	getUserHighestRoleColor: (userId: string) => string;
	getUserHighestRoleIcon: (userId: string) => string;
};

const ColorRoleContext = createContext<ColorRoleContextType | null>(null);

export const useColorRole = () => {
	const context = useContext(ColorRoleContext);
	if (!context) {
		throw new Error('useColorRole must be used within a ColorRoleProvider');
	}
	return context;
};

export const ColorRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const rolesClan = useSelector(selectAllRolesClan);
	const usersClan = useSelector(selectAllUserClans);

	const roleColorMap = useMemo(() => {
		const map = new Map<string, { color: string; icon: string; max_level_permission: number }>();
		rolesClan.forEach((role) => {
			if (!role?.id) return;
			map.set(role.id, {
				color: role.color || DEFAULT_ROLE_COLOR,
				icon: role?.role_icon || '',
				max_level_permission: role.max_level_permission ?? 0
			});
		});
		return map;
	}, [rolesClan]);
	const userColorMap = useMemo(() => {
		const map = new Map<string, { color: string; icon: string }>();
		usersClan.forEach((user) => {
			if (!user?.id || !user.role_id?.length) return;

			let bestColor = DEFAULT_ROLE_COLOR;
			let bestIcon = '';
			let bestLevel = -1;

			user.role_id.forEach((roleId) => {
				const roleData = roleColorMap.get(roleId);
				if (!roleData) return;
				if (roleData.max_level_permission > bestLevel) {
					bestLevel = roleData.max_level_permission;
					bestColor = roleData.color;
				}
				if (!bestIcon && roleData.icon) {
					bestIcon = roleData.icon;
				}
			});

			map.set(user.id, { color: bestColor, icon: bestIcon });
		});
		return map;
	}, [usersClan, roleColorMap]);

	const contextValue = useMemo(
		() => ({
			getUserHighestRoleColor: (userId: string) => userColorMap.get(userId)?.color || DEFAULT_ROLE_COLOR,
			getUserHighestRoleIcon: (userId: string) => userColorMap.get(userId)?.icon || ''
		}),
		[userColorMap]
	);

	return <ColorRoleContext.Provider value={contextValue}>{children}</ColorRoleContext.Provider>;
};
