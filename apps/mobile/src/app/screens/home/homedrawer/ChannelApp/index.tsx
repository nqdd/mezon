/* eslint-disable no-empty */
import { size, useTheme } from '@mezon/mobile-ui';
import { useAppSelector } from '@mezon/store';
import { channelAppActions, selectAppChannelById, useAppDispatch } from '@mezon/store-mobile';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Modal, Platform, Text, TouchableOpacity } from 'react-native';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import StatusBarHeight from '../../../../components/StatusBarHeight/StatusBarHeight';
import WebviewBase from '../../../../components/WebviewBase';
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

const ChannelAppScreen = ({ navigation, route }: { navigation: any; route: any }) => {
	const { themeValue } = useTheme();
	const dispatch = useAppDispatch();
	const paramsRoute = route?.params;
	const styles = style(themeValue);
	const [uri, setUri] = useState<string>('');
	const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Portrait');
	const appChannel = useAppSelector((state) => selectAppChannelById(state, paramsRoute?.channelId || ''));

	const getUrlChannelApp = useCallback(async () => {
		if (appChannel.app_id && appChannel.app_url) {
			const hashData = await dispatch(
				channelAppActions.generateAppUserHash({
					appId: appChannel.app_id
				})
			).unwrap();
			if (hashData.web_app_data) {
				const encodedHash = encodeURIComponent(hashData.web_app_data);
				const urlWithHash = `${appChannel.app_url}?data=${encodedHash}`;
				setUri(urlWithHash);
			}
		}
	}, [appChannel?.app_id, appChannel?.app_url, dispatch]);

	useEffect(() => {
		const handleOrientationChange = () => {
			const { width, height } = Dimensions.get('window');
			setOrientation(width > height ? 'Landscape' : 'Portrait');
		};
		const subscription = Platform.OS === 'ios' ? Dimensions.addEventListener('change', handleOrientationChange) : null;

		if (Platform.OS === 'ios') {
			handleOrientationChange();
		}

		return () => {
			subscription?.remove();
		};
	}, []);

	useEffect(() => {
		getUrlChannelApp();
	}, [getUrlChannelApp]);

	const onClose = () => {
		navigation.goBack();
	};

	return (
		<Modal style={styles.container} visible={true} supportedOrientations={['portrait', 'landscape']}>
			{orientation === 'Portrait' && Platform.OS === 'ios' && <StatusBarHeight />}
			<TouchableOpacity onPress={onClose} style={styles.backButton}>
				<MezonIconCDN icon={IconCDN.closeSmallBold} height={size.s_16} width={size.s_16} />
				<Text style={styles.buttonText}>Close</Text>
			</TouchableOpacity>
			<WebviewBase url={uri} incognito={true} style={styles.container} javaScriptEnabled={true} nestedScrollEnabled={true} onGoBack={onClose} />
		</Modal>
	);
};

export default ChannelAppScreen;
