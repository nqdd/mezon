import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		clanName: {
			color: colors.text,
			fontSize: size.s_20,
			fontWeight: '700'
		},

		inviteContainer: {
			width: '90%',
			backgroundColor: colors.secondary,
			borderRadius: size.s_12,
			padding: size.s_12,
			paddingVertical: size.s_20,
			gap: size.s_10
		},

		inviteTitle: {
			color: colors.textStrong,
			fontSize: size.h4,
			marginBottom: size.s_8,
			fontWeight: '600',
			letterSpacing: 0.5,
			textAlign: 'center'
		},

		appDescription: {
			fontSize: size.medium,
			textAlign: 'center',
			color: colors.text
		},

		clanTitle: {
			fontSize: size.s_12,
			fontWeight: '600',
			marginLeft: size.s_4,
			color: colors.text
		},

		clanInfo: {
			alignItems: 'center',
			gap: size.s_10,
			marginBottom: size.s_20
		},

		clanAvatar: {
			width: size.s_65,
			height: size.s_65,
			borderRadius: size.s_40,
			backgroundColor: colors.secondary,
			overflow: 'hidden'
		},

		defaultAvatar: {
			width: size.s_65,
			height: size.s_65,
			borderRadius: size.s_14,
			backgroundColor: baseColor.blurple,
			alignItems: 'center',
			justifyContent: 'center'
		},

		defaultAvatarText: {
			color: 'white',
			fontSize: size.s_26,
			fontWeight: '600'
		},

		clanTextInfo: {
			flex: 1,
			gap: size.s_2
		},

		channelName: {
			color: colors.textDisabled,
			fontSize: size.small,
			fontWeight: '500',
			letterSpacing: 0.5
		},

		joinButton: {
			backgroundColor: baseColor.blurple,
			borderRadius: size.s_100,
			paddingVertical: size.s_12,
			paddingHorizontal: size.s_12,
			alignItems: 'center'
		},

		joinButtonText: {
			color: 'white',
			fontSize: size.s_14,
			fontWeight: '600',
			letterSpacing: 0.5
		},

		disMissButton: {
			backgroundColor: colors.textDisabled
		},

		clanNameRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_2
		},

		chevronDownIcon: {
			position: 'absolute',
			right: size.s_10
		},

		inputValue: {
			color: colors.text,
			paddingHorizontal: size.s_10,
			maxWidth: '95%'
		},

		fakeInput: {
			backgroundColor: colors.secondaryLight,
			borderRadius: size.s_10,
			alignItems: 'center',
			paddingHorizontal: size.s_12,
			paddingVertical: size.s_16,
			flexDirection: 'row',
			marginBottom: size.s_20,
			borderWidth: 1,
			borderColor: colors.border
		},
		searchText: {
			paddingHorizontal: size.s_10,
			backgroundColor: colors.secondaryLight
		},
		items: {
			flexDirection: 'row',
			paddingHorizontal: size.s_8,
			paddingVertical: size.s_12,
			marginBottom: size.s_10,
			borderRadius: size.s_12,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
			backgroundColor: colors.secondaryLight
		},
		bottomSheet: {
			paddingHorizontal: size.s_20,
			paddingVertical: size.s_10,
			flex: 1,
			gap: size.s_10
		},
		bottomSheetContent: {
			paddingBottom: size.s_20
		}
	});
