import { ActionEmitEvent } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { channelsActions, selectCurrentClanId, selectFirstChannelWithBadgeByClanId, useAppDispatch } from '@mezon/store-mobile';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { style } from './styles';

const ButtonNewUnread = React.memo(() => {
	const { themeValue } = useTheme();
	const isTabletLandscape = useTabletLandscape();
	const styles = style(themeValue, isTabletLandscape);
	const { t } = useTranslation('channelMenu');
	const currentClanId = useSelector(selectCurrentClanId);
	const dispatch = useAppDispatch();

	const firstChannelBadgeCount = useSelector((state) => selectFirstChannelWithBadgeByClanId(state, currentClanId as string));
	if (firstChannelBadgeCount) {
		const onPressNewUnread = async () => {
			DeviceEventEmitter.emit(ActionEmitEvent.SCROLL_TO_ACTIVE_CHANNEL, firstChannelBadgeCount?.id);
			await dispatch(channelsActions.fetchChannels({ clanId: currentClanId, noCache: true, isMobile: true }));
		};
		return (
			<TouchableOpacity onPress={onPressNewUnread} style={styles.buttonBadgeCount}>
				<Text style={styles.buttonBadgeCountText}>@{t('btnBadgeCount')}</Text>
			</TouchableOpacity>
		);
	}

	return <View />;
});

export default ButtonNewUnread;
