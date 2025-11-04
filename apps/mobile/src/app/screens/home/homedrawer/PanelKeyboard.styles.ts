import { Attributes, size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const createStyles = (themeValue: Attributes, heightKeyboardShow: number, typeKeyboardBottomSheet: string) =>
	StyleSheet.create({
		spacerView: {
			height: Platform.OS === 'ios' || typeKeyboardBottomSheet !== 'text' ? heightKeyboardShow : 0,
			backgroundColor: themeValue.primary
		},
		bottomSheetBackground: {
			backgroundColor: themeValue.primary
		},
		handleIndicator: {
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
