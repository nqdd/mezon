import React from 'react';

import { selectIsShowWelcomeMobile } from '@mezon/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import AppBrowser from '../../screens/auth/AppBrowser';
import LoginScreen from '../../screens/auth/Login';
import WelcomeScreen from '../../screens/auth/Login/WelcomeScreen';
import OTPVerificationScreen from '../../screens/auth/OTPVerification';
import { APP_SCREEN } from '../ScreenTypes';

const Stack = createNativeStackNavigator();

export const UnAuthentication = () => {
	useCheckUpdatedVersion();
	const isShowWelcome = useSelector(selectIsShowWelcomeMobile);

	return (
		<Stack.Navigator
			initialRouteName={isShowWelcome ? APP_SCREEN.WELCOME : APP_SCREEN.LOGIN}
			screenOptions={{ headerShown: false, gestureEnabled: Platform.OS === 'ios' }}
		>
			<Stack.Screen name={APP_SCREEN.WELCOME} component={WelcomeScreen} />
			<Stack.Screen name={APP_SCREEN.LOGIN} component={LoginScreen} />
			<Stack.Screen name={APP_SCREEN.VERIFY_OTP} component={OTPVerificationScreen} />
			<Stack.Screen name={APP_SCREEN.APP_BROWSER} component={AppBrowser} />
		</Stack.Navigator>
	);
};
