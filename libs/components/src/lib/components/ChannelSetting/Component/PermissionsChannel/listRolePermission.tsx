import { channelUsersActions, selectAllRolesClan, selectCurrentClanId, selectRolesByChannelId, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import type { IChannel } from '@mezon/utils';
import { generateE2eId } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
type ListRolePermissionProps = {
	channel: IChannel;
	selectedRoleIds: string[];
};

const ListRolePermission = (props: ListRolePermissionProps) => {
	const { channel } = props;
	const dispatch = useAppDispatch();
	const RolesChannel = useSelector(selectRolesByChannelId(channel.id));
	const currentClanId = useSelector(selectCurrentClanId);
	const RolesClan = useSelector(selectAllRolesClan);
	const RolesAddChannel = RolesChannel.filter((role) => typeof role.role_channel_active === 'number' && role.role_channel_active === 1);
	const RolesNotAddChannel = RolesClan.filter((role) => !RolesAddChannel.map((RoleAddChannel) => RoleAddChannel.id).includes(role.id));

	const listRolesInChannel = useMemo(() => {
		if (channel.channel_private === 0 || channel.channel_private === undefined) {
			const filteredRoles = RolesNotAddChannel.filter((role) => props.selectedRoleIds.includes(role.id));
			return filteredRoles;
		}
		return RolesChannel.filter((role) => typeof role.role_channel_active === 'number' && role.role_channel_active === 1);
	}, [RolesChannel, props.selectedRoleIds]);

	const deleteRole = async (roleId: string) => {
		const body = {
			channelId: channel.id,
			clanId: currentClanId || '',
			roleId,
			channelType: channel.type
		};
		await dispatch(channelUsersActions.removeChannelRole(body));
	};
	return listRolesInChannel.length !== 0 ? (
		listRolesInChannel.map((role) => (
			<div
				className={`flex justify-between text-theme-primary py-2 rounded`}
				key={role.id}
				data-e2e={generateE2eId('channel_setting_page.permissions.section.member_role_management.role_list.role_item')}
			>
				<div className="flex gap-x-2 items-center">
					{role.role_icon ? (
						<img src={role.role_icon} alt="role icon" className="w-5 h-5 min-w-5 rounded" />
					) : (
						<Icons.RoleIcon defaultSize="w-5 h-5 min-w-5" />
					)}
					<p className="text-sm">{role.title}</p>
				</div>
				<div className="flex items-center gap-x-2">
					<p className="text-xs ">Role</p>
					<div onClick={() => deleteRole(role?.id || '')} role="button">
						<Icons.EscIcon defaultSize="size-[15px] cursor-pointer" />
					</div>
				</div>
			</div>
		))
	) : (
		<div className={`flex justify-between text-theme-primary py-2 rounded`}>
			<div className="flex gap-x-2 items-center">
				<Icons.RoleIcon defaultSize="w-5 h-5 min-w-5" />
				<p className="text-sm ">No Roles</p>
			</div>
		</div>
	);
};

export default React.memo(ListRolePermission);
