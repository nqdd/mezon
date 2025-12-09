import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		waveButton: {
			backgroundColor: colors.secondaryLight,
			paddingVertical: size.s_4,
			paddingLeft: size.s_8,
			paddingRight: size.s_14,
			borderRadius: size.s_4,
			alignSelf: 'flex-start',
			marginTop: size.s_6,
			flexDirection: 'row',
			alignItems: 'center',
			marginLeft: size.s_20,
			gap: size.s_8
		},
		waveButtonText: {
			color: colors.textStrong,
			fontSize: size.s_12,
			fontWeight: '600',
			textAlign: 'center'
		},
		waveIcon: {
			width: size.s_26,
			height: size.s_26,
			marginBottom: size.s_2
		},
		waveContainerDM: {
			alignItems: 'center',
			marginTop: size.s_20
		},
		waveIconDM: {
			width: size.s_100,
			height: size.s_100
		},
		waveButtonDM: {
			marginTop: size.s_12,
			backgroundColor: colors.bgViolet,
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_20,
			borderRadius: size.s_20
		},
		waveButtonTextDM: {
			color: baseColor.white,
			fontSize: size.s_14,
			fontWeight: '600',
			textAlign: 'center'
		}
	});
