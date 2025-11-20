import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		logoContainer: {
			position: 'relative'
		},

		logoSection: {
			paddingVertical: size.s_40,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},

		clanName: {
			color: colors.textStrong,
			fontSize: size.s_14,
			marginTop: size.s_10
		},

		removeButton: {
			position: 'absolute',
			top: -size.s_6,
			right: -size.s_6
		}
	});
