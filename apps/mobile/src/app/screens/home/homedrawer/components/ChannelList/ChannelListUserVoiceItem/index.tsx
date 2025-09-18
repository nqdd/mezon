import { size, useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId2, useAppSelector } from '@mezon/store-mobile';
import type { IChannelMember } from '@mezon/utils';
import { getAvatarForPrioritize, getNameForPrioritize } from '@mezon/utils';
import React from 'react';
import { Text, View } from 'react-native';
import MezonAvatar from '../../../../../../componentUI/MezonAvatar';
import { style } from './styles';

interface IUserVoiceProps {
	userVoice: IChannelMember;
	isCategoryExpanded: boolean;
	index: number;
	totalMembers: number;
}
const UserVoiceItem = React.memo(({ userVoice, isCategoryExpanded, index, totalMembers }: IUserVoiceProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const userStream = useAppSelector((state) => selectMemberClanByUserId2(state, userVoice?.user_id ?? ''));
	const name = getNameForPrioritize(userStream?.clan_nick, userStream?.user?.display_name, userStream?.user?.username);
	const avatar = getAvatarForPrioritize(userStream?.clan_avatar, userStream?.user?.avatar_url);

	if (!isCategoryExpanded) {
		if (index === 5) {
			return (
				<View
					style={{
						left: -size.s_4 * index,
						paddingHorizontal: size.s_2,
						minWidth: size.s_20,
						height: size.s_20,
						borderRadius: size.s_20,
						backgroundColor: themeValue.primary,
						borderWidth: 1,
						borderColor: themeValue.text,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text style={styles.titleNumberMem}>+{totalMembers - 5}</Text>
				</View>
			);
		}
		if (index < 5) {
			return (
				<View style={{ left: -size.s_4 * index }}>
					<MezonAvatar width={size.s_20} height={size.s_20} username={name || userVoice?.participant} avatarUrl={avatar} />
				</View>
			);
		} else {
			return null;
		}
	}
	return (
		<View style={styles.userVoiceWrapper}>
			<MezonAvatar width={size.s_18} height={size.s_18} username={name || userVoice?.participant} avatarUrl={avatar} />
			{!!isCategoryExpanded &&
				(userStream ? (
					<Text style={styles.userVoiceName}>{name}</Text>
				) : (
					<Text style={styles.userVoiceName}>{userVoice?.participant} (guest)</Text>
				))}
		</View>
	);
});

export default UserVoiceItem;
