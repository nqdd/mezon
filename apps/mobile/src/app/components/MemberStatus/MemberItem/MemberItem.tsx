import { STORAGE_MY_USER_ID, load } from '@mezon/mobile-components';
import { ChannelMembersEntity, selectCurrentClan } from '@mezon/store-mobile';
import { UsersClanEntity } from '@mezon/utils';
import { memo, useMemo } from 'react';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { MemberProfile } from '../MemberProfile';

interface IProps {
	user: ChannelMembersEntity;
	isOffline?: boolean;
	onPress?: (user: ChannelMembersEntity) => void;
	creatorChannelId?: string;
	isDMThread?: boolean;
	isMobile?: boolean;
	isHiddenStatus?: boolean;
}

type MemberItemProps = {
	user: ChannelMembersEntity | UsersClanEntity;
	isDMThread?: boolean;
	onPress?: (user: ChannelMembersEntity) => void;
	creatorChannelId?: string;
	isMobile?: boolean;
};

export const MemoizedMemberItem = memo((props: MemberItemProps) => {
	const { user, ...rest } = props;

	return <MemberItem {...rest} user={user} isOffline={!user?.user?.online} isMobile={user?.user?.is_mobile} />;
});

export const MemberItem = memo(({ user, isOffline, onPress, creatorChannelId, isDMThread, isMobile, isHiddenStatus = false }: IProps) => {
	const currentClan = useSelector(selectCurrentClan);
	const userId = useMemo(() => {
		return load(STORAGE_MY_USER_ID);
	}, []);

	const isMe = useMemo(() => {
		return user?.user?.id === userId;
	}, [user?.user?.id, userId]);

	const defaultStatus = { status: false, isMobile: false };
	return (
		<Pressable
			onPress={() => {
				onPress(user);
			}}
		>
			<MemberProfile
				user={user}
				userStatus={isHiddenStatus ? defaultStatus : { status: isMe ? true : !isOffline, isMobile }}
				numCharCollapse={30}
				nickName={user?.clan_nick}
				creatorClanId={currentClan?.creator_id}
				creatorDMId={creatorChannelId}
				isDMThread={isDMThread}
			/>
		</Pressable>
	);
});
