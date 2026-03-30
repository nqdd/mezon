import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		imgWrapper: {
			width: size.s_50,
			height: size.s_50,
			borderRadius: size.s_50,
			overflow: 'hidden'
		}
	});
