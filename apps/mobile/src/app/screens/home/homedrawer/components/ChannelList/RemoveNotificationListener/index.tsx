import { selectCurrentChannel, selectDmGroupCurrentId } from '@mezon/store-mobile';
import notifee from '@notifee/react-native';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';

const RemoveNotificationListener = () => {
	const currentChannel = useSelector(selectCurrentChannel);
	const currentDirectId = useSelector(selectDmGroupCurrentId);

	useEffect(() => {
		const removeNotificationsByChannelId = async () => {
			const channelId = currentDirectId || currentChannel?.channel_id;

			if (!channelId) {
				return;
			}

			try {
				const displayedNotifications = await notifee.getDisplayedNotifications();
				const notificationsToRemove = displayedNotifications.filter((item) => item.notification?.data?.channel === channelId);

				for (const notification of notificationsToRemove) {
					if (notification.id) {
						await notifee.cancelDisplayedNotification(notification.id);
					}
				}
			} catch (error) {
				console.error('Error removing notifications:', error);
			}
		};

		removeNotificationsByChannelId();
	}, [currentChannel?.channel_id, currentDirectId]);
	return null;
};

export default memo(RemoveNotificationListener);
