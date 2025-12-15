import notifee, { AndroidCategory, AndroidImportance, AndroidLaunchActivityFlag, AndroidStyle } from '@notifee/react-native';
import { Platform } from 'react-native';

type ShowOngoingCallParams = {
	directMessageId: string;
	receiverId: string;
	receiverName?: string;
	receiverAvatar?: string;
	isVideoCall?: boolean;
	startedAt?: number;
	pressActivity?: 'com.mezon.mobile.CallActivity' | 'com.mezon.mobile.MainActivity';
	androidImportance?: AndroidImportance;
};

export const getOngoingNotificationId = (directMessageId: string) => `ongoing-call-${directMessageId}`;

export const clearOngoingCallNotification = async (notificationId?: string) => {
	if (!notificationId) return;
	try {
		await notifee.cancelDisplayedNotification(notificationId);
		await notifee.cancelNotification(notificationId);
	} catch (error) {
		console.error('Failed to clear ongoing call notification', error);
	}
};

export const showOngoingCallNotification = async ({
	directMessageId,
	receiverId,
	receiverName,
	receiverAvatar,
	isVideoCall,
	startedAt,
	pressActivity = 'com.mezon.mobile.CallActivity',
	androidImportance = AndroidImportance.DEFAULT
}: ShowOngoingCallParams): Promise<string | undefined> => {
	try {
		const notificationId = getOngoingNotificationId(directMessageId);
		const timestamp = startedAt || Date.now();

		const androidChannelId =
			Platform.OS === 'android'
				? await notifee.createChannel({
						id: 'ongoing-call',
						name: 'Ongoing Calls',
						importance: androidImportance
					})
				: undefined;

		await notifee.displayNotification({
			id: notificationId,
			title: receiverName || 'Ongoing call',
			subtitle: isVideoCall ? 'Video call' : 'Voice call',
			body: 'Tap to return to the call',
			data: { channelId: directMessageId, receiverId },
			android:
				Platform.OS === 'android'
					? {
							channelId: androidChannelId as string,
							category: AndroidCategory.CALL,
							smallIcon: 'ic_notification',
							color: '#7029c1',
							largeIcon: receiverAvatar || undefined,
							ongoing: true,
							onlyAlertOnce: true,
							autoCancel: false,
							showChronometer: true,
							chronometerDirection: 'up',
							timestamp,
							pressAction: {
								id: 'default',
								launchActivity: pressActivity,
								launchActivityFlags: [
									AndroidLaunchActivityFlag.SINGLE_TOP,
									AndroidLaunchActivityFlag.NEW_TASK,
									AndroidLaunchActivityFlag.CLEAR_TOP
								]
							},
							style: {
								type: AndroidStyle.BIGTEXT,
								text: isVideoCall ? 'Video call in progress' : 'Voice call in progress'
							}
						}
					: undefined,
			ios: {
				threadId: 'ongoing-call',
				categoryId: 'ongoing-call',
				foregroundPresentationOptions: {
					badge: false,
					sound: false,
					banner: true,
					list: true
				}
			}
		});

		return notificationId;
	} catch (error) {
		console.error('Failed to display ongoing call notification', error);
		return undefined;
	}
};
