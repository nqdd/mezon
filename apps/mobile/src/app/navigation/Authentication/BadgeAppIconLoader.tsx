import { useFriends } from '@mezon/core';
import { selectAnyUnreadChannel, selectBadgeCountAllClan, selectTotalUnreadDM, useAppSelector } from '@mezon/store-mobile';
import { useEffect, useRef } from 'react';
import { AppState, NativeModules } from 'react-native';
import { useSelector } from 'react-redux';

const { BadgeModule } = NativeModules;
export const BadgeAppIconLoader = () => {
	const hasUnreadChannel = useAppSelector((state) => selectAnyUnreadChannel(state));
	const allNotificationReplyMentionAllClan = useSelector(selectBadgeCountAllClan);
	const totalUnreadMessages = useSelector(selectTotalUnreadDM);
	const { quantityPendingRequest } = useFriends();
	const appState = useRef<string>(AppState.currentState);

	const updateBadgeCount = () => {
		try {
			let notificationCountAllClan = 0;
			notificationCountAllClan = allNotificationReplyMentionAllClan < 0 ? 0 : allNotificationReplyMentionAllClan;
			const notificationCount = notificationCountAllClan + totalUnreadMessages + quantityPendingRequest;

			if (hasUnreadChannel && !notificationCount) {
				BadgeModule?.setBadgeCount?.(0);
				return;
			}
			BadgeModule?.setBadgeCount?.(notificationCount);
		} catch (e) {
			console.error('log  => error BadgeAppIconLoader', e);
		}
	};

	// Handle app state changes
	useEffect(() => {
		const handleAppStateChange = (nextAppState: string) => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				// App has come to the foreground - trigger badge update
				updateBadgeCount();
			}
			appState.current = nextAppState;
		};

		const subscription = AppState.addEventListener('change', handleAppStateChange);

		return () => subscription?.remove();
	}, [allNotificationReplyMentionAllClan, totalUnreadMessages, quantityPendingRequest, hasUnreadChannel]);

	// Original effect for when dependencies change
	useEffect(() => {
		updateBadgeCount();
	}, [allNotificationReplyMentionAllClan, totalUnreadMessages, quantityPendingRequest, hasUnreadChannel]);

	return null;
};
