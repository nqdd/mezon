import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			height: size.s_60,
			width: '90%',
			backgroundColor: 'transparent',
			flexDirection: 'row',
			alignItems: 'center',
			borderLeftColor: 'transparent',
			paddingLeft: size.s_20,
			borderLeftWidth: 0,
			shadowColor: 'transparent',
			elevation: 2,
			overflow: 'hidden'
		},
		iconWrapper: {
			padding: size.s_4,
			backgroundColor: baseColor.white,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: size.s_50
		},
		text: {
			color: colors.text
		},
		white: {
			color: colors.white
		},
		notificationContainer: {
			width: '90%',
			height: 'auto',
			flex: 1,
			backgroundColor: colors.primary,
			borderRadius: size.s_16,
			overflow: 'hidden',
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.9,
			shadowRadius: 5,
			elevation: 8
		},
		notificationContent: {
			alignItems: 'stretch',
			width: '100%',
			flexDirection: 'row',
			height: 'auto',
			gap: size.s_10,
			padding: size.s_10
		},
		notificationLogo: {
			height: size.s_40,
			width: size.s_40,
			borderRadius: 50
		},
		lottieProgressBar: {
			width: '100%',
			height: size.s_8,
			marginBottom: -size.s_4
		},
		toastWrapper: {
			borderRadius: size.s_20,
			overflow: 'hidden',
			width: '90%'
		},
		titleBaseStyle: {
			fontSize: size.medium,
			color: baseColor.black,
			fontWeight: '600'
		},
		descriptionBaseStyle: {
			fontSize: size.small,
			color: baseColor.black,
			fontWeight: '400'
		}
	});
