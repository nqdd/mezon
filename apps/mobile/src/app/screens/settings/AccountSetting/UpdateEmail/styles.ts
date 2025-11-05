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
			position: 'relative'
		},
		label: {
			fontSize: size.s_12,
			color: themeValue.textDisabled,
			marginBottom: size.s_10
		},
		input: {
			fontSize: size.s_14,
			color: themeValue.text
		},
		inputWrapperPrefix: {
			paddingLeft: size.s_10
		},
		iconDimension: {
			width: size.s_20,
			height: size.s_20
		},
		nextButton: {
			backgroundColor: themeValue.textDisabled
		},
		nextButtonActive: {
			backgroundColor: themeValue.bgViolet
		},
		buttonTitle: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: 'white'
		},
		errorContainer: {
			marginTop: -size.s_8,
			minHeight: size.s_30
		}
	});
