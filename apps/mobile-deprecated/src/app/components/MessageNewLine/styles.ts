import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignSelf: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			padding: size.s_12
		},
		text: {
			fontSize: size.s_12,
			fontWeight: '500',
			color: baseColor.red,
			paddingHorizontal: size.s_10,
			textTransform: 'uppercase',
			textAlign: 'center'
		},
		line: {
			flex: 1,
			height: 1,
			backgroundColor: baseColor.red,
			opacity: 0.5
		}
	});
