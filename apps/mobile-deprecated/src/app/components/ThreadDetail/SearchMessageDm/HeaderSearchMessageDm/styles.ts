import type { Attributes } from '@mezon/mobile-ui';
import { size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		searchBox: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.secondary,
			borderRadius: verticalScale(50),
			flex: 1,
			height: size.s_40,
			paddingHorizontal: size.s_10,
			justifyContent: 'space-between'
		},
		input: {
			color: colors.text,
			flex: 1
		},
		headerContainer: {
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_10,
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10
		},
		iconMargin: {
			marginRight: size.s_6
		},

		listSearchIcon: {
			backgroundColor: colors.secondary,
			opacity: 0.7,
			padding: size.s_10,
			borderRadius: size.s_50
		},

		badge: {
			borderRadius: size.s_18,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_2,
			maxWidth: size.s_100
		},

		textBadgeHighLight: {
			color: colors.white,
			fontSize: size.s_12,
			fontWeight: '500',
			width: '100%'
		},

		tooltip: {
			minWidth: size.s_220,
			padding: 0,
			borderRadius: size.s_10,
			backgroundColor: colors.primary
		},

		arrow: {
			width: 0,
			height: 0
		}
	});
