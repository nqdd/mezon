import { useTheme } from '@mezon/mobile-ui';
import { ChannelStreamMode } from 'mezon-js';
import React, { memo } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import ChannelMessages from '../../home/homedrawer/ChannelMessages';
import { ChatBox } from '../../home/homedrawer/ChatBox';
import PanelKeyboard from '../../home/homedrawer/PanelKeyboard';
import { style } from './styles';

interface IChatMessageWrapperProps {
	directMessageId: string;
	lastSeenMessageId: string;
	lastSentMessageId: string;
	isModeDM: boolean;
	isBlocked?: boolean;
	dmType?: number;
}
export const ChatMessageWrapper = memo(
	({ directMessageId, lastSeenMessageId, lastSentMessageId, isModeDM, isBlocked, dmType }: IChatMessageWrapperProps) => {
		const { themeValue } = useTheme();
		const styles = style(themeValue);

		return (
			<KeyboardAvoidingView
				style={styles.content}
				behavior={'padding'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
			>
				<View style={{ flex: 1 }}>
					<ChannelMessages
						channelId={directMessageId}
						lastSeenMessageId={lastSeenMessageId}
						lastSentMessageId={lastSentMessageId}
						clanId={'0'}
						mode={Number(isModeDM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
						isPublic={false}
						isDM={true}
						dmType={dmType}
					/>
				</View>
				<ChatBox
					channelId={directMessageId}
					mode={Number(isModeDM ? ChannelStreamMode.STREAM_MODE_DM : ChannelStreamMode.STREAM_MODE_GROUP)}
					isPublic={false}
					topicChannelId={''}
					isBlocked={isBlocked}
				/>
				<PanelKeyboard directMessageId={directMessageId || ''} currentChannelId={directMessageId} currentClanId={'0'} />
			</KeyboardAvoidingView>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.directMessageId === nextProps.directMessageId &&
			prevProps.isModeDM === nextProps.isModeDM &&
			prevProps.isBlocked === nextProps.isBlocked
		);
	}
);
