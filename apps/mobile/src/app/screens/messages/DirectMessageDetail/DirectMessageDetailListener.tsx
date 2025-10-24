import { ChatContext, MobileEventEmitter } from '@mezon/core';
import { ActionEmitEvent, STORAGE_CLAN_ID, STORAGE_IS_LAST_ACTIVE_TAB_DM, load, save } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { clansActions, directActions, fetchUserChannels, selectDmGroupCurrentId, sleep, useAppDispatch } from '@mezon/store-mobile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ChannelType } from 'mezon-js';
import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, DeviceEventEmitter, Platform, StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';
import useTabletLandscape from '../../../hooks/useTabletLandscape';
import ReasonPopup from '../../home/homedrawer/components/ChannelVoice/ReasonPopup';

export const DirectMessageDetailListener = memo(({ dmType, directMessageId }: { dmType: number; directMessageId: string }) => {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const navigation = useNavigation();
	const dispatch = useAppDispatch();
	const currentDirectId = useSelector(selectDmGroupCurrentId);
	const { t } = useTranslation(['directMessage']);

	const isFetchMemberChannelDmRef = useRef(false);
	const { handleReconnect } = useContext(ChatContext);
	const appStateRef = useRef(AppState.currentState);

	console.log('listener dmType', dmType, ' directMessageId', directMessageId);

	const fetchMemberChannel = async () => {
		DeviceEventEmitter.emit(ActionEmitEvent.SHOW_KEYBOARD, null);
		const currentClanIdCached = await load(STORAGE_CLAN_ID);
		if (!currentClanIdCached) {
			return;
		}
		dispatch(clansActions.setCurrentClanId(currentClanIdCached));
		// Rejoin previous clan (other than 0) when exiting the DM detail screen
		dispatch(clansActions.joinClan({ clanId: currentClanIdCached }));
		handleReconnect('DM detail reconnect attempt');
		dispatch(directActions.fetchDirectMessage({ noCache: true }));
	};

	const directMessageLoader = useCallback(async () => {
		save(STORAGE_IS_LAST_ACTIVE_TAB_DM, 'true');
		if (dmType === ChannelType.CHANNEL_TYPE_GROUP) {
			dispatch(
				fetchUserChannels({
					channelId: directMessageId,
					isGroup: true
				})
			);
		}
		await dispatch(
			directActions.joinDirectMessage({
				directMessageId,
				type: dmType,
				noCache: true,
				isFetchingLatestMessages: true,
				isClearMessage: true
			})
		);
		handleReconnect('DM detail reconnect attempt loader');
	}, [directMessageId, dispatch, dmType, handleReconnect]);

	useFocusEffect(
		useCallback(() => {
			if (Platform.OS === 'android') {
				StatusBar.setBackgroundColor(themeValue.primary);
			}
			requestAnimationFrame(async () => {
				handleReconnect('DM detail reconnect attempt loader');
			});
		}, [handleReconnect, themeValue.primary])
	);

	useEffect(() => {
		directMessageLoader();
	}, [directMessageLoader]);

	useEffect(() => {
		const blurListener = navigation.addListener('blur', () => {
			if (Platform.OS === 'android') {
				StatusBar.setBackgroundColor(themeValue.secondary);
			}
		});
		return () => {
			blurListener();
		};
	}, [navigation, themeValue.secondary]);

	useEffect(() => {
		const onMentionHashtagDM = DeviceEventEmitter.addListener(ActionEmitEvent.FETCH_MEMBER_CHANNEL_DM, ({ isFetchMemberChannelDM }) => {
			isFetchMemberChannelDmRef.current = isFetchMemberChannelDM;
		});
		return () => {
			onMentionHashtagDM.remove();
		};
	}, []);

	const onRemoveUserChannel = useCallback(
		async ({ channelId, channelType }) => {
			if (channelId === currentDirectId && channelType === ChannelType.CHANNEL_TYPE_GROUP) {
				DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
				DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
				await sleep(200);
				const data = {
					children: <ReasonPopup title={t('remove.title')} confirmText={t('remove.button')} content={t('remove.content')} />
				};
				dispatch(directActions.setDmGroupCurrentId(''));
				DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
				if (!isTabletLandscape) navigation.goBack();
			}
		},
		[currentDirectId]
	);

	useEffect(() => {
		MobileEventEmitter?.addListener?.(ActionEmitEvent.ON_REMOVE_USER_CHANNEL, onRemoveUserChannel);
		return () => {
			MobileEventEmitter?.removeListener?.(ActionEmitEvent.ON_REMOVE_USER_CHANNEL, () => {});
		};
	}, []);

	useEffect(() => {
		return () => {
			save(STORAGE_IS_LAST_ACTIVE_TAB_DM, 'false');
			dispatch(directActions.setDmGroupCurrentId(''));
			if (!isFetchMemberChannelDmRef.current) {
				requestAnimationFrame(async () => {
					await fetchMemberChannel();
				});
			}
		};
	}, [isFetchMemberChannelDmRef]);

	const handleAppStateChange = async (state: string) => {
		if (state === 'active' && currentDirectId) {
			directMessageLoader();
		}
	};

	const handleAppStateChangeListener = (nextAppState: typeof AppState.currentState) => {
		if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
			handleAppStateChange(nextAppState);
		}

		appStateRef.current = nextAppState;
	};

	useEffect(() => {
		const appStateSubscription = AppState.addEventListener('change', handleAppStateChangeListener);
		return () => {
			appStateSubscription.remove();
		};
	}, [currentDirectId]);

	return <View />;
});
