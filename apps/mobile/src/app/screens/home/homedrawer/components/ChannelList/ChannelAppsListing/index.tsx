import { size, useTheme } from '@mezon/mobile-ui';
import { selectAppChannelsList } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import type { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { memo, useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { APP_SCREEN } from '../../../../../../navigation/ScreenTypes';
import ItemChannelAppListing from './ItemChannelAppListing';
import { style } from './styles';

const ChannelAppsListing = () => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [categoryExpandState, setCategoryExpandState] = useState<boolean>(true);
	const allChannelApp = useSelector(selectAppChannelsList);
	const navigation = useNavigation<any>();

	const openChannelApp = useCallback(
		async (channel: ApiChannelAppResponse) => {
			navigation.navigate(APP_SCREEN.CHANNEL_APP, {
				channelId: channel.channel_id,
				clanId: channel.clan_id
			});
		},
		[navigation]
	);

	const handleOpenAll = useCallback(() => {
		navigation.navigate(APP_SCREEN.CHANNEL_APP_SHOW_ALL);
	}, [navigation]);

	const renderItem = useCallback(
		({ item }: { item: ApiChannelAppResponse }) => {
			return <ItemChannelAppListing item={item} openChannelApp={openChannelApp} />;
		},
		[openChannelApp]
	);

	const toggleCollapse = useCallback(() => {
		setCategoryExpandState((prevState) => !prevState);
	}, []);

	if (!allChannelApp || allChannelApp.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<LinearGradient
				start={{ x: 1, y: 0 }}
				end={{ x: 0, y: 0 }}
				colors={[themeValue.secondary, themeValue?.primaryGradiant || themeValue.secondary]}
				style={[StyleSheet.absoluteFillObject]}
			/>
			<TouchableOpacity activeOpacity={0.8} onPress={() => toggleCollapse()} style={styles.channelListHeader}>
				<View style={styles.channelListHeaderItem}>
					<MezonIconCDN
						icon={IconCDN.chevronDownSmallIcon}
						height={size.s_18}
						width={size.s_18}
						color={themeValue.text}
						customStyle={[!categoryExpandState && { transform: [{ rotate: '-90deg' }] }]}
					/>
					<Text style={styles.channelListHeaderItemTitle} numberOfLines={1}>
						CHANNEL APPS
					</Text>
				</View>
				<TouchableOpacity style={styles.btnSeeAll} onPress={handleOpenAll}>
					<Text style={styles.openAllText}>See all</Text>
				</TouchableOpacity>
			</TouchableOpacity>
			{categoryExpandState && (
				<FlatList
					data={allChannelApp?.slice(0, 10)}
					renderItem={renderItem}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					keyExtractor={(item) => item.channel_id}
				/>
			)}
		</View>
	);
};

export default memo(ChannelAppsListing);
