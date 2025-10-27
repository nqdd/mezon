import { Attributes, size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const createStyles = (themeValue: Attributes, themeBasic: string, heightKeyboardShow: number, typeKeyboardBottomSheet: string) =>
	StyleSheet.create({
		spacerView: {
			height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
			backgroundColor: themeBasic === 'light' ? themeValue.tertiary : themeValue.primary
		},
		bottomSheetBackground: {
			backgroundColor: themeBasic === 'light' ? themeValue.tertiary : themeValue.primary
		},
		handleIndicator: {
			backgroundColor: themeValue.tertiary,
			height: size.s_6,
			width: size.s_50
		},
		scrollViewContentFlex: {
			flex: 1
		},
		scrollViewMinHeight: {
			minHeight: heightKeyboardShow
		}
	});
