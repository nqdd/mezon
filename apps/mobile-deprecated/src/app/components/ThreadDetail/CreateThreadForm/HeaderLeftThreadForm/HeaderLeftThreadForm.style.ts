import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		headerLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			height: size.s_50
		},
		btnBack: {
			paddingLeft: size.s_16,
			paddingRight: size.s_14,
			height: '100%',
			justifyContent: 'center'
		},
		titleRow: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		iconContainer: {
			marginRight: size.s_10
		},
		titleText: {
			fontSize: size.h6,
			fontWeight: '700'
		},
		subtitleText: {
			fontSize: size.medium,
			fontWeight: '400',
			maxWidth: '90%'
		}
	});
