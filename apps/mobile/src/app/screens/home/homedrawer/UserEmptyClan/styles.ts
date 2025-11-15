import { baseColor, size, type Attributes } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		wrapper: {
			height: '100%',
			width: '100%',
			overflow: 'hidden',
			flexShrink: 1,
			zIndex: 10
		},
		headerText: {
			fontSize: size.s_20,
			fontWeight: '600'
		},
		imageBg: {
			width: '90%',
			height: '35%',
			marginVertical: size.s_30,
			alignSelf: 'center'
		},
		title: {
			fontSize: size.label,
			fontWeight: '700',
			textAlign: 'center'
		},
		description: {
			fontSize: size.s_15,
			fontWeight: '500',
			textAlign: 'center'
		},
		joinClan: {
			width: '100%',
			padding: size.s_10,
			backgroundColor: '#5865f2',
			borderRadius: size.s_50,
			marginBottom: size.s_10
		},
		createClan: {
			width: '100%',
			padding: size.s_10,
			backgroundColor: 'transparent',
			borderWidth: 1,
			borderColor: 'rgba(50,50,50,0.5)',
			borderRadius: size.s_50
		},
		textCreateClan: {
			fontSize: size.s_15,
			color: '#c7c7c7',
			fontWeight: '600',
			textAlign: 'center'
		},
		textJoinClan: {
			fontSize: size.s_15,
			color: '#white',
			fontWeight: '600',
			textAlign: 'center'
		},
		containerHeader: {
			width: '100%',
			borderBottomWidth: 1,
			paddingTop: size.s_6,
			paddingBottom: size.s_14,
			paddingHorizontal: size.s_12,
			borderBottomColor: colors.border,
			zIndex: 2
		},
		wrapperSearch: {
			flex: 1,
			flexDirection: 'row',
			backgroundColor: colors.secondary,
			overflow: 'hidden',
			alignItems: 'center',
			height: size.s_36,
			paddingLeft: size.s_10,
			gap: size.s_10,
			borderRadius: size.s_10,
			borderWidth: 1,
			borderColor: colors.secondaryLight
		},
		placeholderSearchBox: {
			color: colors.text,
			fontSize: size.s_14,
			lineHeight: size.s_18
		},
		iconWrapper: {
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: size.s_10,
			backgroundColor: colors.secondary,
			width: size.s_36,
			height: size.s_36
		},
		dot: {
			width: size.s_4,
			height: size.s_4,
			borderRadius: size.s_4,
			backgroundColor: colors.textDisabled,
			marginHorizontal: size.s_8
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		navigationBar: {
			marginTop: size.s_10,
			flexDirection: 'row',
			gap: size.s_8
		},
		inputSearch: {
			flex: 1,
			height: '100%',
			width: '100%',
			paddingRight: size.s_10,
			color: colors.text
		},
		headerTextEmpty: {
			fontSize: size.s_16,
			color: colors.text,
			marginBottom: size.s_6,
			fontWeight: '600'
		},
		containerDiscover: {
			width: '100%',
			paddingHorizontal: size.s_12
		},
		listContainer: {
			paddingHorizontal: size.s_12,
			paddingBottom: size.s_100,
			paddingTop: size.s_12
		},
		itemContainer: {
			backgroundColor: colors.secondary,
			borderRadius: size.s_12,
			marginBottom: size.s_16,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: colors.borderDim
		},
		clanBanner: {
			width: '100%',
			height: size.s_80
		},
		contentContainer: {
			padding: size.s_10,
			paddingBottom: size.s_8
		},
		headerRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: size.s_8
		},
		smallAvatar: {
			width: size.s_20,
			height: size.s_20,
			borderRadius: size.s_12,
			marginRight: size.s_8
		},
		clanName: {
			fontSize: size.s_12,
			fontWeight: '600',
			flex: 1,
			color: colors.text
		},
		description: {
			fontSize: size.s_10,
			marginBottom: size.s_8,
			color: colors.textDisabled
		},
		footer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		membersContainer: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		memberDot: {
			width: size.s_8,
			height: size.s_8,
			borderRadius: size.s_4,
			marginRight: size.s_6,
			backgroundColor: baseColor.green
		},
		memberText: {
			fontSize: size.s_10,
			fontWeight: '500',
			color: colors.textDisabled
		},
		verifiedBadge: {
			flexDirection: 'row',
			gap: size.s_4,
			alignItems: 'center',
			paddingHorizontal: size.s_4,
			paddingVertical: size.s_2,
			borderRadius: size.s_4,
			backgroundColor: baseColor.green
		},
		verifiedText: {
			fontSize: size.s_10,
			fontWeight: '600',
			color: baseColor.white,
			textTransform: 'uppercase'
		},
		emptyContainer: {
			padding: size.s_40,
			alignItems: 'center',
			justifyContent: 'center'
		},
		emptyText: {
			fontSize: size.s_16,
			color: colors.textDisabled
		},
		badgeItemTabType: {
			paddingHorizontal: size.s_2,
			backgroundColor: baseColor.red,
			borderRadius: size.s_18,
			minWidth: size.s_18,
			height: size.s_18,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			top: -size.s_6,
			right: -size.s_8,
			zIndex: 10,
			overflow: 'visible'
		},
		textBadgeItemTabType: {
			color: 'white',
			fontSize: size.small,
			lineHeight: size.small,
			fontWeight: '500',
			paddingHorizontal: size.s_4,
			textAlign: 'center'
		}
	});
