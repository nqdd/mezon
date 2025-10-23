import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_18,
			gap: size.s_18
		},
		headerTitle: {
			fontSize: verticalScale(20),
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold',
			color: colors.white
		},
		headerRightContainer: {
			marginRight: size.s_20,
			paddingVertical: size.s_10
		},
		saveButtonText: {
			fontSize: verticalScale(18),
			marginLeft: 0,
			marginRight: 0,
			color: colors.bgViolet
		},
		headerLeftContainer: {
			marginLeft: size.s_16
		},
		permissionTypeText: {
			color: colors.textDisabled
		},
		scrollContent: {
			gap: size.s_28
		}
	});
