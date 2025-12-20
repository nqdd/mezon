import { size, useTheme } from '@mezon/mobile-ui';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

interface IAudioOutputOptionsProps {
	handleJumpToPresent: () => void;
	lastSeenMessageId: string;
	lastSentMessageId: string;
	hasNewLine: boolean;
}
const AudioOutputOptions = ({ handleJumpToPresent, lastSeenMessageId, lastSentMessageId, hasNewLine }: IAudioOutputOptionsProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const replyCount = useMemo(() => {
		try {
			return Math.max(0, Math.round(Number((BigInt(lastSentMessageId) >> BigInt(22)) - (BigInt(lastSeenMessageId) >> BigInt(22)))));
		} catch (e) {
			return 0;
		}
	}, [lastSeenMessageId, lastSentMessageId]);

	return (
		<TouchableOpacity style={styles.btnScrollDown} onPress={handleJumpToPresent} activeOpacity={0.8}>
			{replyCount > 0 && hasNewLine && (
				<View style={styles.badgeCountMessage}>
					<Text style={styles.badgeCountMessageText}>{replyCount >= 99 ? '99+' : replyCount}</Text>
				</View>
			)}
			<MezonIconCDN icon={IconCDN.arrowLargeDownIcon} color={themeValue.text} height={size.s_18} width={size.s_18} />
		</TouchableOpacity>
	);
};

export default AudioOutputOptions;
