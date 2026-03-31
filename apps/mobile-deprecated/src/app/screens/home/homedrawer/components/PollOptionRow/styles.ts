/* eslint-disable prettier/prettier */
import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, hasVoted: boolean) =>
	StyleSheet.create({
		optionRow: {
			borderRadius: size.s_8,
			overflow: 'hidden',
			minHeight: size.s_40,
			backgroundColor: colors.secondaryWeight
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
		checkmarkCircle: {
			borderRadius: size.s_10
		},
		checkmarkSquare: {
			borderRadius: size.s_4
		}
	});
