import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			alignItems: 'center'
		},
		lineWrapper: {
			height: 1,
			width: '95%',
			backgroundColor: baseColor.redStrong,
			margin: size.s_10
		},
		textWrapper: {
			position: 'absolute',
			left: 0,
			alignItems: 'center',
			width: '100%'
		},
		textContainer: {
			paddingHorizontal: size.s_10,
			marginTop: -size.s_10,
			backgroundColor: colors.primary
		},
		text: {
			top: Platform.OS === 'ios' ? size.s_4 : 0,
			color: baseColor.redStrong
		}
	});
