import { Dimensions, StyleSheet } from 'react-native';

export const createViewStyle = (isTabletLandscape: boolean, isBottomSheet: boolean) =>
	StyleSheet.create({
		tabViewContainer: {
			width: isTabletLandscape && isBottomSheet ? Dimensions.get('screen').width * 0.4 : Dimensions.get('screen').width
		}
	});
