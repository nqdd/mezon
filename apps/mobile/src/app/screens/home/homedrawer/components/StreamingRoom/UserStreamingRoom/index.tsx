import { useTheme } from '@mezon/mobile-ui';
import type { UsersStreamEntity } from '@mezon/store-mobile';
import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import UserItem from './UserItem';
import { style } from './UserStreamingRoom.styles';
const MAX_VISIBLE_USERS = 5;
function UserStreamingRoom({ streamChannelMember }: { streamChannelMember: UsersStreamEntity[] }) {
	const { themeValue } = useTheme();
	const isMoreThanMax = streamChannelMember?.length > MAX_VISIBLE_USERS;
	const styles = useMemo(() => style(themeValue, isMoreThanMax), [themeValue, isMoreThanMax]);
	const remainingCount = streamChannelMember?.length - MAX_VISIBLE_USERS;
	const visibleUsers = streamChannelMember?.slice(0, MAX_VISIBLE_USERS);

	return (
		<View style={styles.gridContainer}>
			{visibleUsers?.length > 0 &&
				visibleUsers.map((user, index) => (
					<View style={[styles.userItem, styles.userItemDynamic]} key={index}>
						<UserItem user={user} />
					</View>
				))}

			{remainingCount > 0 && (
				<View style={styles.remainingCount}>
					<Text style={styles.textBold}>+{remainingCount}</Text>
				</View>
			)}
		</View>
	);
}

export default memo(UserStreamingRoom);
