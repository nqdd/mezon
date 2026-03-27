import { baseColor, size, ThemeModeBase, useTheme } from '@mezon/mobile-ui';
import type { TFunction } from 'i18next';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import useTabletLandscape from '../../../../../hooks/useTabletLandscape';
import { style } from './styles';
import { getStore, MessagesEntity, selectMemberClanByUserId, selectMemberDMByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { convertTimestampToTimeRemainingI18n } from '@mezon/utils';
import { getPoll, selectMyVote, votePoll } from '@mezon/store';
import { EPollType } from '@mezon/utils';
import { PollEmoji } from '../PollEmoji';
import { IPollVoter, PollDetailModal } from '../PollDetail';

interface IPollOptionRow {
    index: number;
    label: string;
    voteCount: number;
    percentage: number;
    isSelected: boolean;
}

interface IPollCardProps {
    onLongPress?: () => void;
    message: MessagesEntity;
}

interface IPollOptionRowProps {
    option: IPollOptionRow;
    shouldShowResults: boolean;
    allowMultiple: boolean;
    styles: ReturnType<typeof style>;
    onPress: () => void;
    t: TFunction;
    hasVoted: boolean;
    themeBasic: ThemeModeBase;
}

const MAX_VISIBLE_OPTIONS = 5;
const ANIMATION_DURATION = 600;
const ACTIVE_TEXT_WHITE_THRESHOLD = 55;

const PollOptionRow = memo(({ option, shouldShowResults, allowMultiple, styles, onPress, t, hasVoted, themeBasic }: IPollOptionRowProps) => {
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
        width: `${progress.value}%`,
    }));

    return (
        <Pressable onPress={onPress} disabled={shouldShowResults} style={styles.optionRow}>
            <Animated.View
                style={[
                    styles.optionFill,
                    option.isSelected && styles.optionFillActive,
                    shouldShowResults && !option.isSelected && styles.optionFillResult,
                    animatedFillStyle
                ]}
            />
            <View style={styles.optionContent}>
                <PollEmoji
                    text={option?.label}
                    textStyle={[styles.optionText, shouldUseActiveLabelColor && styles.optionTextActiveConfirmed]}
                />
                {shouldShowResults && (
                    <Text style={[styles.optionMeta, shouldUseActiveMetaColor && styles.optionTextActiveConfirmed]}>
                        {option.percentage}% {`${option.voteCount} ${option.voteCount > 1 ? t('poll.votes') : t('poll.vote')}`}
                    </Text>
                )}
                {option.isSelected && (
                    <View style={[
                        styles.checkmark,
                        allowMultiple ? styles.checkmarkSquare : styles.checkmarkCircle
                    ]}>
                        <MezonIconCDN icon={IconCDN.checkmarkSmallIcon} color={checkIconColor} width={size.s_14} height={size.s_14} />
                    </View>
                )}
            </View>
        </Pressable>
    );
});

export const PollCard = memo(({ onLongPress, message }: IPollCardProps) => {
    const isTablet = useTabletLandscape();
    const { themeValue, themeBasic } = useTheme();
    const { t } = useTranslation('message');
    const { t: tCommon } = useTranslation('common');
    const myVote = useAppSelector((state) => selectMyVote(state));
    const myVoteForMessage = message?.id ? (myVote[message.id] ?? []) : [];
    const pollData = message?.content
    const [selection, setSelection] = useState<number[]>(() => myVoteForMessage);
    const [hasVoted, setHasVoted] = useState<boolean>(() => myVoteForMessage.length > 0);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [isExpandedOptions, setIsExpandedOptions] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isLoadingPollDetail, setIsLoadingPollDetail] = useState<boolean>(false);
    const [detailSelectedIndex, setDetailSelectedIndex] = useState<number>(0);
    const [detailVotersByOption, setDetailVotersByOption] = useState<Record<number, IPollVoter[]>>({});
    const [dimentsions, setDimentsions] = useState<{ width: number, height: number }>(() => {
        const { width, height } = Dimensions.get('screen');
        return { width, height };
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsExpandedOptions(false);
    }, [message?.id]);

    const checkOrientation = () => {
        const { width, height } = Dimensions.get('screen');
        setDimentsions({ width, height });
    };

    useEffect(() => {
        checkOrientation();

        const subscription = Dimensions.addEventListener('change', () => {
            checkOrientation();
        });

        return () => subscription?.remove();
    }, []);

    const isLandscape = useMemo(() => {
        return dimentsions.width > dimentsions.height;
    }, [dimentsions]);

    const styles = useMemo(() => style(themeValue, isTablet, hasVoted, pollData?.is_closed, isLandscape), [themeValue, isTablet, hasVoted, pollData?.is_closed, isLandscape]);
    const isMultiple = useMemo(() => pollData?.type === EPollType.MULTIPLE, [pollData?.type]);

    const shouldVote = useMemo(() => {
        return !hasVoted && selection.length > 0;
    }, [hasVoted, selection]);

    const shouldShowResults = useMemo(() => {
        return showResults || hasVoted || pollData?.is_closed;
    }, [showResults, hasVoted, pollData?.is_closed]);

    const displayOptions = useMemo(() => {
        if (!pollData?.answers) return [];

        return pollData.answers.map((option) => {
            const voteCount = pollData?.answer_counts?.[option?.index] ?? 0;
            const percentage = pollData?.total_votes ? Math.round((voteCount / pollData.total_votes) * 100) : 0;
            return {
                index: option?.index,
                label: option?.label,
                voteCount,
                percentage,
                isSelected: selection.includes(option?.index)
            };
        });
    }, [pollData?.answers, pollData?.answer_counts, pollData?.total_votes, selection]);

    const visibleOptions = useMemo(() => {
        if (isExpandedOptions) return displayOptions;
        return displayOptions.slice(0, MAX_VISIBLE_OPTIONS);
    }, [displayOptions, isExpandedOptions]);

    const hiddenCount = useMemo(() => {
        return Math.max(displayOptions.length - MAX_VISIBLE_OPTIONS, 0);
    }, [displayOptions]);

    const shouldShowToggleOptions = useMemo(() => {
        return displayOptions.length > MAX_VISIBLE_OPTIONS;
    }, [displayOptions]);

    const toggleLoadMoreOptions = () => {
        setIsExpandedOptions((prev) => !prev);
    }

    const toggleShowResults = () => {
        setShowResults((prev) => !prev);
    }

    const closePollDetail = useCallback(() => {
        setIsDetailModalOpen(false)
    }, []);

    const handleOpenPollDetail = useCallback(async () => {
        if (!message?.id || !message?.channel_id || !displayOptions.length) return;

        setIsDetailModalOpen(true);
        setIsLoadingPollDetail(true);
        setDetailSelectedIndex(displayOptions[0]?.index);

        try {
            const response = await dispatch(getPoll({
                message_id: message.id,
                channel_id: message.channel_id
            })).unwrap();
            const voterDetails = response?.voter_details;
            const state = getStore().getState();
            const mappedVotersByOption: Record<number, IPollVoter[]> = {};
            const voterCache = new Map<string, IPollVoter>();

            if (voterDetails?.length > 0) {
                const getCachedVoter = (userId: string): IPollVoter => {
                    const cached = voterCache.get(userId);
                    if (cached) return cached;

                    const member = selectMemberClanByUserId(state, userId);
                    const memberDm = selectMemberDMByUserId(state, userId);
                    const voter = {
                        id: userId,
                        displayName: member?.clan_nick || member?.user?.display_name || memberDm?.display_name || memberDm?.username || '',
                        username: member?.user?.username || memberDm?.username || '',
                        avatar: member?.clan_avatar || member?.user?.avatar_url || memberDm?.avatar_url || ''
                    };
                    voterCache.set(userId, voter);
                    return voter;
                };

                voterDetails.forEach((detail) => {
                    if (typeof detail?.answer_index === 'number' && detail?.user_ids?.length > 0) {
                        mappedVotersByOption[detail.answer_index] = detail.user_ids.map(getCachedVoter);
                    }
                });
            }

            setDetailVotersByOption(mappedVotersByOption);
        } catch (error) {
            console.error('Failed to get poll detail:', error);
            setDetailVotersByOption({});
        } finally {
            setIsLoadingPollDetail(false);
        }
    }, [dispatch, message?.id, message?.channel_id, displayOptions]);

    const handleOptionPress = useCallback(
        (index: number) => {
            if (hasVoted || pollData?.is_closed || typeof index !== 'number') return;
            setSelection((prev) => {
                const wasSelected = prev.includes(index);
                return wasSelected
                    ? prev.filter((id) => id !== index)
                    : isMultiple
                        ? [...prev, index]
                        : [index];
            });
        },
        [hasVoted, pollData?.is_closed, isMultiple]
    );

    const handlePollAction = useCallback(async () => {
        if (pollData?.is_closed) {
            setShowResults(true);
            return;
        }
        if ((hasVoted || selection.length > 0) && message?.id && message?.channel_id) {
            try {
                const response = await dispatch(votePoll({
                    message_id: message.id,
                    channel_id: message.channel_id,
                    answer_indices: hasVoted ? [] : selection
                })).unwrap()
                const myVotes = response?.my_answer_indices
                if (myVotes) {
                    setHasVoted(myVotes.length > 0);
                    setSelection(myVotes);
                }
            } catch (error) {
                console.error('Failed to vote:', error);
            }
        } else {
            setShowResults(true);
        }
    }, [dispatch, hasVoted, selection, message?.id, message?.channel_id, pollData?.is_closed]);

    const handleLongPress = useCallback(() => {
        onLongPress && onLongPress();
    }, [onLongPress]);

    return (
        <Pressable onLongPress={handleLongPress} style={styles.container}>
            <View style={styles.card}>
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={[
                        themeValue.primary,
                        (themeValue?.primaryGradiant ?? themeBasic === ThemeModeBase.LIGHT)
                            ? themeValue.tertiary
                            : themeValue.secondaryLight
                    ]}
                    style={[StyleSheet.absoluteFill]}
                />
                <Text style={styles.question} numberOfLines={2}>{pollData?.question ?? ''}</Text>
                <Text style={styles.instruction}>
                    {isMultiple ? t('poll.selectOneOrMore') : t('poll.selectOne')}
                </Text>
                <View style={styles.optionsContainer}>
                    {visibleOptions.map((option) => (
                        <PollOptionRow
                            key={`poll_${pollData?.id}_${option?.index}`}
                            option={option}
                            shouldShowResults={shouldShowResults}
                            allowMultiple={isMultiple}
                            styles={styles}
                            onPress={() => handleOptionPress(option?.index)}
                            t={t}
                            hasVoted={hasVoted}
                            themeBasic={themeBasic}
                        />
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <Text style={styles.footerStats} onPress={handleOpenPollDetail}>
                            <Text style={styles.footerStatsLink}>
                                {`${pollData?.total_votes ?? 0} ${pollData?.total_votes > 1 ? t('poll.votes') : t('poll.vote')}`}
                            </Text>
                            {pollData?.is_closed ? ` • ${t('poll.ended')}` : ` • ${convertTimestampToTimeRemainingI18n(pollData?.expire_at ?? 0, tCommon)} ${t('poll.left')}`}
                        </Text>
                        {!pollData?.is_closed && (
                            <TouchableOpacity
                                onPress={showResults ? toggleShowResults : handlePollAction}
                                style={styles.voteBtn}
                            >
                                <Text style={styles.voteBtnText}>
                                    {showResults
                                        ? t('poll.backToVote')
                                        : shouldVote
                                            ? t('poll.voteButton')
                                            : hasVoted
                                                ? t('poll.removeVote')
                                                : t('poll.showResults')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {shouldShowToggleOptions && <Text style={styles.loadMoreText} onPress={toggleLoadMoreOptions}>
                        {isExpandedOptions
                            ? t('poll.showLess')
                            : hiddenCount === 1
                                ? t('poll.loadMore1Option')
                                : t('poll.loadMore', { count: hiddenCount })}
                    </Text>
                    }
                </View>
            </View>
            <PollDetailModal
                visible={isDetailModalOpen}
                onClose={closePollDetail}
                question={pollData?.question}
                totalVotes={pollData?.total_votes}
                options={displayOptions}
                selectedIndex={detailSelectedIndex}
                onSelectIndex={setDetailSelectedIndex}
                votersByOption={detailVotersByOption}
                loading={isLoadingPollDetail}
                themeValue={themeValue}
                t={t}
                height={dimentsions.height}
                isLandscape={isLandscape}
            />
        </Pressable>
    );
});