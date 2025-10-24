import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			gap: size.s_10,
			flexDirection: 'row',
			padding: size.s_10,
			alignItems: 'center'
		},
		roleInfoContainer: {
			flex: 1
		},
		roleNameRow: {
			flexDirection: 'row',
			gap: size.s_4,
			alignItems: 'center'
		},
		roleNameText: {
			fontSize: size.s_14,
			marginLeft: 0,
			marginRight: 0,
			color: colors.white
		},
		roleTypeText: {
			marginLeft: 0,
			marginRight: 0,
			color: colors.textDisabled
		},
		checkboxContainer: {
			height: size.s_20,
			width: size.s_20
		}
	});
