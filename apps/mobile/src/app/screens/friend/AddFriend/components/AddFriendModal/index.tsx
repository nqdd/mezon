import { useFriends } from '@mezon/core';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import type { RootState, requestAddFriendParam } from '@mezon/store-mobile';
import { EStateFriend, friendsActions, getStore, selectCurrentUsername, selectStatusSentMobile } from '@mezon/store-mobile';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StatusBar, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import MezonButton from '../../../../../componentUI/MezonButton';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { MezonModal } from '../../../../../componentUI/MezonModal';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';
interface IAddFriendModal {
	isShow: boolean;
	onClose: () => void;
}

export const AddFriendModal = React.memo((props: IAddFriendModal) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { isShow, onClose } = props;
	const currentUsername = useSelector(selectCurrentUsername);
	const { addFriend, friends } = useFriends();
	const dispatch = useDispatch();
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [requestAddFriend, setRequestAddFriend] = useState<requestAddFriendParam>({
		usernames: [],
		ids: []
	});
	const { t } = useTranslation(['friends', 'friendsPage']);
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		setVisibleModal(isShow);
		const timeoutId = setTimeout(() => {
			if (inputRef?.current) {
				inputRef.current.focus();
			}
		}, 300);

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				resetField();
			}
		};
	}, [isShow]);

	const handleTextChange = (text: string) => {
		if ((text || '')?.trim()?.length) {
			setRequestAddFriend({ ...requestAddFriend, usernames: [text] });
		} else {
			setRequestAddFriend({ ...requestAddFriend, usernames: [] });
		}
	};

	const firstUsername = useMemo(
		() => (Array.isArray(requestAddFriend.usernames) && requestAddFriend.usernames.length > 0 ? requestAddFriend.usernames[0] : ''),
		[requestAddFriend.usernames]
	);

	const onVisibleChange = (visible: boolean) => {
		if (!visible) {
			onClose();
		}
	};

	const resetField = () => {
		setRequestAddFriend({
			usernames: [],
			ids: []
		});
	};

	const sentFriendRequest = async () => {
		const firstUsername = Array.isArray(requestAddFriend.usernames) && requestAddFriend.usernames.length > 0 ? requestAddFriend.usernames[0] : '';
		if (!(firstUsername || '')?.trim()?.length) return null;
		if (inputRef?.current) {
			inputRef.current.blur();
		}

		const friend = friends?.find((u) => u?.user?.username === firstUsername);

		if (friend?.user?.username === currentUsername) {
			Toast.show({
				type: 'error',
				text1: t('toast.sendAddFriendFail')
			});
			return;
		}
		if (friend?.state === EStateFriend.FRIEND) {
			Toast.show({
				type: 'error',
				text1: t('friendsPage:addFriendModal.alreadyFriends')
			});
			return;
		}
		if (friend?.state === EStateFriend.OTHER_PENDING) {
			Toast.show({
				type: 'error',
				text1: t('friendsPage:addFriendModal.waitAccept')
			});
			return;
		}

		await addFriend(requestAddFriend);
		showAddFriendToast();
	};

	const showAddFriendToast = useCallback(() => {
		const store = getStore();
		const statusSentMobile = selectStatusSentMobile(store.getState() as RootState);
		if (statusSentMobile?.isSuccess) {
			Toast.show({
				type: 'success',
				props: {
					text2: t('toast.sendAddFriendSuccess'),
					leadingIcon: <MezonIconCDN icon={IconCDN.checkmarkSmallIcon} color={baseColor.green} width={20} height={20} />
				}
			});
			resetField();
		} else {
			Toast.show({
				type: 'error',
				props: {
					text2: t('toast.sendAddFriendFail'),
					leadingIcon: <MezonIconCDN icon={IconCDN.closeIcon} color={baseColor.redStrong} width={20} height={20} />
				}
			});
		}
		dispatch(friendsActions.setSentStatusMobile(null));
	}, []);

	return (
		<MezonModal
			visible={visibleModal}
			title={t('addFriend.addByUserName')}
			visibleChange={onVisibleChange}
			containerStyle={{ paddingHorizontal: 0 }}
		>
			<View style={styles.addFriendModalContainer}>
				<KeyboardAvoidingView
					behavior={'padding'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 5}
					style={styles.fill}
				>
					<View style={[styles.fill, styles.paddingVertical20]}>
						<View style={styles.fill}>
							<Text style={styles.defaultText}>{t('addFriend.whoYouWantToAddFriend')}</Text>
							<View style={styles.searchUsernameWrapper}>
								<TextInput
									ref={inputRef}
									value={firstUsername}
									placeholder={t('addFriend.searchUsernamePlaceholder')}
									placeholderTextColor={themeValue.textDisabled}
									style={styles.searchInput}
									onChangeText={handleTextChange}
									autoCapitalize="none"
								/>
							</View>
							<View style={styles.byTheWayText}>
								<Text style={styles.defaultText}>{`${t('addFriend.byTheWay')} ${currentUsername}`}</Text>
							</View>
						</View>
						<View style={[styles.buttonWrapper]}>
							<View style={styles.heightAuto}>
								<MezonButton
									disabled={!firstUsername?.length}
									onPress={() => sentFriendRequest()}
									containerStyle={[styles.sendButton, !firstUsername?.length && { backgroundColor: themeValue.textDisabled }]}
									title={t('addFriend.sendRequestButton')}
									titleStyle={styles.buttonTitleStyle}
								/>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</MezonModal>
	);
});
