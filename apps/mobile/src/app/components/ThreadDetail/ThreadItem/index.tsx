import { getUpdateOrAddClanChannelCache, save, STORAGE_DATA_CLAN_CHANNEL_CACHE } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import type { ChannelsEntity, MessagesEntity, ThreadsEntity } from '@mezon/store-mobile';
import {
	channelsActions,
	getStoreAsync,
	listChannelRenderAction,
	selectLastMessageIdByChannelId,
	selectMemberClanByUserId,
	selectMessageEntityById,
	useAppSelector
} from '@mezon/store-mobile';
import i18n from '@mezon/translations';
import type { IChannelMember } from '@mezon/utils';
import { convertTimeMessage } from '@mezon/utils';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { safeJSONParse } from 'mezon-js';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import MezonIconCDN from '../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../constants/icon_cdn';
import { useMessageSender } from '../../../hooks/useMessageSender';
import useTabletLandscape from '../../../hooks/useTabletLandscape';
import type { AppStackParamList } from '../../../navigation/ScreenTypes';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { style } from './ThreadItem.style';

interface IThreadItemProps {
	thread: ThreadsEntity;
}
const ThreadItem = ({ thread }: IThreadItemProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const navigation = useNavigation<NavigationProp<AppStackParamList>>();
	const messageId = useAppSelector((state) => selectLastMessageIdByChannelId(state, thread?.channel_id as string));
	const message = useAppSelector(
		(state) => selectMessageEntityById(state, thread?.channel_id as string, messageId || thread?.last_sent_message?.id) as MessagesEntity
	);
	const user = useAppSelector((state) =>
		selectMemberClanByUserId(state, (message?.user?.id || thread?.last_sent_message?.sender_id) as string)
	) as IChannelMember;
	const isTabletLandscape = useTabletLandscape();

	const { username } = useMessageSender(user);

	const handleNavigateThread = async (thread?: ThreadsEntity) => {
		const clanId = thread?.clan_id;
		const store = await getStoreAsync();
		if (isTabletLandscape) {
			navigation.goBack();
		} else {
			navigation.navigate(APP_SCREEN.HOME_DEFAULT);
		}
		const channelId = thread?.channel_id;
		store.dispatch(
			listChannelRenderAction.addThreadToListRender({
				clanId: clanId ?? '',
				channel: thread as ChannelsEntity
			})
		);
		requestAnimationFrame(async () => {
			store.dispatch(channelsActions.upsertOne({ clanId: clanId ?? '', channel: thread as ChannelsEntity }));
			await store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId, noFetchMembers: false }));
		});
		const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
		save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
	};

	const lastTimeMessage = useMemo(() => {
		if (message && message.create_time_seconds) {
			return convertTimeMessage(message.create_time_seconds, i18n.language);
		} else {
			if (thread && thread.last_sent_message && thread.last_sent_message.timestamp_seconds) {
				return convertTimeMessage(thread.last_sent_message.timestamp_seconds, i18n.language);
			}
		}
	}, [message, thread]);

	const checkType = useMemo(() => typeof thread.last_sent_message?.content === 'string', [thread.last_sent_message?.content]);
	const lastSentMessage = useMemo(() => {
		return (
			(message?.content?.t as string) ??
			(thread.last_sent_message && checkType
				? safeJSONParse(thread.last_sent_message.content || '{}')?.t
				: (thread.last_sent_message?.content as any)?.t || '')
		);
	}, [checkType, message?.content?.t, thread.last_sent_message]);

	return (
		<Pressable
			onPress={() => {
				handleNavigateThread(thread);
			}}
			style={styles.threadItemWrapper}
		>
			<View style={styles.flex1}>
				<Text style={styles.threadName}>{thread?.channel_label}</Text>
				<View style={styles.threadContent}>
					<View style={styles.username}>
						{username && (
							<Text numberOfLines={1} style={styles.textThreadCreateBy}>
								{username}
							</Text>
						)}
						<Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageContent}>
							{lastSentMessage}
						</Text>
					</View>
					<View style={styles.dateString}>
						<Text style={styles.bullet}>•</Text>
						<Text numberOfLines={1} style={styles.createTime}>
							{lastTimeMessage}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.iconMargin}>
				<MezonIconCDN icon={IconCDN.chevronSmallRightIcon} width={25} height={25} color={themeValue.textDisabled} />
			</View>
		</Pressable>
	);
};

export default ThreadItem;
