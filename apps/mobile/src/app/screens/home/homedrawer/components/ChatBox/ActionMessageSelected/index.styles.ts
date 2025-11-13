import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'column'
		},
		replyContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderBottomColor: colors.border
		},
		closeButton: {
			padding: size.tiny
		},
		replyText: {
			fontSize: size.s_10,
			color: colors.text
		},
		editContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: size.tiny,
			gap: 10,
			borderBottomWidth: 1,
			borderBottomColor: colors.border
		},
		editText: {
			fontSize: verticalScale(10),
			color: colors.text
		}
	});
