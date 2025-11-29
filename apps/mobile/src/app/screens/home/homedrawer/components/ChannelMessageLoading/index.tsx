import { load, save, STORAGE_CHANNEL_CURRENT_CACHE } from '@mezon/mobile-components';
import type { RootState } from '@mezon/store-mobile';
import { channelsActions, directActions, getStoreAsync, selectCurrentClanId } from '@mezon/store-mobile';
import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageItemSkeleton from '../../../../../components/Skeletons/MessageItemSkeleton';

interface IProps {
	channelId: string;
	isEmptyMsg: boolean;
	isDM: boolean;
	dmType?: number;
}
const DELAY_TIME_REJOIN_CHANNEL = 2000;
export const ChannelMessageLoading = React.memo(({ channelId, isEmptyMsg, isDM, dmType }: IProps) => {
	const isLoading = useSelector((state: RootState) => state?.messages?.loadingStatus);
	const clanId = useSelector(selectCurrentClanId);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const checkChannelCacheLoading = useMemo(() => {
		let isCached = false;
		const channelsCache = load(STORAGE_CHANNEL_CURRENT_CACHE) || [];

		// have cached
		if (channelsCache?.includes(channelId)) {
			isCached = true;
		} else {
			save(STORAGE_CHANNEL_CURRENT_CACHE, [...channelsCache, channelId]);
		}
		return isCached;
	}, [channelId]);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		if (isEmptyMsg) {
			timeoutRef.current = setTimeout(async () => {
				// Re-check if messages are still empty after 2 seconds
				const store = await getStoreAsync();
				const state = store.getState();
				const stillEmpty = !state?.messages?.channelMessages?.[channelId]?.ids?.length;

				if (stillEmpty) {
					if (isDM) {
						store.dispatch(
							directActions.joinDirectMessage({
								directMessageId: channelId,
								type: dmType,
								noCache: true,
								isFetchingLatestMessages: true,
								isClearMessage: true
							})
						);
					} else {
						store.dispatch(
							channelsActions.joinChannel({
								clanId: clanId ?? '',
								channelId,
								noFetchMembers: false,
								isClearMessage: true,
								noCache: true
							})
						);
					}
				}
			}, DELAY_TIME_REJOIN_CHANNEL);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isEmptyMsg, channelId, clanId, isDM, dmType]);

	if (isLoading === 'loading' && !checkChannelCacheLoading && isEmptyMsg) {
		return <MessageItemSkeleton skeletonNumber={8} />;
	}

	return null;
});
