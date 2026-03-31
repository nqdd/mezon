import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			width: '100%',
			height: '100%',
			gap: size.s_10,
			alignItems: 'center',
			paddingTop: size.s_50
		},
		title: {
			fontSize: size.h6,
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold',
			color: colors.white
		},
		description: {
			fontSize: size.h6,
			color: colors.white,
			textAlign: 'center'
		}
	});
