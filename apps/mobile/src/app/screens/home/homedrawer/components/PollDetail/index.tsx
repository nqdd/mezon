import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import type { TFunction } from 'i18next';
import { memo, useMemo } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PollEmoji } from '../PollEmoji';
import { style } from './styles';
import MezonClanAvatar from '../../../../../../app/componentUI/MezonClanAvatar';
import MezonIconCDN from '../../../../../../app/componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../app/constants/icon_cdn';

export interface IPollVoter {
    id: string;
    displayName: string;
    username: string;
    avatar: string;
}

export interface IPollDetailOption {
    index: number;
    label: string;
    voteCount: number;
}

interface IPollDetailModalProps {
    visible: boolean;
    onClose: () => void;
    question: string;
    totalVotes: number;
    options: IPollDetailOption[];
    selectedIndex: number;
    onSelectIndex: (index: number) => void;
    votersByOption: Record<number, IPollVoter[]>;
    loading: boolean;
    themeValue: Attributes;
    t: TFunction;
    height: number;
    isLandscape: boolean;
}

const MAX_VISIBLE_OPTIONS = 5;
const OPTION_ROW_HEIGHT = size.s_40;
const OPTION_GAP = size.s_8;
const LEFT_COLUMN_VERTICAL_PADDING = size.s_24;
const MIN_MODAL_BODY_HEIGHT_FALLBACK = size.s_200;
const MODAL_SCREEN_PADDING = size.s_100;
const MODAL_NON_BODY_HEIGHT = size.s_100 + size.s_20;
const MIN_MODAL_BODY_HEIGHT =
    OPTION_ROW_HEIGHT * MAX_VISIBLE_OPTIONS +
    OPTION_GAP * (MAX_VISIBLE_OPTIONS - 1) +
    LEFT_COLUMN_VERTICAL_PADDING;

export const PollDetailModal = memo(
    ({ visible, onClose, question, totalVotes, options, selectedIndex, onSelectIndex, votersByOption, loading, themeValue, t, height, isLandscape }: IPollDetailModalProps) => {
        const styles = useMemo(() => style(themeValue), [themeValue]);
        const selectedVoters = votersByOption[selectedIndex] ?? [];
        const visibleOptionCount = Math.min(options.length, MAX_VISIBLE_OPTIONS);
        const optionsHeight = visibleOptionCount * OPTION_ROW_HEIGHT + Math.max(visibleOptionCount - 1, 0) * OPTION_GAP + LEFT_COLUMN_VERTICAL_PADDING;
        const modalMaxHeight = Math.max(height - MODAL_SCREEN_PADDING, MIN_MODAL_BODY_HEIGHT_FALLBACK);
        const maxBodyHeight = Math.max(modalMaxHeight - MODAL_NON_BODY_HEIGHT, MIN_MODAL_BODY_HEIGHT_FALLBACK);
        const idealBodyHeight = Math.max(MIN_MODAL_BODY_HEIGHT, optionsHeight);
        const modalBodyHeight = Math.min(idealBodyHeight, maxBodyHeight);
    
        return (
            <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
                <Pressable style={styles.modalOverlay} onPress={onClose}>
                    <Pressable style={[styles.modalContainer, isLandscape && styles.modalContainerLandscape]} onPress={() => undefined}>
                        <View style={styles.modalHeader}>
                            <Text numberOfLines={2} style={styles.modalTitle}>{question ?? ''}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <MezonIconCDN icon={IconCDN.closeLargeIcon} color={themeValue.textStrong} width={size.s_16} height={size.s_16} />
                            </TouchableOpacity>
                        </View>
                        {typeof totalVotes === 'number' &&
                            (<Text style={styles.modalSubtitle}>
                                {`${totalVotes} ${totalVotes > 1 ? t('poll.votes') : t('poll.vote')}`}
                            </Text>)
                        }
                        <View style={[styles.modalBody, { height: modalBodyHeight }]}>
                            <View style={styles.modalLeftColumn}>
                                <ScrollView
                                    style={styles.modalColumnScroll}
                                    showsVerticalScrollIndicator={options.length > MAX_VISIBLE_OPTIONS}
                                    contentContainerStyle={styles.modalLeftColumnContent}
                                >
                                    {options.map((option) => (
                                        <TouchableOpacity
                                            key={`poll_modal_option_${option?.index}`}
                                            style={[styles.modalOptionItem, selectedIndex === option?.index && styles.modalOptionItemActive]}
                                            onPress={() => onSelectIndex(option?.index)}
                                        >
                                            <PollEmoji text={option?.label ?? ''} textStyle={styles.modalOptionText} />
                                            {typeof option?.voteCount === 'number' && <Text style={styles.modalOptionCount}>{option.voteCount}</Text>}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.modalRightColumn}>
                                {loading ? (
                                    <View style={styles.modalLoadingContainer}>
                                          <ActivityIndicator color={themeValue.textStrong} />
                                    </View>
                                ) : selectedVoters.length > 0 ? (
                                    <ScrollView style={styles.modalColumnScroll} showsVerticalScrollIndicator>
                                        {selectedVoters.map((voter) => (
                                            <View key={`poll_voter_${voter.id}`} style={styles.modalVoterItem}>
                                                <View style={styles.avatarWrapper}>
                                                    <MezonClanAvatar
                                                        image={voter.avatar}
                                                        alt={voter.username}
                                                    />
                                                </View>
                                                <View style={styles.modalVoterInfo}>
                                                    <Text numberOfLines={1} style={styles.modalVoterDisplayName}>{voter.displayName}</Text>
                                                    <Text numberOfLines={1} style={styles.modalVoterUsername}>{voter.username}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <View style={styles.modalEmptyTextContainer}>
                                        <Text style={styles.modalEmptyText}>{t('poll.noVotesYet')}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        );
    }
);
