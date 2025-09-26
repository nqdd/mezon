import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: size.s_16,
			backgroundColor: '#ffffff'
		},
		content: {
			flex: 1,
			paddingTop: size.s_100
		},
		title: {
			fontSize: size.s_24,
			fontWeight: 'bold',
			color: '#000000',
			textAlign: 'center',
			marginBottom: size.s_10
		},
		subtitle: {
			fontSize: size.s_14,
			textAlign: 'center',
			color: '#505050',
			marginBottom: size.s_40,
			opacity: 0.9
		},
		inputSection: {
			width: '100%',
			marginBottom: size.s_24
		},
		inputLabel: {
			fontSize: size.s_14,
			color: '#e0e7ff',
			marginBottom: size.s_12
		},
		inputWrapper: {
			flexDirection: 'row',
			height: size.s_50,
			backgroundColor: '#f6f6f6',
			borderWidth: 1,
			borderColor: '#cccccc',
			borderRadius: size.s_12,
			paddingHorizontal: size.s_16,
			overflow: 'hidden',
			alignItems: 'center'
		},
		emailInput: {
			width: '100%',
			flex: 1,
			height: '100%',
			paddingHorizontal: size.s_16,
			fontSize: size.s_16,
			color: '#000000'
		},
		placeholder: {
			color: '#a8a8a8'
		},
		showPasswordContainer: {
			marginTop: size.s_12,
			width: '100%'
		},
		checkboxContainer: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		checkbox: {
			width: size.s_18,
			height: size.s_18,
			borderWidth: 1,
			borderColor: '#808080',
			backgroundColor: 'transparent',
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: size.s_8,
			borderRadius: size.s_2
		},
		checkboxChecked: {
			backgroundColor: '#2563eb',
			borderColor: '#2563eb'
		},
		showPasswordText: {
			fontSize: size.s_14,
			color: '#191919'
		},
		otpButton: {
			width: '100%',
			height: size.s_50,
			borderRadius: size.s_12,
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: size.s_30,
			overflow: 'hidden'
		},
		otpButtonActive: {
			backgroundColor: '#2563eb'
		},
		otpButtonDisabled: {
			backgroundColor: '#88888c'
		},
		otpButtonText: {
			color: '#ffffff',
			fontSize: size.s_16,
			fontWeight: '600',
			zIndex: 10
		},
		alternativeSection: {
			alignItems: 'center'
		},
		alternativeText: {
			fontSize: size.s_14,
			color: '#5e5e5e',
			textAlign: 'center',
			marginBottom: size.s_6
		},
		alternativeOptions: {
			flexDirection: 'row',
			alignItems: 'center',
			flexWrap: 'wrap',
			justifyContent: 'center'
		},
		linkText: {
			fontSize: size.s_14,
			color: '#2e22ff'
		},
		orText: {
			fontSize: size.s_14,
			color: '#e0e7ff',
			textTransform: 'uppercase',
			marginHorizontal: size.s_4
		}
	});
