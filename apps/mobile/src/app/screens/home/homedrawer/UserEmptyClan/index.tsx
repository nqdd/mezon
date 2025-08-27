import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { RootState, selectAllClans } from '@mezon/store-mobile';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import Images from '../../../../../assets/Images';
import CreateClanModal from '../components/CreateClanModal';
import JoinClanModal from '../components/JoinClanModal';
import { styles } from './styles';

const UserEmptyClan = () => {
	const clans = useSelector(selectAllClans);
	const clansLoadingStatus = useSelector((state: RootState) => state?.clans?.loadingStatus);
	const [isVisibleJoinClanModal, setIsVisibleJoinClanModal] = useState<boolean>(false);
	const { t } = useTranslation('userEmptyClan');
	const [showClanEmpty, setShowClanEmpty] = useState(false);
	const { themeValue } = useTheme();

	useEffect(() => {
		const splashTask = setTimeout(() => {
			setShowClanEmpty(true);
		}, 1000);
		return () => clearTimeout(splashTask);
	}, []);

	const onCreateClanModal = useCallback(() => {
		const data = {
			children: <CreateClanModal />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	}, []);

	if (!showClanEmpty) return null;

	if (clansLoadingStatus === 'loaded' && !clans?.length) {
		return (
			<View style={styles.wrapper}>
				<LinearGradient
					start={{ x: 1, y: 0 }}
					end={{ x: 0, y: 0 }}
					colors={[themeValue.primary, themeValue?.primaryGradiant || themeValue.primary]}
					style={[StyleSheet.absoluteFillObject]}
				/>
				<Text style={[styles.headerText, { color: themeValue?.text }]}>{t('emptyClans.clans')}</Text>
				<Image style={styles.imageBg} source={Images.CHAT_PANA} />
				<View>
					<Text style={[styles.title, { color: themeValue?.text }]}>{t('emptyClans.readyChat')}</Text>
					<Text style={[styles.description, { color: themeValue?.textDisabled }]}>{t('emptyClans.buildYourCommunity')}</Text>
				</View>
				<View
					style={{
						marginTop: size.s_20
					}}
				>
					<TouchableOpacity onPress={() => setIsVisibleJoinClanModal(!isVisibleJoinClanModal)} style={styles.joinClan}>
						<Text style={[styles.textJoinClan, { color: baseColor.white }]}>{t('emptyClans.joinClan')}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onCreateClanModal} style={styles.createClan}>
						<Text style={[styles.textCreateClan, { color: themeValue?.text }]}>{t('emptyClans.createClan')}</Text>
					</TouchableOpacity>
				</View>
				<JoinClanModal visible={isVisibleJoinClanModal} setVisible={(value) => setIsVisibleJoinClanModal(value)} />
			</View>
		);
	}

	return null;
};

export default memo(UserEmptyClan);
