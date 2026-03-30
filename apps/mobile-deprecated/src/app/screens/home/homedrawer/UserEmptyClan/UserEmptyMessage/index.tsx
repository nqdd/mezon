import { size, useTheme } from '@mezon/mobile-ui';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './UserEmptyMessage.styles';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import EMPTY_BG from './bgEmpty.png';

const UserEmptyMessage = ({ onPress }: { onPress: () => void }) => {
	const { t } = useTranslation(['userEmptyClan']);
	const { themeValue } = useTheme();

	return (
		<View style={styles.wrapper}>
			<FastImage source={EMPTY_BG} style={styles.imageWrapper} resizeMode={FastImage.resizeMode.contain} />
			<View style={styles.contentContainer}>
				<Text style={[styles.title, { color: themeValue.text }]}>{t('emptyMessage.dMsWith')}</Text>
				<Text style={[styles.description, { color: themeValue.textDisabled }]}>{t('emptyMessage.inviteYourFriends')}</Text>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.addFriendsBtn}
					onPress={() => {
						onPress();
					}}
				>
					<Text style={styles.textAddFriends}>{t('emptyMessage.addFriend')}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default UserEmptyMessage;
