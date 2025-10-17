import { ENotificationTypes } from '@mezon/utils';

export enum ENotificationActive {
	ON = 1,
	OFF = 0
}

export enum ENotificationChannelId {
	Default = '0'
}

export const getNotifyLabels = (t: (key: string) => string): Record<number, string> => ({
	[ENotificationTypes.ALL_MESSAGE]: t('notificationSetting:bottomSheet.labelOptions.allMessage'),
	[ENotificationTypes.MENTION_MESSAGE]: t('notificationSetting:bottomSheet.labelOptions.mentionMessage'),
	[ENotificationTypes.NOTHING_MESSAGE]: t('notificationSetting:bottomSheet.labelOptions.notThingMessage')
});

export interface IOptionsNotification {
	id: number;
	label: string;
	isChecked: boolean;
	value: ENotificationTypes;
}
