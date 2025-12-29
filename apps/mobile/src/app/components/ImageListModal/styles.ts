import { type Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors?: Attributes) =>
	StyleSheet.create({
		messageBoxTop: {
			gap: size.s_2,
			justifyContent: 'center'
		},
		usernameMessageBox: {
			fontSize: size.medium,
			marginRight: size.s_10,
			fontWeight: '600',
			color: 'white'
		},
		dateMessageBox: {
			fontSize: size.small,
			color: 'white'
		},
		wrapperAvatar: {
			width: size.s_40,
			height: size.s_40,
			borderRadius: size.s_40,
			justifyContent: 'center',
			alignItems: 'center',
			overflow: 'hidden'
		},
		imageWrapper: {
			width: size.s_40,
			height: size.s_60,
			alignItems: 'center',
			justifyContent: 'center',
			marginHorizontal: size.s_2
		},
		imageSelected: {
			borderWidth: 2,
			borderColor: baseColor.azureBlue
		},
		image: {
			width: '100%',
			height: '100%',
			borderRadius: 3
		},
		option: {
			zIndex: 100,
			gap: size.s_10
		},
		itemOption: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: size.s_6,
			borderBottomWidth: 1,
			borderBottomColor: colors?.secondaryLight,
			paddingBottom: size.s_10
		},
		textOption: {
			fontSize: size.medium,
			fontWeight: '600',
			color: colors?.text,
			paddingRight: size.s_30
		},
		container: {
			flex: 1
		},
		galleryContainer: {
			flex: 1
		},
		savedImageContainer: {
			position: 'absolute',
			top: '50%',
			width: '100%',
			alignItems: 'center'
		},
		savedImageBox: {
			backgroundColor: '#2a2e31',
			padding: size.s_10,
			borderRadius: size.s_10
		},
		savedImageText: {
			color: 'white'
		},
		headerContainer: {
			position: 'absolute',
			left: 0,
			zIndex: 1,
			justifyContent: 'space-between',
			flexDirection: 'row',
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
			width: '100%',
			padding: size.s_10,
			alignItems: 'center'
		},
		headerLeftSection: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10,
			flex: 1,
			maxWidth: '90%',
			overflow: 'hidden'
		},
		uploaderSection: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_6
		},
		loadingContainer: {
			backgroundColor: 'rgba(0,0,0,0.5)',
			position: 'absolute',
			top: 0,
			bottom: 0,
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center'
		},
		buttonPlay: {
			width: size.s_60,
			height: size.s_60,
			borderRadius: size.s_30,
			backgroundColor: 'rgba(0,0,0,0.6)',
			justifyContent: 'center',
			alignItems: 'center'
		},
		wrapperButtonPlay: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0,0,0,0.3)'
		},
		wrapperFooterModal: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			zIndex: 1,
			justifyContent: 'space-between',
			flexDirection: 'row',
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
			width: '100%',
			alignItems: 'center'
		},
		itemVideoFooter: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0,0,0,0.3)'
		},
		iconTooltip: {
			borderRadius: size.s_30,
			paddingLeft: size.s_20,
			height: size.s_30,
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 1000
		}
	});
