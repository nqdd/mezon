import { baseColor, size, ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import type { TFunction } from 'i18next';
import { memo, useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { PollEmoji } from '../PollEmoji';
import { style } from './styles';

export interface IPollOptionRow {
	index: number;
	label: string;
	voteCount: number;
	percentage: number;
	isSelected: boolean;
}

interface IPollOptionRowProps {
	option: IPollOptionRow;
	shouldShowResults: boolean;
	allowMultiple: boolean;
	onPress: () => void;
	t: TFunction;
	hasVoted: boolean;
	themeBasic: ThemeModeBase;
}

const ANIMATION_DURATION = 600;
const ACTIVE_TEXT_WHITE_THRESHOLD = 55;

export const PollOptionRow = memo(
	({ option, shouldShowResults, allowMultiple, onPress, t, hasVoted, themeBasic }: IPollOptionRowProps) => {
		const { themeValue } = useTheme();
		const rowStyles = useMemo(() => style(themeValue, hasVoted), [themeValue, hasVoted]);
		const progress = useSharedValue(0);
		const checkIconColor = useMemo(() => {
			return hasVoted
				? baseColor.white
				: themeBasic === ThemeModeBase.LIGHT || themeBasic === ThemeModeBase.SUNRISE
					? baseColor.white
					: baseColor.black;
		}, [hasVoted, themeBasic]);

		const shouldUseActiveLabelColor = useMemo(() => {
			return hasVoted && option.isSelected;
		}, [hasVoted, option.isSelected]);

		const shouldUseActiveMetaColor = useMemo(() => {
			return hasVoted && option.isSelected && shouldShowResults && option.percentage >= ACTIVE_TEXT_WHITE_THRESHOLD;
		}, [hasVoted, option.isSelected, shouldShowResults, option.percentage]);

		useEffect(() => {
			if (shouldShowResults) {
				progress.value = withTiming(option.percentage, { duration: ANIMATION_DURATION });
			} else {
				progress.value = 0;
			}
		}, [shouldShowResults, option.percentage]);

		const animatedFillStyle = useAnimatedStyle(() => ({
			width: `${progress.value}%`
		}));

		return (
			<Pressable onPress={onPress} disabled={shouldShowResults} style={rowStyles.optionRow}>
				<Animated.View
					style={[
						rowStyles.optionFill,
						option.isSelected && rowStyles.optionFillActive,
						shouldShowResults && !option.isSelected && rowStyles.optionFillResult,
						animatedFillStyle
					]}
				/>
				<View style={rowStyles.optionContent}>
					<PollEmoji
						text={option?.label}
						textStyle={[rowStyles.optionText, shouldUseActiveLabelColor && rowStyles.optionTextActiveConfirmed]}
					/>
					{shouldShowResults && (
						<Text style={[rowStyles.optionMeta, shouldUseActiveMetaColor && rowStyles.optionTextActiveConfirmed]}>
							{option.percentage}% {`${option.voteCount} ${option.voteCount > 1 ? t('poll.votes') : t('poll.vote')}`}
						</Text>
					)}
					{option.isSelected && (
						<View style={[rowStyles.checkmark, allowMultiple ? rowStyles.checkmarkSquare : rowStyles.checkmarkCircle]}>
							<MezonIconCDN icon={IconCDN.checkmarkSmallIcon} color={checkIconColor} width={size.s_14} height={size.s_14} />
						</View>
					)}
				</View>
			</Pressable>
		);
	}
);
