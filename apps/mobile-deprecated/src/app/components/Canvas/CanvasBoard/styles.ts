import { Attributes } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.charcoal
		},
		loadingOverlay: {
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			height: '100%',
			zIndex: 1,
			width: '100%',
			backgroundColor: colors.charcoal,
			flex: 1
		}
	});
