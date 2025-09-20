import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isDisabledUpload?: boolean) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary,
			padding: size.s_16
		},
		audioFile: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between'
		},
		inputContainer: {
			width: '85%'
		},
		uploadButton: {
			aspectRatio: 1,
			width: size.s_40,
			borderRadius: size.s_4,
			backgroundColor: colors.bgViolet,
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: size.s_10
		},
		button: {
			position: 'absolute',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: isDisabledUpload ? colors.textDisabled : colors.bgViolet,
			height: size.s_50,
			width: '100%',
			bottom: size.s_30,
			borderRadius: size.s_14,
			alignSelf: 'center'
		},
		buttonTitle: {
			color: 'white',
			fontSize: size.s_16,
			fontWeight: 'bold'
		},
		preview: {
			alignItems: 'center',
			justifyContent: 'center',
			height: size.s_100,
			borderRadius: size.s_10,
			borderWidth: 1,
			borderColor: colors.text,
			marginBottom: size.s_10
		},
		title: {
			color: colors.textStrong,
			fontWeight: 'bold',
			fontSize: size.medium,
			marginBlock: size.s_6
		},
		previewContainer: {
			width: '70%',
			height: '50%',
			alignItems: 'center',
			justifyContent: 'center',
			alignSelf: 'center'
		}
	});
