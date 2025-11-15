import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	headerModal: { backgroundColor: 'transparent' },
	title: {
		fontSize: size.h4,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: size.s_10
	},
	textInviteBtn: {
		fontSize: size.medium,
		fontWeight: '500',
		color: 'white',
		textAlign: 'center'
	},
	btnInvite: {
		width: '100%',
		marginTop: size.s_40,
		padding: size.s_12,
		backgroundColor: baseColor.blurple,
		borderRadius: size.s_10
	},
	description: {
		fontSize: size.medium,
		fontWeight: '500',
		color: '#c7c7c7',
		textAlign: 'center'
	},
	textExample: {
		marginTop: size.s_6,
		fontSize: size.small,
		fontWeight: '400',
		color: '#c7c7c7'
	},
	backButton: {
		position: 'absolute',
		left: -size.s_16,
		top: -size.s_10,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
		width: size.s_40,
		height: size.s_40,
		borderRadius: size.s_20
	},
	container: {
		flex: 1,
		paddingBottom: size.s_100
	},
	contentWrapper: {
		width: '100%',
		height: '100%',
		paddingHorizontal: size.s_16,
		paddingTop: size.s_20,
		position: 'relative'
	},
	headerSection: {
		marginBottom: size.s_40
	}
});
