import { ActionEmitEvent, convertTimestampToTimeAgo } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { DirectEntity, directActions, messagesActions, selectDirectById, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { createImgproxyUrl } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { ChannelStreamMode, ChannelType, safeJSONParse } from 'mezon-js';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import BuzzBadge from '../../components/BuzzBadge/BuzzBadge';
import ImageNative from '../../components/ImageNative';
import { IconCDN } from '../../constants/icon_cdn';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import MessageMenu from '../home/homedrawer/components/MessageMenu';
import { MessagePreviewLastest } from './MessagePreviewLastest';
import { UserStatusDM } from './UserStatusDM';
import { style } from './styles';

export const DmListItem = React.memo((props: { id: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { id } = props;
	const navigation = useNavigation<any>();
	const directMessage = useAppSelector((state) => selectDirectById(state, id));
	const isUnReadChannel = useMemo(() => {
		return (
			directMessage?.last_seen_message?.timestamp_seconds !== undefined &&
			directMessage?.last_sent_message?.timestamp_seconds !== undefined &&
			directMessage?.last_seen_message?.timestamp_seconds < directMessage?.last_sent_message?.timestamp_seconds
		);
	}, [directMessage?.last_seen_message?.timestamp_seconds, directMessage?.last_sent_message?.timestamp_seconds]);
	const { t } = useTranslation(['message', 'common']);
	const isTabletLandscape = useTabletLandscape();
	const dispatch = useAppDispatch();

	const redirectToMessageDetail = async () => {
		dispatch(messagesActions.setIdMessageToJump(null));
		if (!isTabletLandscape) {
			navigation.navigate(APP_SCREEN.MESSAGES.MESSAGE_DETAIL, {
				directMessageId: directMessage?.id
			});
		}
		dispatch(directActions.setDmGroupCurrentId(directMessage?.id));
	};

	const isTypeDMGroup = useMemo(() => {
		return Number(directMessage?.type) === ChannelType.CHANNEL_TYPE_GROUP;
	}, [directMessage?.type]);

	const otherMemberList = useMemo(() => {
		const userIdList = directMessage.user_ids;
		const usernameList = directMessage?.usernames || [];
		const displayNameList = directMessage?.display_names || [];

		return usernameList?.map((username, index) => ({
			userId: userIdList?.[index],
			username,
			displayName: displayNameList?.[index]
		}));
	}, [directMessage?.display_names, directMessage?.user_ids, directMessage?.usernames]);

	const lastMessageTime = useMemo(() => {
		if (directMessage?.last_sent_message?.timestamp_seconds) {
			const timestamp = Number(directMessage?.last_sent_message?.timestamp_seconds);
			return convertTimestampToTimeAgo(timestamp, t);
		}
		return null;
	}, [directMessage?.last_sent_message?.timestamp_seconds, t]);

	const handleLongPress = useCallback((directMessage: DirectEntity) => {
		const data = {
			heightFitContent: true,
			children: <MessageMenu messageInfo={directMessage} />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
	}, []);

	return (
		<TouchableOpacity style={[styles.messageItem]} onPress={redirectToMessageDetail} onLongPress={() => handleLongPress(directMessage)}>
			{isTypeDMGroup ? (
				directMessage?.channel_avatar && !directMessage?.channel_avatar?.includes('avatar-group.png') ? (
					<View style={styles.groupAvatarWrapper}>
						<ImageNative url={createImgproxyUrl(directMessage?.channel_avatar ?? '')} style={styles.imageFullSize} resizeMode={'cover'} />
					</View>
				) : (
					<View style={styles.groupAvatar}>
						<MezonIconCDN icon={IconCDN.groupIcon} />
					</View>
				)
			) : (
				<View style={styles.avatarWrapper}>
					{directMessage?.avatars?.[0] ? (
						<View style={styles.friendAvatar}>
							<ImageNative
								url={createImgproxyUrl(directMessage?.avatars?.[0] ?? '', { width: 50, height: 50, resizeType: 'fit' })}
								style={styles.imageFullSize}
								resizeMode={'cover'}
							/>
						</View>
					) : (
						<View style={styles.wrapperTextAvatar}>
							<Text style={styles.textAvatar}>
								{(
									directMessage?.channel_label ||
									(typeof directMessage?.usernames === 'string' ? directMessage?.usernames : directMessage?.usernames?.[0] || '')
								)
									?.charAt?.(0)
									?.toUpperCase()}
							</Text>
						</View>
					)}
					<UserStatusDM isOnline={directMessage?.onlines?.some(Boolean)} userId={directMessage?.user_ids?.[0]} />
				</View>
			)}

			<View style={styles.flexOne}>
				<View style={styles.messageContent}>
					<Text
						numberOfLines={1}
						style={[styles.defaultText, styles.channelLabel, { color: isUnReadChannel ? themeValue.white : themeValue.textDisabled }]}
					>
						{(directMessage?.channel_label || directMessage?.usernames) ??
							(directMessage?.creator_name ? `${directMessage.creator_name}'s Group` : '')}
					</Text>
					<BuzzBadge
						channelId={directMessage?.channel_id}
						clanId={'0'}
						mode={
							directMessage?.type === ChannelType.CHANNEL_TYPE_DM
								? ChannelStreamMode.STREAM_MODE_DM
								: ChannelStreamMode.STREAM_MODE_GROUP
						}
					/>
					{lastMessageTime ? (
						<Text
							style={[
								styles.defaultText,
								styles.dateTime,
								{ color: isUnReadChannel ? themeValue.textStrong : themeValue.textDisabled }
							]}
						>
							{lastMessageTime}
						</Text>
					) : null}
				</View>
				<MessagePreviewLastest
					isUnReadChannel={isUnReadChannel}
					type={directMessage?.type}
					otherMemberList={otherMemberList}
					senderId={directMessage?.last_sent_message?.sender_id}
					content={
						typeof directMessage?.last_sent_message?.content === 'object'
							? directMessage?.last_sent_message?.content
							: safeJSONParse(directMessage?.last_sent_message?.content || '{}')
					}
					attachment={
						typeof directMessage?.last_sent_message?.attachment === 'object'
							? directMessage?.last_sent_message?.attachment
							: safeJSONParse(directMessage?.last_sent_message?.attachment || '[]')
					}
				/>
			</View>
		</TouchableOpacity>
	);
});
