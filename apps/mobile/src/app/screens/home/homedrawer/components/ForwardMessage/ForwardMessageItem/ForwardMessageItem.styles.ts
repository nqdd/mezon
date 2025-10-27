import { verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (themeValue: any) =>
	StyleSheet.create({
		imageFullSize: {
			width: '100%',
			height: '100%'
		},
		channelHashText: {
			fontSize: verticalScale(20),
			textAlign: 'center',
			color: themeValue.white
		},
		nameContainer: {
			flex: 1,
			justifyContent: 'center'
		},
		nameText: {
			color: themeValue.textStrong
		},
		checkboxContainer: {
			justifyContent: 'center'
		},
		checkboxIconStyle: {
			borderRadius: 5
		},
		checkboxFillColor: '#5865f2'
	});

export const getCheckboxInnerIconStyle = (isChecked: boolean, themeValue: any) => ({
	borderWidth: 1.5,
	borderColor: isChecked ? '#5865f2' : themeValue.white,
	borderRadius: 5,
	opacity: 1
});
