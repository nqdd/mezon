import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_12
		},
		headerTitle: {
			fontSize: verticalScale(18),
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold',
			color: colors.white
		},
		headerRightContainer: {
			marginRight: size.s_20
		},
		headerRightText: {
			fontSize: verticalScale(18),
			marginLeft: 0,
			marginRight: 0,
			color: colors.white
		},
		headerLeftContainer: {
			marginTop: size.s_8,
			marginLeft: size.s_10
		},
		tabsContainer: {
			backgroundColor: colors.tertiary,
			marginVertical: size.s_10,
			flexDirection: 'row',
			borderRadius: size.s_16,
			gap: size.s_6
		},
		tabButton: {
			flex: 1,
			paddingVertical: size.s_8,
			borderRadius: size.s_16
		},
		tabButtonActive: {
			backgroundColor: colors.bgViolet
		},
		tabButtonInactive: {
			backgroundColor: colors.tertiary
		},
		tabText: {
			fontSize: verticalScale(14),
			marginLeft: 0,
			marginRight: 0,
			textAlign: 'center'
		},
		tabTextActive: {
			color: 'white'
		},
		tabTextInactive: {
			color: colors.text
		}
	});
