/* eslint-disable prettier/prettier */
import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTablet: boolean, isClosed: boolean, isLandscape: boolean) => {
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
		loadMoreText: {
			color: colors.textStrong,
			fontSize: size.s_12,
			fontWeight: '600'
		}
	});
};
