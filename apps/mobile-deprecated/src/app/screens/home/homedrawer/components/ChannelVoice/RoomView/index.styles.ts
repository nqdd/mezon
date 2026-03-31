import { size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

export const createStyles = () => {
	const marginWidth = Dimensions.get('screen').width;

	return StyleSheet.create({
		focusedScreenContainer: {
			width: '100%',
			flex: 1,
			alignItems: 'center'
		},
		focusedScreenWrapper: {
			height: '100%',
			width: '100%'
		},
		focusedScreenInner: {
			height: '100%',
			width: marginWidth
		},
		videoTrack: {
			height: '100%',
			width: '100%',
			alignSelf: 'center'
		},
		preCallContainer: {
			alignItems: 'center',
			justifyContent: 'center',
			paddingBottom: size.s_100 * 2
		},
		lottieView: {
			width: size.s_60,
			height: size.s_60
		}
	});
};
