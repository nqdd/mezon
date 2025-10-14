import { ActionEmitEvent, STORAGE_SESSION_KEY, load } from '@mezon/mobile-components';
import { authActions, selectHasInternetMobile, selectIsLogin, useAppDispatch } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import type { IWithError } from '@mezon/utils';
import { sleep } from '@mezon/utils';
import { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { useSelector } from 'react-redux';

const MAX_RETRIES_SESSION = 5;
const RefreshSessionWrapper = ({ children }) => {
	const isLoggedIn = useSelector(selectIsLogin);
	const dispatch = useAppDispatch();
	const hasInternet = useSelector(selectHasInternetMobile);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const { clientRef } = useMezon();

	const getSessionCacheKey = async () => {
		const defaultConfig = {
			host: process.env.NX_CHAT_APP_API_HOST as string,
			port: process.env.NX_CHAT_APP_API_PORT as string
		};

		try {
			const storedConfig = await load(STORAGE_SESSION_KEY);
			if (!storedConfig) return defaultConfig;

			const parsedConfig = JSON.parse(storedConfig);
			const isCustomHost = parsedConfig.host && parsedConfig.port && parsedConfig.host !== process.env.NX_CHAT_APP_API_GW_HOST;

			if (isCustomHost) {
				return parsedConfig;
			}

			return defaultConfig;
		} catch (e) {
			return defaultConfig;
		}
	};

	const refreshSessionLoader = useCallback(async () => {
		const configSession = await getSessionCacheKey();
		if (configSession && clientRef?.current) {
			clientRef.current.setBasePath(configSession.host as string, configSession.port as string, process.env.NX_CHAT_APP_API_SECURE === 'true');
		}

		let retries = MAX_RETRIES_SESSION;
		while (retries > 0) {
			try {
				const response = await dispatch(authActions.refreshSession());
				if ((response as unknown as IWithError).error) {
					retries -= 1;
					setIsInitialized(true);
					if (retries === 0) {
						await sleep(500);
						DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_POPUP_SESSION_EXPIRED);
						return;
					}
					await sleep(1000 * (MAX_RETRIES_SESSION - retries));
					continue;
				}
				await sleep(200);
				setIsInitialized(true);
				break;
			} catch (error) {
				retries -= 1;
				setIsInitialized(true);
				if (retries === 0) {
					await sleep(500);
					DeviceEventEmitter.emit(ActionEmitEvent.ON_SHOW_POPUP_SESSION_EXPIRED);
					return;
				}
				await sleep(1000 * (MAX_RETRIES_SESSION - retries));
			}
		}
	}, [clientRef, dispatch]);

	useEffect(() => {
		if (isLoggedIn && hasInternet) {
			refreshSessionLoader();
		} else {
			setIsInitialized(true);
		}
	}, [isLoggedIn, hasInternet]);

	if (!isInitialized) {
		return <View />;
	}
	return <View style={{ flex: 1 }}>{children}</View>;
};

export default RefreshSessionWrapper;
