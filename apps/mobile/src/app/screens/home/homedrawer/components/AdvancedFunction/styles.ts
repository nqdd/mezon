import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary,
			padding: size.s_6,
			paddingTop: size.s_20,
			width: '100%',
			minHeight: size.s_100
		},
		gridContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'flex-start',
			paddingBottom: size.s_20
		},
		functionItem: {
			width: '25%',
			alignItems: 'center',
			marginBottom: size.s_20,
			paddingHorizontal: size.s_8
		},
		iconContainer: {
			width: size.s_42,
			height: size.s_42,
			borderRadius: size.s_42,
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: size.s_8
		},
		label: {
			fontSize: size.s_12,
			color: colors.text,
			textAlign: 'center'
		}
	});
