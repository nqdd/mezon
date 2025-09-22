import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (themeValue: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeValue.primary,
			padding: size.s_20
		},
		contentContainer: {
			marginBottom: size.s_32
		},
		buttonContainer: {
			gap: size.s_12
		},
		label: {
			fontSize: size.s_12,
			color: themeValue.textDisabled,
			marginBottom: size.s_10
		},
		phoneContainer: {
			flexDirection: 'row',
			backgroundColor: `${themeValue.midnightBlue}1A`,
			borderWidth: 0,
			borderRadius: size.s_8,
			paddingVertical: size.s_2
		},
		countryButton: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: size.s_12,
			borderRightWidth: 1,
			borderRightColor: themeValue.border
		},
		inputWrapper: {
			backgroundColor: 'transparent',
			borderWidth: 0,
			marginBottom: -10
		},
		input: {
			fontSize: size.s_14,
			color: themeValue.text
		},
		dropdownContainer: {
			position: 'absolute',
			top: '100%',
			left: 0,
			right: 0,
			backgroundColor: themeValue.secondary,
			borderRadius: size.s_8,
			borderWidth: 0,
			borderColor: themeValue.border,
			zIndex: 1000,
			width: '50%',
			maxWidth: size.s_220,
			marginTop: size.s_4
		},
		dropdownItem: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_8,
			paddingHorizontal: size.s_12,
			paddingVertical: size.s_8,
			borderBottomWidth: 1,
			borderBottomColor: themeValue.border,
			justifyContent: 'space-between'
		},
		dropdownItemContent: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_4
		},
		dropdownText: {
			fontSize: size.s_14,
			color: themeValue.text
		},
		customStyleFlagIcon: {
			marginRight: size.s_6
		},
		nextButton: {
			backgroundColor: themeValue.textDisabled
		},
		nextButtonActive: {
			backgroundColor: themeValue.bgViolet
		},
		removeButton: {
			backgroundColor: themeValue.secondary
		},
		buttonTitle: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: themeValue.text
		}
	});
