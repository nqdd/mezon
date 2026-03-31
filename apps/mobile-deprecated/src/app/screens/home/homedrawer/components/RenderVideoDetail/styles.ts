import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
		paddingVertical: size.s_50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	videoFullSize: {
		width: '100%',
		height: '100%'
	},
	closeButton: {
		position: 'absolute',
		top: size.s_24,
		right: 0,
		padding: size.s_10
	},
	loadingIndicator: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: -15 }, { translateY: -15 }]
	}
});
