import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			flex: 1,
			overflow: 'hidden',
			height: size.s_16,
			flexWrap: 'nowrap'
		},
		message: {
			fontSize: size.small,
			color: colors.text,
			lineHeight: size.s_16,
			overflow: 'hidden',
			width: '100%'
		},
		emoji: {
			height: size.s_12,
			width: size.s_12
		}
	});
