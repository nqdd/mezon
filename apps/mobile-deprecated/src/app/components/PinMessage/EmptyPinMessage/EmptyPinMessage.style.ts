import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		emptyPinMessageBox: {
			marginTop: size.s_50,
			flexDirection: 'column',
			gap: size.s_10,
			marginVertical: size.s_10,
			alignItems: 'center'
		},
		emptyPinMessageTitle: {
			maxWidth: 300,
			fontSize: size.label,
			color: colors.text,
			fontWeight: '500',
			textAlign: 'center',
			marginTop: size.s_30
		}
	});
