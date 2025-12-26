import type { ChannelsEntity } from '@mezon/store';
import {
	getStore,
	selectChannelByIdAndClanId,
	selectClanView,
	selectCurrentChannel,
	selectCurrentDM,
	selectDmGroupCurrentId,
	selectMemberClanByUserId,
	selectMemberDMByUserId,
	selectMemberGroupByUserId,
	selectSearchChannelById,
	selectUserStatusById,
	useAppSelector
} from '@mezon/store';
import type { ChannelMembersEntity } from '@mezon/utils';

export const useUserById = (userID: string | undefined): ChannelMembersEntity | undefined => {
	return useAppSelector((state) => {
		if (!userID) return undefined;
		const currentDMId = selectDmGroupCurrentId(state);
		const isClanView = selectClanView(state);
		if (!isClanView) {
			return selectMemberGroupByUserId(state, currentDMId as string, userID as string) as unknown as ChannelMembersEntity;
		} else {
			return selectMemberClanByUserId(state, userID ?? '') as unknown as ChannelMembersEntity;
		}
	});
};

export const useUserMetaById = (userID: string | undefined): any | undefined => {
	return useAppSelector((state) => {
		if (!userID) return undefined;
		const isClanView = selectClanView(state);
		return isClanView
			? (selectUserStatusById(state, userID ?? '')?.status as string | undefined)
			: (selectUserStatusById(state, userID as string)?.user_status as string | undefined);
	});
};

export const useUserByUserId = (userID: string | undefined): ChannelMembersEntity | undefined => {
	return useAppSelector((state) => {
		if (!userID) return undefined;
		const isClanView = selectClanView(state);
		return isClanView
			? (selectMemberClanByUserId(state, userID ?? '') as unknown as ChannelMembersEntity)
			: (selectMemberDMByUserId(state, userID ?? '') as unknown as ChannelMembersEntity);
	});
};

export const useTagById = (tagId: string | undefined): ChannelsEntity | undefined => {
	return useAppSelector((state) => {
		if (!tagId) return undefined;
		return selectSearchChannelById(state, tagId) as unknown as ChannelsEntity;
	});
};

export const getTagByIdOnStored = (clanId: string, tagId: string | undefined): ChannelsEntity | undefined => {
	const store = getStore();
	if (!tagId) return undefined;
	return selectChannelByIdAndClanId(store.getState(), clanId, tagId);
};

export const useCurrentInbox = (): ChannelsEntity | null => {
	return useAppSelector((state) => {
		const isClanView = selectClanView(state);
		return isClanView ? selectCurrentChannel(state) : selectCurrentDM(state);
	});
};
