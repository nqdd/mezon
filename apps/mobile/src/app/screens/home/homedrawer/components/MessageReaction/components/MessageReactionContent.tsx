import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { selectMessageByMessageId, useAppSelector } from '@mezon/store-mobile';
import type { EmojiDataOptionals } from '@mezon/utils';
import { calculateTotalCount, getSrcEmoji } from '@mezon/utils';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import MezonIconCDN from '../../../../../../../../src/app/componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../../../src/app/constants/icon_cdn';
import { combineMessageReactions } from '../../../../../../utils/helpers';
import UserProfile from '../../UserProfile';
import { style } from '../styles';
import { ReactionMember } from './ReactionMember';

interface IMessageReactionContentProps {
	allReactionDataOnOneMessage: EmojiDataOptionals[];
	emojiSelectedId: string | null;
	userId: string | null;
	removeEmoji?: (emoji: EmojiDataOptionals) => void;
	channelId?: string;
	messageId?: string;
}

type ReactionSenderItem = {
	sender_id: string;
	count: number;
	isMyReact: boolean;
	emojiData: EmojiDataOptionals;
};

const { width } = Dimensions.get('window');

export const MessageReactionContent = memo((props: IMessageReactionContentProps) => {
	const { emojiSelectedId, channelId, userId, removeEmoji, messageId } = props;
	const messageReactions = useAppSelector((state) => selectMessageByMessageId(state, channelId, messageId));
	const allReactionDataOnOneMessage = combineMessageReactions(messageReactions?.reactions, messageId);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('message');
	const [isScrollable, setIsScrollable] = useState<boolean>(false);
	const handleContentSizeChange = (contentWidth) => {
		setIsScrollable(contentWidth > width - size.s_20);
	};

	const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
	const prevReactionsRef = useRef<EmojiDataOptionals[]>([]);

	const selectEmoji = (emojiId: string) => {
		setSelectedTabId(emojiId);
	};

	useEffect(() => {
		if (emojiSelectedId) {
			setSelectedTabId(emojiSelectedId);
		}
	}, [emojiSelectedId]);

	const dataSenderEmojis = useMemo(() => {
		return (
			allReactionDataOnOneMessage?.length > 0 &&
			allReactionDataOnOneMessage.reduce((acc, item) => {
				if (item?.emojiId === selectedTabId) {
					acc.push(
						...(item?.senders || []).map((sender) => ({
							...sender,
							isMyReact: sender?.sender_id === userId,
							emojiData: item
						}))
					);
				}
				return acc;
			}, [])
		);
	}, [allReactionDataOnOneMessage, selectedTabId, userId]);

	const currentEmojiSelected = useMemo(() => {
		if (selectedTabId && allReactionDataOnOneMessage?.length > 0) {
			return allReactionDataOnOneMessage.find((emoji) => emoji?.emojiId === selectedTabId);
		}
		return null;
	}, [selectedTabId, allReactionDataOnOneMessage]);

	const isExistingMyEmoji = useMemo(() => {
		return currentEmojiSelected?.senders?.length > 0 && currentEmojiSelected.senders.find((sender) => sender?.sender_id === userId)?.count > 0;
	}, [currentEmojiSelected, userId]);

	const checkToFocusOtherEmoji = useCallback(() => {
		const prevSelected = prevReactionsRef.current?.length > 0 && prevReactionsRef.current?.find((e) => e?.emojiId === selectedTabId);
		const nowSelected = allReactionDataOnOneMessage?.length > 0 && allReactionDataOnOneMessage.find((e) => e?.emojiId === selectedTabId);

		if (calculateTotalCount(prevSelected?.senders || []) > 0 && calculateTotalCount(nowSelected?.senders || []) === 0) {
			const emojiDeletedIndex = prevReactionsRef.current?.findIndex((e) => e?.emojiId === selectedTabId);
			const neighbor = prevReactionsRef.current?.[emojiDeletedIndex - 1] ?? prevReactionsRef.current?.[emojiDeletedIndex + 1] ?? null;
			setSelectedTabId(neighbor?.emojiId || null);
		}
	}, [allReactionDataOnOneMessage, selectedTabId]);

	useEffect(() => {
		if (dataSenderEmojis?.length === 0 && selectedTabId) {
			checkToFocusOtherEmoji();
		}
	}, [checkToFocusOtherEmoji, dataSenderEmojis?.length]);

	useEffect(() => {
		prevReactionsRef.current = allReactionDataOnOneMessage || [];
	}, [allReactionDataOnOneMessage, selectedTabId]);

	const renderRightActions = useCallback(
		(item: ReactionSenderItem) => {
			if (!item?.isMyReact) {
				return null;
			}
			return (
				<TouchableOpacity style={styles.deleteSwipeButton} onPress={() => removeEmoji?.(item?.emojiData)}>
					<MezonIconCDN icon={IconCDN.trashIcon} width={size.s_20} height={size.s_20} color={baseColor.white} />
					<Text style={styles.deleteSwipeText}>{t('reactions.removeActions')}</Text>
				</TouchableOpacity>
			);
		},
		[removeEmoji, t]
	);

	const getTabHeader = () => {
		return (
			<FlatList
				onContentSizeChange={handleContentSizeChange}
				horizontal
				scrollEnabled={isScrollable}
				showsHorizontalScrollIndicator={false}
				data={allReactionDataOnOneMessage || []}
				keyExtractor={(item) => `${item?.emojiId}_TabHeaderEmoji`}
				initialNumToRender={1}
				maxToRenderPerBatch={1}
				windowSize={2}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => selectEmoji(item?.emojiId)}
						style={[styles.tabHeaderItem, selectedTabId === item?.emojiId && styles.activeTab]}
					>
						<FastImage
							source={{
								uri: getSrcEmoji(item?.emojiId || '')
							}}
							resizeMode={'contain'}
							style={styles.iconEmojiReactionDetail}
						/>
						<Text style={[styles.reactCount, styles.headerTabCount]}>{calculateTotalCount(item?.senders || [])}</Text>
					</Pressable>
				)}
			/>
		);
	};

	const renderItem = useCallback(
		({ item, index }: { item: ReactionSenderItem; index: number }) => {
			return (
				<View key={`${index}_${item?.sender_id}_allReactionDataOnOneMessage`} style={styles.reactionListItem}>
					<Swipeable
						key={`${index}_${item?.sender_id}_${item?.emojiData?.emojiId}_reactItem`}
						enabled={item?.isMyReact}
						renderRightActions={() => renderRightActions(item)}
					>
						<ReactionMember
							userId={item?.sender_id || ''}
							channelId={channelId}
							count={item?.count || 0}
							onSelectUserId={() => {
								const data = {
									snapPoints: ['60%', '90%'],
									hiddenHeaderIndicator: true,
									children: <UserProfile userId={item?.sender_id || ''} showAction={true} showRole={true} currentChannel={null} />
								};
								DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
							}}
						/>
					</Swipeable>
				</View>
			);
		},
		[renderRightActions, channelId]
	);

	const getContent = () => {
		return (
			<View style={styles.contentWrapper}>
				<View style={styles.removeEmojiContainer}>
					<Text style={styles.emojiText}>{currentEmojiSelected?.emoji || ''}</Text>
					<View style={styles.deleteEmojiWrapper}>
						{isExistingMyEmoji ? (
							<Pressable style={styles.confirmDeleteEmoji} onPress={() => removeEmoji?.(currentEmojiSelected)}>
								<MezonIconCDN icon={IconCDN.trashIcon} width={size.s_20} height={size.s_20} color={baseColor.white} />
								<Text style={styles.confirmText}>{t('reactions.removeActions')}</Text>
							</Pressable>
						) : null}
					</View>
				</View>
				<FlashList data={dataSenderEmojis || []} renderItem={renderItem} estimatedItemSize={size.s_50} />
			</View>
		);
	};
	return (
		<BottomSheetScrollView stickyHeaderIndices={[0]}>
			{!!allReactionDataOnOneMessage?.length && <View style={styles.contentHeader}>{getTabHeader()}</View>}
			{allReactionDataOnOneMessage?.length ? (
				<View>{getContent()}</View>
			) : (
				<View style={styles.noActionsWrapper}>
					<Text style={styles.noActionTitle}>{t('reactions.noActionTitle')}</Text>
					<Text style={styles.noActionContent}>{t('reactions.noActionDescription')}</Text>
				</View>
			)}
		</BottomSheetScrollView>
	);
});
