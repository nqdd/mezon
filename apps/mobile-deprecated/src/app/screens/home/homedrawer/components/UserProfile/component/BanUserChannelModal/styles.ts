import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		main: {
			flex: 1,
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center'
		},
		container: {
			backgroundColor: colors.secondary,
			padding: Metrics.size.xl,
			overflow: 'hidden',
			width: '100%',
			marginHorizontal: 0,
			zIndex: 100
		},
		backdrop: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.5)'
		},
		yesButton: {
			height: size.s_40,
			borderRadius: size.s_8,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.bgViolet
		},
		buttonText: {
			color: baseColor.white,
			textAlign: 'center'
		},
		modalTitle: {
			fontSize: size.h5,
			color: colors.white,
			fontWeight: '600',
			textAlign: 'center'
		},
		title: {
			fontSize: size.h7,
			color: colors.white,
			paddingBottom: size.s_10,
			fontWeight: '600'
		}
	});
