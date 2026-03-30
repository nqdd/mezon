import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	from: {
		paddingHorizontal: size.s_20
	},
	headerModal: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	option: {
		backgroundColor: '#242427'
	},
	durationText: {
		fontSize: size.label,
		color: '#c7c7c7',
		fontWeight: '600',
		marginBottom: size.s_10,
		marginTop: size.s_30
	},
	titleModal: {
		flex: 1,
		textAlign: 'center',
		position: 'absolute',
		alignSelf: 'center',
		left: 0,
		right: 0,
		zIndex: -1
	},
	btnClose: {
		width: size.s_100,
		padding: size.s_20,
		paddingTop: size.s_10,
		alignItems: 'flex-start'
	},
	btnSave: {
		width: size.s_100,
		padding: size.s_20,
		paddingTop: size.s_10,
		alignItems: 'flex-end'
	},
	titleHeader: {
		fontWeight: '600',
		fontSize: size.s_18,
		textAlign: 'center'
	},
	buttonSave: {
		fontWeight: '600',
		fontSize: size.s_16,
		color: baseColor.blurple,
		textAlign: 'center'
	}
});
