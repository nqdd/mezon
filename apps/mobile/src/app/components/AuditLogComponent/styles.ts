import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		headerRightText: {
			fontWeight: '500',
			fontSize: size.label,
			color: colors.bgViolet
		},
		headerRightBtn: {
			marginRight: size.s_10,
			padding: size.s_10
		},
		headerLeftBtn: {
			marginLeft: size.s_10,
			padding: size.s_10
		},
		filterBtn: {
			flexDirection: 'row',
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_10,
			alignItems: 'center',
			justifyContent: 'flex-end'
		},
		filterText: {
			fontWeight: '500',
			fontSize: size.s_18,
			color: colors.white
		},
		textFilterBtn: {
			fontSize: size.s_12,
			paddingHorizontal: size.s_10,
			color: colors.text
		},
		stylesDatePicker: {
			backgroundColor: colors.tertiary
		},
		container: {
			paddingVertical: size.s_10,
			width: '100%',
			height: '100%',
			backgroundColor: colors.primary
		},
		menuContainer: {
			paddingHorizontal: size.s_20
		},
		filterContainer: {
			gap: size.s_10,
			alignItems: 'center',
			flexDirection: 'row',
			marginRight: size.s_10
		},
		filterTag: {
			maxWidth: 200,
			marginLeft: size.s_20,
			backgroundColor: colors.tertiary,
			padding: size.s_6,
			borderRadius: size.s_6
		},
		filterTagSecondary: {
			maxWidth: 200,
			backgroundColor: colors.tertiary,
			padding: size.s_6,
			borderRadius: size.s_6
		},
		datePickerContainer: {
			paddingHorizontal: size.s_10
		},
		listContainer: {
			flex: 1,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_10
		}
	});
