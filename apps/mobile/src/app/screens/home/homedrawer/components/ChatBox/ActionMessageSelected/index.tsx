import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme, verticalScale } from '@mezon/mobile-ui';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { resetCachedChatbox, resetCachedMessageActionNeedToResolve } from '../../../../../../utils/helpers';
import { EMessageActionType } from '../../../enums';
import { IMessageActionNeedToResolve } from '../../../types';

interface IActionMessageSelectedProps {
	messageActionNeedToResolve: IMessageActionNeedToResolve | null;
	onClose: () => void;
}

export const ActionMessageSelected = memo(({ messageActionNeedToResolve, onClose }: IActionMessageSelectedProps) => {
	const { themeValue } = useTheme();
	const { t } = useTranslation(['message']);

	const handleCloseMessageAction = (type: EMessageActionType) => {
		switch (type) {
			case EMessageActionType.EditMessage:
				onClose();
				resetCachedMessageActionNeedToResolve(messageActionNeedToResolve?.targetMessage?.channel_id);
				resetCachedChatbox(messageActionNeedToResolve?.targetMessage?.channel_id);
				DeviceEventEmitter.emit(ActionEmitEvent.CLEAR_TEXT_INPUT);
				break;
			case EMessageActionType.Reply:
				onClose();
				break;
			default:
				break;
		}
	};

	return (
		<View style={{ flexDirection: 'column', backgroundColor: themeValue.primary }}>
			{messageActionNeedToResolve?.replyTo ? (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						borderBottomWidth: 1,
						borderBottomColor: themeValue.border
					}}
				>
					<LinearGradient
						start={{ x: 1, y: 0 }}
						end={{ x: 0, y: 0 }}
						colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
						style={[StyleSheet.absoluteFillObject]}
					/>
					<Pressable onPress={() => handleCloseMessageAction(EMessageActionType.Reply)} style={{ padding: size.tiny }}>
						<MezonIconCDN icon={IconCDN.circleXIcon} height={size.s_20} width={size.s_20} color={themeValue.text} />
					</Pressable>
					<Text
						style={{
							fontSize: size.s_10,
							color: themeValue.text
						}}
					>
						{t('chatBox.replyingTo')} {messageActionNeedToResolve?.replyTo}
					</Text>
				</View>
			) : null}
			{messageActionNeedToResolve?.type === EMessageActionType.EditMessage ? (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						padding: size.tiny,
						gap: 10,
						borderBottomWidth: 1,
						borderBottomColor: themeValue.border
					}}
				>
					<Pressable onPress={() => handleCloseMessageAction(EMessageActionType.EditMessage)}>
						<MezonIconCDN icon={IconCDN.circleXIcon} height={20} width={20} color={themeValue.text} />
					</Pressable>
					<Text
						style={{
							fontSize: verticalScale(10),
							color: themeValue.text
						}}
					>
						{t('chatBox.editingMessage')}
					</Text>
				</View>
			) : null}
		</View>
	);
});
