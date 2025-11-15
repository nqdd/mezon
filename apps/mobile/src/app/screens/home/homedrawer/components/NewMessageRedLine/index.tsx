import { useTheme } from '@mezon/mobile-ui';
import { selectUnreadMessageIdByChannelId, useAppSelector } from '@mezon/store-mobile';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { styles as stylesFn } from './NewMessageRedLine.styles';

interface INewMessageRedLineProps {
	messageId: string;
	channelId: string;
	isEdited?: boolean;
	isSending?: boolean;
	isMe?: boolean;
}

export const NewMessageRedLine = memo((props: INewMessageRedLineProps) => {
	const { channelId = '', messageId = '', isEdited = false, isSending = false, isMe = false } = props;
	const { themeValue } = useTheme();
	const styles = stylesFn(themeValue);
	const { t } = useTranslation('message');
	const lastMessageUnreadId = useAppSelector((state) => selectUnreadMessageIdByChannelId(state, channelId as string));
	const isUnread = useMemo(() => {
		return lastMessageUnreadId === messageId && !isEdited && !isSending && !isMe;
	}, [lastMessageUnreadId, messageId, isEdited, isSending, isMe]);

	return (
		<View style={styles.container}>
			{isUnread && (
				<View style={styles.lineWrapper}>
					<View style={styles.textWrapper}>
						<View style={styles.textContainer}>
							<Text style={styles.text}>{t('newMessages')}</Text>
						</View>
					</View>
				</View>
			)}
		</View>
	);
});
