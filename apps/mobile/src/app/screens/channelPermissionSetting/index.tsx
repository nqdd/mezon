import { size, useTheme } from '@mezon/mobile-ui';
import { selectChannelById, useAppSelector } from '@mezon/store-mobile';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import type { APP_SCREEN, MenuChannelScreenProps } from '../../navigation/ScreenTypes';
import { AdvancedView } from './AdvancedView';
import { BasicView } from './BasicView';
import { styles as getStyles } from './index.styles';
import { EPermissionSetting } from './types/channelPermission.enum';

type ChannelPermissionSetting = typeof APP_SCREEN.MENU_CHANNEL.CHANNEL_PERMISSION;
export const ChannelPermissionSetting = ({ navigation, route }: MenuChannelScreenProps<ChannelPermissionSetting>) => {
	const { channelId } = route.params;
	const currentChannel = useAppSelector((state) => selectChannelById(state, channelId || ''));
	const { themeValue } = useTheme();
	const style = getStyles(themeValue);
	const { t } = useTranslation('channelSetting');
	const [currentTab, setCurrentTab] = useState<EPermissionSetting>(EPermissionSetting.BasicView);
	const [isAdvancedEditMode, setIsAdvancedEditMode] = useState(false);

	const onTabChange = (tab: EPermissionSetting) => {
		if (tab === EPermissionSetting.BasicView) {
			setIsAdvancedEditMode(false);
		}
		setCurrentTab(tab);
	};

	const permissionSettingTabs = useMemo(() => {
		return [
			{
				title: t('channelPermission.basicView'),
				type: EPermissionSetting.BasicView
			},
			{
				title: t('channelPermission.advancedView'),
				type: EPermissionSetting.AdvancedView
			}
		];
	}, [t]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
			headerTitle: () => (
				<View>
					<Text style={style.headerTitle}>{t('channelPermission.title')}</Text>
				</View>
			),
			headerRight: () => {
				if (currentTab === EPermissionSetting.BasicView) return null;

				if (isAdvancedEditMode) {
					return (
						<TouchableOpacity onPress={() => setIsAdvancedEditMode(false)}>
							<View style={style.headerRightContainer}>
								<Text style={style.headerRightText}>{t('channelPermission.done')}</Text>
							</View>
						</TouchableOpacity>
					);
				}
				//TODO: update later
				// return (
				// 	<TouchableOpacity onPress={() => setIsAdvancedEditMode(true)}>
				// 		<Block marginRight={size.s_20}>
				// 			<Text h4 color={themeValue.white}>
				// 				{t('channelPermission.edit')}
				// 			</Text>
				// 		</Block>
				// 	</TouchableOpacity>
				// );
			},
			headerLeft: () => {
				return (
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<View style={style.headerLeftContainer}>
							<MezonIconCDN icon={IconCDN.arrowLargeLeftIcon} color={themeValue.white} height={size.s_22} width={size.s_22} />
						</View>
					</TouchableOpacity>
				);
			}
		});
	}, [currentTab, isAdvancedEditMode, navigation, t, themeValue.white, style]);

	return (
		<View style={style.container}>
			<View style={style.tabsContainer}>
				{permissionSettingTabs.map((tab) => {
					const isActive = currentTab === tab.type;
					return (
						<Pressable
							key={tab.type}
							onPress={() => onTabChange(tab.type)}
							style={[style.tabButton, isActive ? style.tabButtonActive : style.tabButtonInactive]}
						>
							<Text style={[style.tabText, isActive ? style.tabTextActive : style.tabTextInactive]}>{tab.title}</Text>
						</Pressable>
					);
				})}
			</View>

			{currentTab === EPermissionSetting.BasicView ? (
				<BasicView channel={currentChannel} />
			) : (
				<AdvancedView channel={currentChannel} isAdvancedEditMode={isAdvancedEditMode} />
			)}
		</View>
	);
};
