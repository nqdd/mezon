import type { DirectEntity } from '@mezon/store';
import { useAppSelector } from '@mezon/store';
import type { ChannelMembersEntity } from '@mezon/store-mobile';
import { selectCurrentClanCreatorId } from '@mezon/store-mobile';
import type { IChannel, UsersClanEntity } from '@mezon/utils';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { MemberProfile } from '../MemberProfile';

interface IMemberItemProps {
	user: ChannelMembersEntity | UsersClanEntity;
	isDM: boolean;
	onPress: (user: ChannelMembersEntity) => void;
	currentChannel?: IChannel | DirectEntity;
	isShowUsername?: boolean;
}

export const MemoizedMemberItem = memo((props: IMemberItemProps) => {
	const { user, ...rest } = props;

	return <MemberItem {...rest} user={user} />;
});

export const MemberItem = memo(({ user, isDM, onPress, currentChannel, isShowUsername = false }: IMemberItemProps) => {
	const currentClanCreatorId = useAppSelector(selectCurrentClanCreatorId);

	return (
		<Pressable
			onPress={() => {
				onPress(user);
			}}
		>
			<MemberProfile
				user={user}
				creatorClanId={currentClanCreatorId}
				currentChannel={currentChannel}
				isDM={isDM}
				isShowUsername={isShowUsername}
			/>
		</Pressable>
	);
});
