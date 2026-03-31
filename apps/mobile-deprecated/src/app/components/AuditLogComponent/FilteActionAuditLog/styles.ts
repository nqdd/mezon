import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			width: '100%',
			height: '100%',
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_10
		},
		iconText: {
			fontSize: size.h6,
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold',
			color: colors.white
		},
		scrollContainer: {
			marginVertical: size.s_20
		}
	});
