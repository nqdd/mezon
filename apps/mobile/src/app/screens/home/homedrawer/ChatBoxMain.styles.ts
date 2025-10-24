import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			borderTopWidth: 1,
			flexDirection: 'column',
			justifyContent: 'space-between'
		},
		warningContainer: {
			zIndex: 10,
			width: '95%',
			marginVertical: size.s_6,
			alignSelf: 'center',
			marginBottom: size.s_20
		},
		warningBox: {
			padding: size.s_16,
			borderRadius: size.s_20,
			marginHorizontal: size.s_6
		},
		warningText: {
			textAlign: 'center'
		}
	});
