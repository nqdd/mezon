import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		username: {
			fontSize: size.s_14,
			color: colors.text
		},
		textTime: {
			fontSize: size.s_12,
			color: colors.textDisabled,
			marginTop: size.s_8
		},
		actionText: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: colors.white
		},
		lowercase: { textTransform: 'lowercase' },
		itemContainer: {
			flexDirection: 'row',
			padding: size.s_10,
			backgroundColor: colors.secondary,
			borderRadius: size.s_10,
			gap: size.s_10,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: colors.tertiary,
			marginVertical: size.s_6
		},
		itemContent: {
			flex: 1
		}
	});
