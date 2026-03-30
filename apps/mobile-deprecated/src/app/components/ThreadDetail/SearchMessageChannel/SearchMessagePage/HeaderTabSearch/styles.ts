import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			borderBottomColor: '#5a5b5c30',
			borderBottomWidth: 1
		},
		tabButton: {
			width: '33.33%'
		},
		tabContent: {
			paddingBottom: size.s_10,
			paddingVertical: size.s_20,
			alignItems: 'center'
		}
	});
