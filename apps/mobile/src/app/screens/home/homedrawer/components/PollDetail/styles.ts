import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
			justifyContent: 'center',
			paddingHorizontal: size.s_16
		},
		modalContainer: {
			backgroundColor: colors.primary,
			borderRadius: size.s_12,
			borderWidth: 1,
			borderColor: colors.borderDim,
			maxHeight: '85%',
			width: '100%',
			maxWidth: size.s_615,
			alignSelf: 'center',
			overflow: 'hidden'
		},
		modalContainerLandscape: {
			maxWidth: size.s_615
		},
		modalHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: size.s_16,
			paddingTop: size.s_14
		},
		modalTitle: {
			flex: 1,
			fontSize: size.s_20,
			fontWeight: '700',
			color: colors.textStrong,
			marginRight: size.s_8
		},
		modalCloseText: {
			fontSize: size.s_24,
			color: colors.textStrong
		},
		modalSubtitle: {
			fontSize: size.s_14,
			color: colors.textStrong,
			paddingHorizontal: size.s_16,
			paddingBottom: size.s_12
		},
		modalBody: {
			flexDirection: 'row',
			borderTopWidth: 1,
			borderTopColor: colors.borderDim,
			minHeight: 0
		},
		modalLeftColumn: {
			width: '42%',
			borderRightWidth: 1,
			borderRightColor: colors.borderDim,
			padding: size.s_12,
			minHeight: 0
		},
		modalLeftColumnContent: {
			gap: size.s_8
		},
		modalRightColumn: {
			flex: 1,
			padding: size.s_12,
			minHeight: 0
		},
		modalColumnScroll: {
			flex: 1
		},
		modalOptionItem: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: size.s_8,
			paddingVertical: size.s_10,
			borderRadius: size.s_8
		},
		modalOptionItemActive: {
			backgroundColor: 'rgba(88, 101, 242, 0.2)'
		},
		modalOptionText: {
			flex: 1,
			fontSize: size.s_14,
			color: colors.textStrong,
			marginRight: size.s_8
		},
		modalOptionCount: {
			fontSize: size.s_14,
			color: colors.textDisabled
		},
		modalVoterItem: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10,
			paddingVertical: size.s_6
		},
		modalVoterInfo: {
			flex: 1,
			minWidth: 0
		},
		modalVoterDisplayName: {
			fontSize: size.s_14,
			color: colors.textStrong,
			fontWeight: '600'
		},
		modalVoterUsername: {
			fontSize: size.s_12,
			color: colors.textDisabled
		},
		modalEmptyTextContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		modalEmptyText: {
			fontSize: size.s_13,
			color: colors.textDisabled
		},
		avatarWrapper: {
			width: size.s_32,
			height: size.s_32,
			borderRadius: size.s_32,
			overflow: 'hidden'
		},
		modalLoadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		}
	});
