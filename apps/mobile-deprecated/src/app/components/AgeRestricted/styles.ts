import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		title: {
			fontSize: size.h6,
			color: colors.text,
			textAlign: 'center',
			fontWeight: 'bold',
			marginBottom: size.s_10
		},
		description: {
			fontSize: size.s_16,
			color: colors.text,
			textAlign: 'center',
			marginBottom: size.s_10
		},
		buttonSubmit: {
			backgroundColor: baseColor.bgButtonPrimary,
			paddingVertical: size.s_10,
			borderRadius: size.s_10
		},
		buttonContinue: {
			backgroundColor: baseColor.bgDanger,
			width: '40%',
			paddingVertical: size.s_8,
			borderRadius: size.s_10
		},
		buttonNope: {
			backgroundColor: baseColor.bgButtonSecondary,
			width: '40%',
			paddingVertical: size.s_8,
			borderRadius: size.s_10
		},
		btnText: {
			fontSize: size.s_16,
			color: 'white',
			textAlign: 'center',
			fontWeight: 'bold'
		},
		datePicker: {
			backgroundColor: colors.secondaryLight,
			marginVertical: size.s_20
		},
		container: {
			backgroundColor: colors.secondary,
			borderRadius: size.s_10,
			padding: size.s_20
		},
		iconContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center'
		},
		buttonContainer: {
			marginTop: size.s_20,
			flexDirection: 'row',
			justifyContent: 'center',
			gap: size.s_30
		},
		formContainer: {
			backgroundColor: colors.primary,
			borderRadius: size.s_10,
			padding: size.s_20,
			margin: size.s_10
		},
		modalOverlay: {
			flex: 1,
			position: 'absolute',
			width: '100%',
			height: '100%',
			zIndex: 99,
			top: 0,
			left: 0,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.secondary
		}
	});
