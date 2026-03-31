import { Attributes } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		absoluteContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%'
		},
		safeAreaView: {
			flex: 1,
			backgroundColor: colors.primary
		}
	});
