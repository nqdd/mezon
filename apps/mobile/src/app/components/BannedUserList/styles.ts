import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: size.s_16
		},
		imagePicker: {
			marginBottom: size.s_10,
			backgroundColor: colors.secondaryLight,
			borderColor: colors.secondaryLight
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: size.s_16,
			alignItems: 'center',
			width: '100%'
		},
		backButton: {
			paddingVertical: size.s_16,
			paddingHorizontal: size.s_6
		},
		resetButton: {
			color: baseColor.blurple
		},
		name: {
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: size.s_18,
			color: colors.white,
			maxWidth: '50%',
			alignSelf: 'center'
		},
		channelName: {
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: size.medium,
			color: colors.white,
			maxWidth: '50%',
			alignSelf: 'center'
		},
		titleWrapper: {
			position: 'absolute',
			alignSelf: 'center',
			width: '100%',
			zIndex: -1
		},
		label: {
			marginBottom: size.s_8,
			marginLeft: size.s_4,
			fontWeight: '600',
			color: colors.textStrong
		},
		requirementCardText: {
			fontSize: size.s_12,
			color: colors.textDisabled
		},
		semibold: {
			fontWeight: '600'
		},
		clearBannerButton: {
			position: 'absolute',
			right: -size.s_4,
			top: -size.s_6
		},
		searchBox: {
			backgroundColor: colors.secondary,
			borderRadius: size.s_8,
			alignItems: 'center',
			paddingHorizontal: size.s_12,
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: size.s_12
		},

		searchInput: {
			borderRadius: size.s_8,
			height: size.s_50,
			color: colors.textStrong,
			paddingVertical: size.s_6,
			paddingHorizontal: size.s_12,
			fontSize: size.medium,
			flex: 1
		},

		defaultText: {
			color: colors.text,
			fontSize: size.medium
		},

		emptyListWrapper: {
			paddingTop: size.s_40,
			justifyContent: 'center',
			alignItems: 'center'
		},

		emptyList: {
			color: colors.textDisabled,
			fontSize: size.medium,
			marginTop: size.s_20,
			textAlign: 'center'
		}
	});
