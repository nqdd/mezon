import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { ChannelStreamMode } from 'mezon-js';
import React, { memo } from 'react';
import { DeviceEventEmitter, Keyboard } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { style } from '../ChatBoxBottomBar/style';
import { BaseRecordAudioMessage } from '../RecordAudioMessage';

interface IRecordMessageSendingProps {
	mode: ChannelStreamMode;
	channelId: string;
	currentTopicId?: string;
}
export const RecordMessageSending = memo(({ channelId, mode, currentTopicId = '' }: IRecordMessageSendingProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const startRecording = async () => {
		const data = {
			snapPoints: ['50%'],
			children: <BaseRecordAudioMessage channelId={channelId} mode={mode} topicId={currentTopicId} />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: false, data });
		Keyboard.dismiss();
	};

	return (
		<Pressable onLongPress={startRecording} style={[styles.btnIcon, styles.iconVoice]}>
			<MezonIconCDN icon={IconCDN.microphoneIcon} width={size.s_18} height={size.s_18} color={themeValue.textStrong} />
		</Pressable>
	);
});
