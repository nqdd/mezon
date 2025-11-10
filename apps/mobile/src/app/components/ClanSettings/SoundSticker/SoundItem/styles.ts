import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('screen');

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			paddingHorizontal: size.s_20,
			backgroundColor: colors.primary,
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: size.s_10,
			height: size.s_50,
			flex: 1,
			borderBottomWidth: 1,
			borderBottomColor: colors.border
		},
		rightItem: {
			backgroundColor: baseColor.flamingo,
			paddingHorizontal: size.s_15,
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: size.s_15
		},
		deleteButton: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		lightTitle: {
			color: colors.white,
			fontSize: size.s_14
		},
		emojiName: {
			maxWidth: width * 0.3,
			flexDirection: 'row',
			alignItems: 'center',
			width: 'auto'
		},
		title: {
			color: colors.borderRadio,
			maxWidth: '75%',
			fontSize: size.s_12
		},
		deleteText: {
			color: 'white',
			fontWeight: 'bold',
			fontSize: size.s_14
		},
		emojiItem: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10
		},
		imgWrapper: {
			width: size.s_30,
			height: size.s_30,
			borderRadius: size.s_30,
			overflow: 'hidden'
		},
		user: {
			flexDirection: 'row',
			gap: size.s_10,
			alignItems: 'center',
			justifyContent: 'flex-end',
			flex: 1,
			width: '50%'
		},
		audioPlay: {
			justifyContent: 'center',
			alignItems: 'center'
		}
	});
