import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (themeValue: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeValue.primary,
			paddingHorizontal: size.s_20,
			paddingTop: size.s_20,
			alignItems: 'center'
		},
		subtitle: {
			fontSize: size.s_14,
			fontWeight: '500',
			color: themeValue.text,
			textAlign: 'center',
			marginBottom: size.s_30,
			lineHeight: size.s_20
		},
		verifyButton: {
			width: '100%',
			backgroundColor: themeValue.textDisabled
		},
		verifyButtonActive: {
			backgroundColor: themeValue.bgViolet
		},
		buttonTitle: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: 'white'
		}
	});
