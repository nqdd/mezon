import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			paddingHorizontal: size.s_14,
			flex: 1
		},
		headerContainer: {
			flexDirection: 'row',
			justifyContent: 'center'
		},
		headerCenter: {
			alignItems: 'center'
		},
		headerTitle: {
			fontSize: size.s_16,
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold',
			color: colors.white,
			textAlign: 'center'
		},
		headerSubtitle: {
			marginLeft: 0,
			marginRight: 0,
			color: colors.text
		},
		addButton: {
			position: 'absolute',
			top: 0,
			right: 0
		},
		addButtonInner: {
			padding: size.s_10
		},
		addButtonText: {
			fontSize: size.medium,
			marginLeft: 0,
			marginRight: 0,
			fontWeight: 'bold'
		},
		searchWrapper: {
			paddingVertical: size.s_16
		},
		listWrapper: {
			flex: 1,
			paddingBottom: size.s_10
		},
		sectionHeader: {
			paddingTop: size.s_12,
			paddingLeft: size.s_12
		},
		sectionHeaderText: {
			fontSize: verticalScale(18),
			marginLeft: 0,
			marginRight: 0,
			color: colors.text
		}
	});
