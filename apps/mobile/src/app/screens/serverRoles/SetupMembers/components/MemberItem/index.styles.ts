import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: colors.secondary,
			padding: size.s_12,
			gap: size.s_10
		},
		memberInfoContainer: {
			flex: 1,
			flexDirection: 'row',
			gap: size.s_10,
			alignItems: 'center'
		},
		memberTextContainer: {
			width: '80%'
		},
		memberName: {
			color: colors.white
		},
		memberUsername: {
			color: colors.text
		},
		actionContainer: {
			height: size.s_20,
			width: size.s_20
		},
		checkboxIcon: {
			borderRadius: 5
		},
		checkboxInnerIcon: {
			borderWidth: 1.5,
			borderRadius: 5
		}
	});
