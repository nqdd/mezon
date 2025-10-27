import { size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		marginTop: size.s_15,
		padding: size.s_20,
		alignItems: 'center'
	},
	userNameContainer: {
		flex: 1
	},
	userName: {
		fontSize: verticalScale(16),
		marginLeft: 0,
		marginRight: 0,
		textAlign: 'center',
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center'
	},
	actionListContainer: {
		marginHorizontal: size.s_10,
		borderRadius: size.s_10
	},
	actionItemContainer: {
		padding: size.s_14
	}
});
