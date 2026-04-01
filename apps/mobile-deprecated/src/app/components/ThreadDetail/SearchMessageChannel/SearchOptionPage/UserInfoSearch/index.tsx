import { useMemberStatus } from '@mezon/core';
import { IUserMention } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MezonAvatar from '../../../../../componentUI/MezonAvatar';
import { style } from '../SearchOptionPage.styles';

interface UserInfoSearchProps {
	onSelectUserInfo: (user: IUserMention) => void;
	userData: IUserMention;
}

export default function UserInfoSearch({ onSelectUserInfo, userData }: UserInfoSearchProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userStatus = useMemberStatus((userData?.id as string) || '');
	return (
		<TouchableOpacity onPress={() => onSelectUserInfo(userData)} style={styles.userInfoBox}>
			<MezonAvatar
				userStatus={userStatus}
				customStatus={userStatus?.status}
				height={size.s_40}
				width={size.s_40}
				username={userData?.display}
				avatarUrl={userData?.avatarUrl}
			/>
			<View>
				<Text style={styles.username}>{userData?.display}</Text>
				<Text style={styles.subUserName}>{userData?.subDisplay}</Text>
			</View>
		</TouchableOpacity>
	);
}
