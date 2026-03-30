import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (themeValue?: Attributes) =>
	StyleSheet.create({
		channelIcon: {
			marginTop: size.s_10
		},
		containerWrapper: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignItems: 'center'
		},
		containerWithLineLimit: {
			flex: 1,
			overflow: 'hidden'
		},
		messageReplyOverlay: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 1
		},
		textPartsContainer: {
			flexDirection: 'row',
			gap: size.s_6,
			flexWrap: 'wrap',
			alignItems: 'flex-end'
		},
		textPartsColumn: {
			flexDirection: 'column',
			alignItems: 'flex-start'
		}
	});

export const getMessageReplyMaxHeight = (isMessageReply: boolean) =>
	isMessageReply ? size.s_17 : size.s_20 * 10 - size.s_10;
