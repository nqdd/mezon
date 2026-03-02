import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { selectHiddenBottomTabMobile, useAppSelector } from '@mezon/store-mobile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { Icons } from '../../componentUI/MobileIcons';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import Notifications from '../../screens/Notifications';
import HomeScreenTablet from '../../screens/home/HomeScreenTablet';
import MessagesScreen from '../../screens/messages/MessagesScreen';
import MessagesScreenTablet from '../../screens/messages/MessagesScreenTablet';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import { APP_SCREEN } from '../ScreenTypes';
import { styles } from './styles';

const TabStack = createBottomTabNavigator();

const BottomNavigator = memo(({ isLastActiveTabDm = false }: { isLastActiveTabDm: boolean }) => {
	const isTabletLandscape = useTabletLandscape();
	const isHiddenTab = useAppSelector(selectHiddenBottomTabMobile);
	const { themeValue } = useTheme();
	const { t } = useTranslation(['screen']);

	return (
		<TabStack.Navigator
			screenOptions={{
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					position: 'absolute',
					zIndex: isTabletLandscape ? -1 : 100,
					height: isTabletLandscape ? 0 : size.s_80 - (isHiddenTab && Platform.OS === 'android' ? size.s_20 : size.s_2),
					paddingHorizontal: 0,
					paddingBottom: isHiddenTab && Platform.OS === 'android' ? size.s_2 : size.s_20,
					paddingTop: size.s_2,
					borderTopWidth: 1,
					elevation: 0,
					backgroundColor: themeValue.primary,
					borderTopColor: themeValue.border
				},
				tabBarShowLabel: false,
				tabBarActiveTintColor: baseColor.white,
				tabBarInactiveTintColor: themeValue.textDisabled
			}}
			initialRouteName={isLastActiveTabDm ? APP_SCREEN.MESSAGES.HOME : APP_SCREEN.HOME}
		>
			<TabStack.Screen
				name={APP_SCREEN.HOME}
				component={HomeScreenTablet}
				options={{
					headerShown: false,
					title: 'Clans',
					tabBarIcon: ({ color, focused }) => (
						<View style={[styles.tabBarIconContainer, { backgroundColor: focused ? '#717aef' : 'transparent' }]}>
							{focused ? (
								<Icons.ChannelSelectIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							) : (
								<Icons.ClansIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							)}
							<Text style={[{ color }, styles.tabBarText]}>{'Clans'}</Text>
						</View>
					)
				}}
			/>
			<TabStack.Screen
				name={APP_SCREEN.MESSAGES.HOME}
				component={isTabletLandscape ? MessagesScreenTablet : MessagesScreen}
				options={{
					headerShown: false,
					title: t('navigationTabs.messages'),
					tabBarIcon: ({ color, focused }) => (
						<View style={[styles.tabBarIconContainer, { backgroundColor: focused ? '#717aef' : 'transparent' }]}>
							{focused ? (
								<Icons.MassagesSelectIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							) : (
								<Icons.MessagesIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							)}
							<Text style={[{ color }, styles.tabBarText]}>{t('navigationTabs.messages')}</Text>
						</View>
					)
				}}
			/>
			<TabStack.Screen
				name={APP_SCREEN.NOTIFICATION.HOME}
				component={Notifications}
				options={{
					headerShown: false,
					title: t('navigationTabs.notifications'),
					tabBarIcon: ({ color, focused }) => (
						<View style={[styles.tabBarIconContainer, { backgroundColor: focused ? '#717aef' : 'transparent' }]}>
							{focused ? (
								<Icons.NoitificationSelectedIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							) : (
								<Icons.NoitificationIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							)}
							<Text style={[{ color }, styles.tabBarText]}>{t('navigationTabs.notifications')}</Text>
						</View>
					)
				}}
			/>
			<TabStack.Screen
				name={APP_SCREEN.PROFILE.HOME}
				component={ProfileScreen}
				options={{
					headerShown: false,
					title: t('navigationTabs.profile'),
					tabBarIcon: ({ color, focused }) => (
						<View style={[styles.tabBarIconContainer, { backgroundColor: focused ? '#717aef' : 'transparent' }]}>
							{focused ? (
								<Icons.ProfileSelectedIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							) : (
								<Icons.ProfileIcon color={baseColor.white} width={size.s_24} height={size.s_24} />
							)}
							<Text style={[{ color }, styles.tabBarText]}>{t('navigationTabs.profile')}</Text>
						</View>
					)
				}}
			/>
		</TabStack.Navigator>
	);
});

export default BottomNavigator;
