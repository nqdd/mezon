import { Attributes, size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const style = (colors: Attributes, themeBasic: string) =>
	StyleSheet.create({
		keyboardSpacer: (heightKeyboardShow: number, typeKeyboardBottomSheet: string) => ({
			height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
			backgroundColor: themeBasic === 'light' ? colors.tertiary : colors.primary
		}),
		bottomSheetBackground: (themeBasic: string, colors: Attributes) => ({
			backgroundColor: themeBasic === 'light' ? colors.tertiary : colors.primary
		}),
		handleIndicator: (colors: Attributes) => ({
			backgroundColor: colors.tertiary,
			height: size.s_6,
			width: size.s_50
		}),
		scrollViewContent: {
			flex: 1
		},
		scrollViewMinHeight: (heightKeyboardShow: number) => ({
			minHeight: heightKeyboardShow
		})
	});
