import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (themeValue: Attributes) =>
	StyleSheet.create({
		otpContainer: {
			flexDirection: 'row',
			marginBottom: size.s_30,
			paddingHorizontal: size.s_20
		},
		otpInputBoxActive: {
			borderColor: themeValue.bgViolet
		},
		otpTextInput: {
			width: size.s_42,
			height: size.s_50,
			borderRadius: size.s_12,
			backgroundColor: themeValue.secondary,
			borderWidth: 2,
			borderColor: themeValue.border,
			textAlign: 'center',
			fontSize: size.s_24,
			fontWeight: '600',
			color: themeValue.textStrong,
			marginHorizontal: size.s_4
		}
	});
