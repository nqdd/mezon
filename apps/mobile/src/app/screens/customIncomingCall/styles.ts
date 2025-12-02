import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
import { transparent } from 'tailwindcss/colors';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingVertical: size.s_100,
			paddingHorizontal: size.s_20
		},
		headerCall: {
			justifyContent: 'center',
			alignItems: 'center',
			gap: size.s_20
		},
		callerName: {
			fontSize: size.s_24,
			fontWeight: 'bold',
			marginVertical: size.s_10,
			color: 'white',
			textAlign: 'center'
		},
		callerInfo: {
			top: -size.s_14,
			fontSize: size.s_16,
			marginVertical: size.s_10,
			color: '#d8d8d8',
			textAlign: 'center'
		},
		callerImage: {
			width: size.s_150,
			height: size.s_150,
			borderRadius: size.s_150
		},
		buttonContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '85%'
		},
		button: {
			flex: 1,
			alignItems: 'center',
			marginHorizontal: size.s_150
		},
		deniedCall: { width: size.s_70, height: size.s_70 },
		answerCall: { width: size.s_100, height: size.s_100 },
		wrapperConnecting: {
			justifyContent: 'space-between',
			gap: size.s_20,
			alignItems: 'center'
		},
		containerCallDetail: {
			backgroundColor: colors.secondary,
			flex: 1
		},
		main: {
			flex: 1,
			marginBottom: size.s_50
		},
		menuHeader: {
			width: '100%',
			backgroundColor: transparent,
			padding: 10,
			borderRadius: 10,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			zIndex: 10
		},
		buttonCircle: {
			backgroundColor: colors.badgeHighlight,
			padding: size.s_12,
			borderRadius: size.s_100
		},
		buttonCircleActive: {
			backgroundColor: colors.text
		},
		card: {
			flex: 1,
			margin: size.s_10,
			borderRadius: size.s_10,
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.primary,
			overflow: 'hidden',
			zIndex: 10
		},
		cardNoVideo: {
			alignItems: 'center',
			justifyContent: 'center'
		},
		menuFooter: {
			marginBottom: size.s_40,
			width: '75%',
			alignSelf: 'center',
			padding: size.s_20,
			alignItems: 'center',
			zIndex: 10,
			gap: size.s_30,
			flexDirection: 'row',
			justifyContent: 'space-around'
		},
		menuIcon: {
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative',
			width: size.s_50 + size.s_4,
			height: size.s_50 + size.s_4,
			backgroundColor: colors.badgeHighlight,
			opacity: 0.5,
			borderRadius: size.s_100
		},
		menuIconActive: {
			backgroundColor: colors.white,
			opacity: 1
		},
		avatar: {
			width: size.s_70,
			height: size.s_70,
			borderRadius: size.s_70,
			alignSelf: 'center'
		},
		titleConfirm: {
			color: colors.text,
			marginVertical: size.s_10,
			fontSize: size.s_18,
			textAlign: 'center'
		},
		containerStatusState: {
			gap: size.s_4,
			flexDirection: 'row',
			alignSelf: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 11
		},
		statusMain: {
			width: '100%'
		},
		textStatus: {
			color: '#fabf2b',
			fontSize: size.s_16,
			textAlign: 'center'
		},
		textDescControl: {
			color: colors.text,
			fontSize: size.s_12,
			textAlign: 'center',
			fontWeight: '600',
			marginTop: size.s_10
		},
		cardMyVideoCall: {
			position: 'absolute',
			width: size.s_140,
			height: size.s_165,
			top: size.s_10,
			right: size.s_10,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: colors.border,
			zIndex: 20
		},
		mutedAudioContainer: {
			position: 'absolute',
			flexDirection: 'row',
			gap: size.s_6,
			justifyContent: 'center',
			alignItems: 'center',
			bottom: size.s_20,
			alignSelf: 'center',
			backgroundColor: colors.badgeHighlight,
			paddingHorizontal: size.s_10,
			marginHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			zIndex: 15
		},
		mutedAudioAvatarContainer: {
			flexDirection: 'row',
			top: size.s_100 + size.s_10,
			gap: size.s_6,
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'center',
			backgroundColor: colors.badgeHighlight,
			paddingHorizontal: size.s_10,
			marginHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			zIndex: 15
		},
		mutedAudioText: {
			color: colors.text,
			fontSize: size.s_14
		},
		headerControlsLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_20
		},
		headerControlsRight: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10
		},
		endCallButton: {
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative',
			width: size.s_50 + size.s_4,
			height: size.s_50 + size.s_4,
			backgroundColor: '#dc2626',
			opacity: 1,
			borderRadius: size.s_100
		},
		flexContainer: {
			flex: 1
		},
		mutedAudioAvatarContainerVisible: {
			flexDirection: 'row',
			top: size.s_150,
			gap: size.s_6,
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'center',
			backgroundColor: colors.badgeHighlight,
			paddingHorizontal: size.s_10,
			marginHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			zIndex: 15,
			opacity: 1
		},
		mutedAudioAvatarContainerHidden: {
			flexDirection: 'row',
			top: size.s_150,
			gap: size.s_6,
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'center',
			backgroundColor: colors.badgeHighlight,
			paddingHorizontal: size.s_10,
			marginHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			zIndex: 15,
			opacity: 0
		},
		callDurationTopVideo: {
			top: 0
		},
		callDurationTopAvatar: {
			top: size.s_70
		}
	});
