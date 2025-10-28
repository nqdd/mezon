import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: size.s_40,
		backgroundColor: '#242427',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: size.s_20,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center'
	},
	subTitle: {
		textAlign: 'center',
		marginTop: size.s_10,
		fontSize: size.s_16,
		lineHeight: size.s_24,
		color: '#ccc'
	},
	titleBtn: {
		flex: 1,
		textAlign: 'center',
		fontSize: size.s_16,
		fontWeight: 'bold',
		color: '#000000'
	},
	imageContainer: {
		alignSelf: 'center',
		maxHeight: '70%',
		marginBottom: size.s_50
	},
	rocketImage: {
		width: size.s_300,
		height: size.s_300,
		maxHeight: '80%'
	},
	updateButtonBase: {
		backgroundColor: 'white',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: size.s_10,
		height: size.s_50,
		borderRadius: size.s_50,
		alignItems: 'center',
		alignSelf: 'center'
	}
});

export const dynamicStyles = {
	updateButton: (isTabletLandscape: boolean) => ({
		...styles.updateButtonBase,
		width: isTabletLandscape ? '50%' : '100%'
	})
};
