import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		paddingHorizontal: size.s_20,
		paddingVertical: size.s_10,
		zIndex: 2
	},
	headerText: {
		fontSize: size.s_20,
		fontWeight: '600'
	},
	imageBg: {
		width: '90%',
		height: '35%',
		marginVertical: size.s_30
	},
	title: {
		fontSize: size.label,
		fontWeight: '700',
		textAlign: 'center'
	},
	description: {
		fontSize: size.s_15,
		fontWeight: '500',
		textAlign: 'center'
	},
	joinClan: {
		width: '100%',
		padding: size.s_10,
		backgroundColor: '#5865f2',
		borderRadius: size.s_50,
		marginBottom: size.s_10
	},
	createClan: {
		width: '100%',
		padding: size.s_10,
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#323232',
		borderRadius: size.s_50
	},
	textCreateClan: {
		fontSize: size.s_15,
		color: '#c7c7c7',
		fontWeight: '600',
		textAlign: 'center'
	},
	textJoinClan: {
		fontSize: size.s_15,
		color: '#white',
		fontWeight: '600',
		textAlign: 'center'
	}
});
