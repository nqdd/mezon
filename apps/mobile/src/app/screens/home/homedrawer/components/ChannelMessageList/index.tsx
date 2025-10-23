import { ELoadMoreDirection } from '@mezon/chat-scroll';
import { size, useTheme } from '@mezon/mobile-ui';
import { MessagesEntity } from '@mezon/store-mobile';
import React, { useCallback, useMemo } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { FlatList } from 'react-native-gesture-handler';
import { style } from './styles';

interface IChannelListMessageProps {
	flatListRef: React.RefObject<FlatList<MessagesEntity>>;
	messages: MessagesEntity[];
	handleScroll: (event) => void;
	renderItem: ({ item }: { item: MessagesEntity }) => React.ReactElement;
	onLoadMore: (direction: ELoadMoreDirection) => void;
	isLoadMoreBottom: boolean;
}

export const ViewLoadMore = ({ isLoadMoreTop = false }: { isLoadMoreTop?: boolean }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	return (
		<View style={[styles.wrapperLoadMore, isLoadMoreTop ? { top: 0 } : { bottom: 0 }]}>
			<Flow size={size.s_30} color={themeValue.text} />
		</View>
	);
};

const ChannelListMessage = React.memo(
	({ flatListRef, messages, handleScroll, renderItem, onLoadMore, isLoadMoreBottom }: IChannelListMessageProps) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);

		const keyExtractor = useCallback((message) => `${message?.id}_${message?.channel_id}`, []);

		const isCannotLoadMore = useMemo(() => {
			const lastMessage = messages?.[messages?.length - 1];

			return lastMessage?.sender_id === '0' && !lastMessage?.content?.t && lastMessage?.username?.toLowerCase() === 'system';
		}, [messages]);

		const handleEndReached = useCallback(() => {
			if (messages?.length && !isCannotLoadMore) {
				onLoadMore(ELoadMoreDirection.top);
			}
		}, [messages?.length, isCannotLoadMore, onLoadMore]);

		const handleScrollBeginDrag = useCallback(() => {
			Keyboard.dismiss();
		}, []);

		const onScrollToIndexFailed = useCallback(
			(info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
				const wait = new Promise((resolve) => setTimeout(resolve, 200));
				if (info?.highestMeasuredFrameIndex < info?.index && info?.index <= messages?.length) {
					flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true, viewPosition: 0.5 });
					wait.then(() => {
						flatListRef.current?.scrollToIndex({ index: info?.index, animated: true, viewPosition: 0.5 });
					});
				}
			},
			[flatListRef, messages?.length]
		);

		const viewabilityConfig = useMemo(
			() => ({
				minimumViewTime: 0,
				viewAreaCoveragePercentThreshold: 0,
				itemVisiblePercentThreshold: 0,
				waitForInteraction: false
			}),
			[]
		);

		const maintainVisibleConfig = useMemo(
			() => ({
				minIndexForVisible: Platform.OS === 'android' ? 1 : 10,
				autoscrollToTopThreshold: isLoadMoreBottom ? undefined : 100
			}),
			[isLoadMoreBottom]
		);

		return (
			<FlatList
				data={messages}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				inverted={true}
				bounces={false}
				showsVerticalScrollIndicator={true}
				contentContainerStyle={styles.listChannels}
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				windowSize={10}
				onEndReachedThreshold={0.5}
				maintainVisibleContentPosition={maintainVisibleConfig}
				ref={flatListRef}
				onMomentumScrollEnd={handleScroll}
				keyboardShouldPersistTaps={'handled'}
				updateCellsBatchingPeriod={50}
				onEndReached={handleEndReached}
				onScrollBeginDrag={handleScrollBeginDrag}
				viewabilityConfig={viewabilityConfig}
				onScrollToIndexFailed={onScrollToIndexFailed}
			/>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.messages === nextProps.messages &&
			prevProps.isLoadMoreBottom === nextProps.isLoadMoreBottom &&
			prevProps.flatListRef === nextProps.flatListRef
		);
	}
);
export default ChannelListMessage;
