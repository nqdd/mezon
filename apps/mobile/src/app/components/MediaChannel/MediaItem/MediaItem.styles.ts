import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	containerItem: {
		position: 'relative',
		width: '100%',
		height: '100%',
		borderWidth: 1,
		borderColor: 'rgba(78,78,78,0.4)',
		borderRadius: size.s_10,
		overflow: 'hidden'
	},
	boxAvatar: {
		position: 'absolute',
		top: size.s_8,
		zIndex: 1,
		right: size.s_8,
		borderWidth: 1,
		borderColor: '#242427',
		width: size.s_26,
		height: size.s_26,
		borderRadius: size.s_26,
		overflow: 'hidden'
	},
	image: { width: '100%', height: '100%' },
	video: {
		width: '100%',
		height: '100%',
		borderRadius: size.s_4,
		overflow: 'hidden'
	},
	itemVideoFooter: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)'
	}
});

export default styles;
