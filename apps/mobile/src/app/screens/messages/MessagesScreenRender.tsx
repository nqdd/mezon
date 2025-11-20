import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { acitvitiesActions, directActions, getStore, messagesActions, selectDirectById, useAppDispatch } from '@mezon/store-mobile';
import { sleep } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, FlatList, Keyboard, Platform, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import MessageMenu from '../home/homedrawer/components/MessageMenu';
import { DmListItem } from './DmListItem';
import MessageActivity from './MessageActivity';
import MessageHeader from './MessageHeader';
import MessagesScreenEmpty from './MessagesScreenEmpty';
import { style } from './styles';

const MessagesScreenRender = memo(({ chatList }: { chatList: string }) => {
	const dmGroupChatList: string[] = useMemo(() => {
		try {
			if (!chatList || typeof chatList !== 'string') {
				return [];
			}
			const parsed = JSON.parse(chatList);
			return Array.isArray(parsed) ? parsed : [];
		} catch (error) {
			console.error('Error parsing chat list:', error);
			return [];
		}
	}, [chatList]);

	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const navigation = useNavigation<any>();
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const isTabletLandscape = useTabletLandscape();

	const navigateToNewMessageScreen = useCallback(() => {
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, { screen: APP_SCREEN.MESSAGES.NEW_MESSAGE });
	}, [navigation]);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		dispatch(directActions.fetchDirectMessage({ noCache: true }));
		dispatch(acitvitiesActions.listActivities({ noCache: true }));
		await sleep(500);
		setIsRefreshing(false);
	}, [dispatch]);

	useEffect(() => {
		const dmItemRouter = DeviceEventEmitter.addListener('CHANGE_CHANNEL_DM_DETAIL', ({ dmId = '' }) => {
			requestAnimationFrame(async () => {
				if (!isTabletLandscape) {
					navigation.navigate(APP_SCREEN.MESSAGES.MESSAGE_DETAIL, {
						directMessageId: dmId
					});
				}
				dispatch(directActions.setDmGroupCurrentId(dmId));
				dispatch(messagesActions.setIdMessageToJump(null));
			});
		});
		return () => {
			dmItemRouter.remove();
		};
	}, [dispatch, isTabletLandscape, navigation]);

	const handleLongPress = useCallback((dmId: string) => {
		const store = getStore();
		const directMessage = selectDirectById(store.getState(), dmId);
		const data = {
			heightFitContent: true,
			children: <MessageMenu messageInfo={directMessage} />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
	}, []);

	const renderItem = useCallback(
		({ item }: { item: string }) => {
			return (
				<TouchableOpacity
					onPress={() => {
						DeviceEventEmitter.emit('CHANGE_CHANNEL_DM_DETAIL', { dmId: item });
					}}
					onLongPress={() => handleLongPress(item)}
				>
					<DmListItem id={item} />
				</TouchableOpacity>
			);
		},
		[handleLongPress]
	);

	const HeaderComponent = useMemo(() => <MessageActivity />, []);

	return (
		<View style={styles.container}>
			<LinearGradient
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
				style={[StyleSheet.absoluteFillObject]}
			/>
			<MessageHeader />
			<View style={{ flex: 1 }}>
				<FlatList
					data={dmGroupChatList}
					renderItem={renderItem}
					contentContainerStyle={{
						paddingBottom: size.s_100
					}}
					keyExtractor={(dm) => `${dm}DM_MSG_ITEM`}
					showsVerticalScrollIndicator={true}
					removeClippedSubviews={Platform.OS === 'android'}
					initialNumToRender={15}
					windowSize={5}
					onEndReachedThreshold={0.5}
					onMomentumScrollBegin={() => Keyboard.dismiss()}
					ListHeaderComponent={HeaderComponent}
					keyboardShouldPersistTaps={'handled'}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
					ListEmptyComponent={() => <MessagesScreenEmpty />}
				/>
			</View>
			<Pressable style={styles.addMessage} onPress={navigateToNewMessageScreen}>
				<MezonIconCDN icon={IconCDN.messagePlusIcon} width={size.s_22} height={size.s_22} />
			</Pressable>
		</View>
	);
});

export default MessagesScreenRender;
