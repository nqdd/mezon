import { selectAllRolesClan } from '@mezon/store';
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

	// Build userId → { color, icon } từ role.role_user_list.role_users
	// Dùng role_user_list thay vì selectAllUserClans để tránh iterate toàn bộ members
	// role_user_list được load từ listRoles API và được preserve khi socket UPDATE role (color/icon)
	const userColorMap = useMemo(() => {
		const map = new Map<string, { color: string; icon: string; max_level_permission: number }>();

		rolesClan.forEach((role) => {
			if (!role?.id) return;
			const roleLevel = role.max_level_permission ?? 0;
			const roleColor = role.color || DEFAULT_ROLE_COLOR;
			const roleIcon = role?.role_icon || '';

			role?.role_user_list?.role_users?.forEach((user) => {
				if (!user?.id) return;

				const existing = map.get(user.id);

				if (!existing) {
					map.set(user.id, { color: roleColor, icon: roleIcon, max_level_permission: roleLevel });
					return;
				}

				// Ưu tiên role có max_level_permission cao hơn để lấy color
				if (roleLevel > existing.max_level_permission) {
					map.set(user.id, {
						color: roleColor,
						// Nếu role mới không có icon, giữ lại icon từ role cũ
						icon: roleIcon || existing.icon,
						max_level_permission: roleLevel
					});
					return;
				}

				// Role hiện tại có level cao hơn hoặc bằng, nhưng chưa có icon → lấy icon từ role này nếu có
				if (!existing.icon && roleIcon) {
					map.set(user.id, { ...existing, icon: roleIcon });
				}
			});
		});

		return map;
	}, [rolesClan]);

	const contextValue = useMemo(
		() => ({
			getUserHighestRoleColor: (userId: string) => userColorMap.get(userId)?.color || DEFAULT_ROLE_COLOR,
			getUserHighestRoleIcon: (userId: string) => userColorMap.get(userId)?.icon || ''
		}),
		[userColorMap]
	);

	return <ColorRoleContext.Provider value={contextValue}>{children}</ColorRoleContext.Provider>;
};
