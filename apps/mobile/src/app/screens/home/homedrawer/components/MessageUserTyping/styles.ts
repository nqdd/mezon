import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		typingLabel: {
			paddingBottom: size.s_2,
			paddingLeft: size.s_2,
			fontSize: size.s_12,
			color: colors.text,
			zIndex: 2
		},
		threeDot: {
			width: 30,
			height: 20,
			zIndex: 2
		},
		typingContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
			paddingBottom: size.s_4,
			paddingHorizontal: size.s_10,
			position: 'absolute',
			bottom: 0,
			zIndex: 1
		}
	});
