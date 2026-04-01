import { Attributes, Fonts, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			borderRadius: size.s_12,
			overflow: 'hidden',
			backgroundColor: colors.secondaryLight,
			marginVertical: size.s_4
		},
		userItem: {
			flexDirection: 'row',
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_6,
			borderRadius: size.s_12,
			gap: size.s_8,
			alignItems: 'center',
			backgroundColor: colors.secondary
		},
		title: {
			color: colors.textStrong,
			fontSize: Fonts.size.h7,
			fontWeight: '500',
			textAlign: 'left'
		},
		userRowItem: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			gap: size.s_10
		},
		userRowHeader: {
			gap: size.s_10
		},
		code: {
			color: colors.textDisabled,
			fontSize: Fonts.size.small,
			fontWeight: '400'
		},
		expandIcon: {
			alignItems: 'center',
			justifyContent: 'center',
			height: size.s_30,
			width: size.s_30,
			borderRadius: size.s_15
		}
	});
