import { useFriends } from '@mezon/core';
import { useTheme } from '@mezon/mobile-ui';
import { FriendsEntity } from '@mezon/store-mobile';
import { User } from 'mezon-js';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SeparatorWithLine } from '../../../components/Common';
import { EFriendItemAction, FriendItem } from '../../../components/FriendItem';
import { UserInformationBottomSheet } from '../../../components/UserInformationBottomSheet';
import { EFriendRequest } from '../RequestFriend';
import { EmptyFriendRequest } from '../RequestFriend/EmptyFriendRequest';
import { AddFriendModal } from './components/AddFriendModal';
import { style } from './styles';

export const AddFriendScreen = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { friends, acceptFriend, deleteFriend } = useFriends();
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const { t } = useTranslation('friends');
	const [currentAddFriendShow, setCurrentAddFriendShow] = useState<boolean>(false);
	const receivedFriendRequestList = useMemo(() => {
		return friends.filter((friend) => friend.state === 2);
	}, [friends]);

	const handleFriendAction = useCallback(
		(friend: FriendsEntity, action: EFriendItemAction) => {
			switch (action) {
				case EFriendItemAction.Delete:
					deleteFriend(friend?.user?.username, friend?.user?.id);
					break;
				case EFriendItemAction.Approve:
					acceptFriend(friend?.user?.username, friend?.user?.id);
					break;
				case EFriendItemAction.ShowInformation:
					setSelectedUser(friend?.user);
					break;
				default:
					break;
			}
		},
		[acceptFriend, deleteFriend]
	);

	const onClose = useCallback(() => {
		setSelectedUser(null);
	}, []);

	const renderEmptyFriendRequest = useCallback(() => {
		return <EmptyFriendRequest type={EFriendRequest.Received} />;
	}, []);

	return (
		<View style={styles.addFriendContainer}>
			<View style={styles.groupWrapper}>
				<TouchableOpacity onPress={() => setCurrentAddFriendShow(true)} style={styles.addFriendItem}>
					<Text style={styles.addFriendText}>{t('addFriend.addByUserName')}</Text>
				</TouchableOpacity>
			</View>
			{receivedFriendRequestList?.length > 0 && <Text style={styles.whiteText}>{t('addFriend.incomingFriendRequest')}</Text>}
			<FlatList
				style={{ flex: 1 }}
				data={receivedFriendRequestList}
				ItemSeparatorComponent={SeparatorWithLine}
				keyExtractor={(friend) => friend.id.toString()}
				renderItem={({ item }) => <FriendItem friend={item} handleFriendAction={handleFriendAction} />}
				initialNumToRender={1}
				maxToRenderPerBatch={1}
				windowSize={2}
				ListEmptyComponent={renderEmptyFriendRequest}
			/>

			<AddFriendModal isShow={currentAddFriendShow} onClose={() => setCurrentAddFriendShow(false)} />
			<UserInformationBottomSheet user={selectedUser} onClose={onClose} showAction={false} showRole={false} />
		</View>
	);
};
