import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		input: {
			height: 36,
			flex: 1,
			color: colors.text
		},
		categoryItem: {
			paddingVertical: size.s_14,
			borderBottomWidth: 0
		},
		container: {
			flex: 1
		},
		contentContainer: {
			backgroundColor: colors.primary,
			width: '100%',
			height: '100%'
		},
		searchContainer: {
			paddingHorizontal: size.s_20,
			paddingVertical: size.s_10,
			borderTopColor: colors.border,
			borderBottomColor: colors.border,
			borderWidth: 1
		},
		searchInputWrapper: {
			backgroundColor: colors.tertiary,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderRadius: size.s_6,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_4
		}
	});
