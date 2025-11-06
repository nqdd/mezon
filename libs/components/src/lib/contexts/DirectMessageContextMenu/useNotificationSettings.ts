import type { MuteChannelPayload } from '@mezon/store';
import { notificationSettingActions, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { EMuteState } from '@mezon/utils';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface UseNotificationSettingsParams {
	channelId?: string;
	notificationSettings?: any;
	getChannelId?: string;
}

export function useNotificationSettings({ channelId, notificationSettings, getChannelId }: UseNotificationSettingsParams) {
	const { t } = useTranslation('directMessage');
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId);
	const [mutedUntilText, setMutedUntilText] = useState<string>('');
	const [nameChildren, setNameChildren] = useState<string>('');

	const muteOrUnMuteChannel = useCallback(
		(channelId: string, active: number, channelType?: number) => {
			if (!channelId) return;
			dispatch(notificationSettingActions.updateNotiState({ channelId, active }));
			const body = {
				channel_id: channelId,
				mute_time: 0,
				active
			};

			dispatch(notificationSettingActions.setMuteChannel(body));
		},
		[dispatch]
	);

	const handleScheduleMute = useCallback(
		(channelId: string, duration: number) => {
			if (!channelId) return;

			dispatch(notificationSettingActions.updateNotiState({ channelId, active: EMuteState.MUTED }));
			const body: MuteChannelPayload = {
				channel_id: channelId,
				mute_time: duration,
				active: 0,
				clan_id: currentClanId || ''
			};
			dispatch(notificationSettingActions.setMuteChannel(body));
		},
		[dispatch, currentClanId]
	);

	const getNotificationSetting = useCallback(
		async (channelId?: string) => {
			if (channelId) {
				await dispatch(
					notificationSettingActions.getNotificationSetting({
						channelId
					})
				);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		const isDefaultSetting = !notificationSettings?.id || notificationSettings?.id === '0';
		const isCurrentlyMuted = !isDefaultSetting && notificationSettings?.active === EMuteState.MUTED;
		const hasActiveMuteTime =
			!isDefaultSetting && notificationSettings?.time_mute ? new Date(notificationSettings.time_mute) > new Date() : false;
		const shouldShowUnmute = isCurrentlyMuted || hasActiveMuteTime;

		setNameChildren(shouldShowUnmute ? t('contextMenu.unmute') : t('contextMenu.mute'));

		setMutedUntilText(
			hasActiveMuteTime && notificationSettings?.time_mute
				? t('contextMenu.mutedUntil', { time: format(new Date(notificationSettings.time_mute), 'dd/MM, HH:mm') })
				: ''
		);
	}, [notificationSettings, dispatch, getChannelId]);

	return {
		mutedUntilText,
		nameChildren,
		muteOrUnMuteChannel,
		handleScheduleMute,
		getNotificationSetting
	};
}
