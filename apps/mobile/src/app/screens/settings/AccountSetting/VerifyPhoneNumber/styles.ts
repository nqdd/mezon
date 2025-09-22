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
		otpContainer: {
			flexDirection: 'row',
			marginBottom: size.s_30,
			paddingHorizontal: size.s_20
		},
		otpInputBox: {
			width: size.s_42,
			height: size.s_50,
			borderRadius: size.s_12,
			backgroundColor: themeValue.secondary,
			borderWidth: 2,
			borderColor: themeValue.border,
			justifyContent: 'center',
			alignItems: 'center',
			marginHorizontal: size.s_4
		},
		otpInputBoxActive: {
			borderColor: themeValue.bgViolet
		},
		otpInputText: {
			fontSize: size.s_24,
			fontWeight: '600',
			color: themeValue.textStrong
		},
		verifyButton: {
			width: '100%',
			backgroundColor: themeValue.textDisabled
		},
		verifyButtonActive: {
			backgroundColor: themeValue.bgViolet
		},
		hiddenInput: {
			position: 'absolute',
			top: 0,
			left: 0,
			opacity: 0,
			height: 0,
			width: 0
		},
		buttonTitle: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: 'white'
		}
	});
