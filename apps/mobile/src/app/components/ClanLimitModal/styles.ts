import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTabletLandscape?: boolean) =>
	StyleSheet.create({
		modalOverlay: {
			flex: 1,
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center'
		},

		modalCard: {
			backgroundColor: colors.primary,
			padding: size.s_16,
			margin: size.s_16,
			borderRadius: size.s_16,
			overflow: 'hidden',
			width: '90%',
			marginHorizontal: isTabletLandscape ? '30%' : 0,
			zIndex: 100,
			alignItems: 'center'
		},

		modalHeader: {
			paddingBottom: size.s_12,
			borderBottomColor: colors.border,
			borderBottomWidth: 1,
			alignItems: 'center',
			width: '100%'
		},

		warningIconContainer: {
			width: size.s_80,
			height: size.s_80,
			borderRadius: size.s_40,
			backgroundColor: colors.tertiary,
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: size.s_16
		},

		modalTitle: {
			color: colors.textStrong,
			fontSize: size.s_18,
			fontWeight: 'bold',
			textAlign: 'center'
		},

		modalMessage: {
			color: colors.text,
			fontSize: size.s_14,
			textAlign: 'center',
			lineHeight: size.s_24,
			marginVertical: size.s_16
		},

		actionButtonContainer: {
			paddingVertical: size.s_6,
			width: '100%'
		},

		confirmButton: {
			borderRadius: size.s_20,
			padding: size.s_10,
			backgroundColor: colors.bgViolet
		},

		confirmButtonText: {
			color: 'white',
			fontSize: size.s_12,
			textAlign: 'center'
		},

		modalBackdrop: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.5)'
		}
	});
