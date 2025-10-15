import {
	appActions,
	getFirstMessageOfTopic,
	messagesActions,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectIsShowCanvas,
	topicsActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface UseNotificationJumpProps {
	messageId?: string;
	channelId?: string;
	clanId?: string;
	topicId?: string;
	isTopic: boolean;
	mode?: number;
	onCloseTooltip?: () => void;
}

export const useNotificationJump = ({ messageId, channelId, clanId, topicId, isTopic, mode, onCloseTooltip }: UseNotificationJumpProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentClanId = useAppSelector(selectCurrentClanId);
	const currentChannelId = useAppSelector(selectCurrentChannelId);
	const isShowCanvas = useSelector(selectIsShowCanvas);

	const handleJumpToTopic = useCallback(async () => {
		if (!topicId || !channelId || !clanId || !messageId) return;

		const isClanChanged = currentClanId !== clanId;
		const isChannelChanged = currentChannelId !== channelId;
		const channelPath = `/chat/clans/${clanId}/channels/${channelId}`;

		if (isClanChanged || isChannelChanged) {
			await navigate(channelPath);
		} else if (navigate) {
			navigate(channelPath);
		}

		dispatch(topicsActions.setIsShowCreateTopic(true));
		dispatch(topicsActions.setCurrentTopicId(topicId));
		dispatch(getFirstMessageOfTopic(topicId));

		dispatch(messagesActions.setIdMessageToJump({ id: messageId, navigate: false }));
	}, [currentClanId, currentChannelId, clanId, channelId, topicId, messageId, navigate, dispatch]);

	const handleJumpToMessage = useCallback(() => {
		if (!messageId || !channelId || !clanId) return;

		dispatch(
			messagesActions.jumpToMessage({
				clanId: clanId || '',
				messageId,
				channelId,
				mode,
				navigate
			})
		);
	}, [dispatch, messageId, channelId, clanId, mode, navigate]);

	const handleClickJump = useCallback(async () => {
		onCloseTooltip?.();
		if (isShowCanvas) {
			dispatch(appActions.setIsShowCanvas(false));
		}
		if (isTopic) {
			await handleJumpToTopic();
			return;
		}

		handleJumpToMessage();
	}, [isTopic, handleJumpToTopic, handleJumpToMessage, onCloseTooltip, isShowCanvas, dispatch]);

	return {
		handleClickJump,
		handleJumpToTopic,
		handleJumpToMessage
	};
};
