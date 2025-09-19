import { useTheme } from '@mezon/mobile-ui';
import { selectMemberClanByUserId, useAppSelector } from '@mezon/store-mobile';
import MezonClanAvatar from 'apps/mobile/src/app/componentUI/MezonClanAvatar';
import React from 'react';
import { View } from 'react-native';
import { style } from './JoinChannelVoiceBS.styles';

const VoiceChannelAvatar = ({ userId }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const member = useAppSelector((state) => selectMemberClanByUserId(state, userId));

	return (
		<View style={styles.avatarCircle}>
			<MezonClanAvatar alt={member?.user?.username} image={member?.clan_avatar || member?.user?.avatar_url} lightMode />
		</View>
	);
};

export default React.memo(VoiceChannelAvatar);
