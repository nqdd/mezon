import type { ChannelMembersEntity } from '@mezon/store';
import { selectAccountCustomStatus, selectUserStatusById, useAppSelector } from '@mezon/store';
import { useSelector } from 'react-redux';
import { useDirectMessageContextMenu } from '../../contexts';
import { BaseMemberProfile } from '../MemberProfile/MemberProfile';
import AddedByUser from './AddedByUser';
export type MemberItemProps = {
	user: ChannelMembersEntity;

	directMessageId?: string;
	isMobile?: boolean;
	isDM?: boolean;
	isMe?: boolean;
	createId?: string;
};

function MemberItem({ user, directMessageId, isDM = true, isMe, createId }: MemberItemProps) {
	const userCustomStatus = 'Timeeeeeeeeeeeeeeeeeeeeeee';
	const userMetaById = useAppSelector((state) => selectUserStatusById(state, user?.user?.id || ''));
	const currentUserCustomStatus = useSelector(selectAccountCustomStatus);
	const { showContextMenu, setCurrentUser, openProfileItem } = useDirectMessageContextMenu();
	const handleClick = (event: React.MouseEvent) => {
		setCurrentUser(user);
		openProfileItem(event, user);
	};

	return (
		<div>
			<BaseMemberProfile
				id={user?.user?.id || ''}
				user={user}
				avatar={user.user?.avatar_url || ''}
				username={user.user?.display_name || user.user?.username || ''}
				userMeta={{
					online: !!userMetaById?.online || !!isMe,
					status: userMetaById?.status
				}}
				isOwner={createId === user?.user?.id}
				userStatus={isMe ? currentUserCustomStatus : userCustomStatus}
				onContextMenu={showContextMenu}
				onClick={handleClick}
			/>
			<AddedByUser groupId={directMessageId || ''} userId={user?.id} />
		</div>
	);
}

export default MemberItem;
