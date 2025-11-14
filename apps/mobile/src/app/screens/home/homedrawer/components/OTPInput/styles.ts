import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		inputSection: {
			marginBottom: size.s_24,
			gap: size.s_8,
			flexDirection: 'row',
			alignSelf: 'center',
			alignItems: 'center',
			justifyContent: 'center'
		},
		input: {
			width: size.s_42,
			height: size.s_48,
			borderRadius: size.s_8,
			textAlign: 'center',
			fontSize: size.s_20,
			color: '#000000',
			fontWeight: '600',
			backgroundColor: '#ffffff',
			paddingHorizontal: Platform.OS === 'ios' ? size.s_12 : 0,
			borderWidth: 2
		},
		inputEmpty: {
			borderColor: '#d1d5db',
			color: '#374151'
		},
		inputFilled: {
			borderWidth: 2,
			borderColor: '#1661ff',
			backgroundColor: 'rgba(0,82,255,0.1)',
			color: colors.textStrong
		},
		inputError: {
			borderColor: '#ca0000',
			backgroundColor: 'rgba(202,0,0,0.1)'
		}
	});
