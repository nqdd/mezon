import type { Attributes } from '@mezon/mobile-ui';
import { size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (themeValue: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: size.s_15
		},
		headerContainer: {
			marginBottom: size.s_14
		},
		title: {
			fontSize: verticalScale(18),
			textAlign: 'center',
			color: themeValue.white
		},
		roleTitle: {
			textAlign: 'center',
			color: themeValue.text
		},
		addButtonContainer: {
			position: 'absolute',
			right: 0
		},
		addButton: {
			padding: size.s_6
		},
		addButtonText: {
			fontSize: verticalScale(13),
			textAlign: 'center',
			color: themeValue.bgViolet
		},
		noMembersText: {
			textAlign: 'center',
			color: themeValue.text
		}
	});
