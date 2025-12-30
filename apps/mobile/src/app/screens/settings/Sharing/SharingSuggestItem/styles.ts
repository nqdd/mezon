import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		itemSuggestion: {
			paddingVertical: size.s_10,
			flexDirection: 'row',
			gap: size.s_16,
			alignItems: 'center'
		},
		titleSuggestion: {
			fontSize: size.medium,
			color: colors.text
		},
		avatarImage: {
			width: size.s_30,
			height: size.s_30,
			borderRadius: size.s_30,
			overflow: 'hidden'
		}
	});
