/* eslint-disable prettier/prettier */
import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTablet: boolean, hasVoted: boolean, isClosed: boolean, isLandscape: boolean) => {
	const actionBtn = {
		paddingVertical: size.s_6,
		paddingHorizontal: size.s_12,
		borderRadius: size.s_8
	};
	const actionBtnText = { fontSize: size.s_13 };

	return StyleSheet.create({
		container: {
			width: isTablet ? '60%' : '100%',
			maxWidth: !isTablet && isLandscape ? size.s_400 : size.s_615,
			alignSelf: 'flex-start',
			marginTop: size.s_8
		},
		card: {
			borderRadius: size.s_12,
			borderWidth: 1,
			borderColor: colors.borderDim,
			padding: size.s_16
		},
		question: {
			fontSize: size.s_16,
			fontWeight: '600',
			color: colors.textStrong,
			marginBottom: size.s_4
		},
		instruction: {
			fontSize: size.s_13,
			color: colors.textDisabled,
			marginBottom: size.s_16
		},
		optionsContainer: { gap: size.s_8 },
		optionRow: {
			borderRadius: size.s_8,
			overflow: 'hidden',
			minHeight: size.s_40,
			backgroundColor: colors.secondaryWeight,
		},
		optionFill: {
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			borderRadius: size.s_8
		},
		optionFillActive: { backgroundColor: baseColor.blurple },
		optionFillResult: { backgroundColor: 'rgba(88, 101, 242, 0.35)' },
		optionContent: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_12,
			position: 'relative',
			zIndex: 1
		},
		optionText: {
			flex: 1,
			fontSize: size.s_14,
			color: colors.textStrong,
			marginRight: size.s_8
		},
		optionTextActiveConfirmed: { color: baseColor.white },
		optionMeta: {
			fontSize: size.s_12,
			color: colors.textDisabled,
			marginRight: size.s_8
		},
		checkmark: {
			width: size.s_20,
			height: size.s_20,
			backgroundColor: hasVoted ? baseColor.blurple : colors.textStrong,
			alignItems: 'center',
			justifyContent: 'center'
		},
		footer: {
			marginTop: size.s_12,
			paddingTop: size.s_12,
			borderTopWidth: 1,
			borderTopColor: colors.borderDim,
			gap: size.s_8
		},
		footerContent: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		footerStats: { fontSize: size.s_12, color: isClosed ? baseColor.red : colors.textStrong },
		footerStatsLink: {
			fontSize: size.s_12,
			color: isClosed ? baseColor.red : colors.textStrong,
		},
		voteBtn: { ...actionBtn, backgroundColor: baseColor.blurple },
		voteBtnText: { ...actionBtnText, color: baseColor.white, fontWeight: '600' },
		checkmarkCircle: {
			borderRadius: size.s_10
		},
		checkmarkSquare: {
			borderRadius: size.s_4
		},
		loadMoreText: {
			color: colors.textStrong,
			fontSize: size.s_12,
			fontWeight: '600'
		}
	});
};
