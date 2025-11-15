import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Linking, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import useTabletLandscape from '../../hooks/useTabletLandscape';
import { styles, dynamicStyles } from './UpdateGateScreen.styles';

const UpdateGateScreen = ({ route }) => {
	const { t } = useTranslation(['setting']);
	const storeUrl = route?.params?.storeUrl;
	const isTabletLandscape = useTabletLandscape();

	useFocusEffect(() => {
		const backAction = () => true;
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	});

	const onPress = () => Linking.openURL(storeUrl);

	return (
		<View style={styles.container}>
			<View />
			<View style={styles.imageContainer}>
				<FastImage
					source={require('../../../assets/images/bgRocket.png')}
					style={styles.rocketImage}
					resizeMode={'cover'}
				/>
				<View>
					<Text style={styles.title}>{t('updateGate.outOfDateVersion')}</Text>
					<Text style={styles.subTitle}>{t('updateGate.updateExperience')}</Text>
				</View>
			</View>
			<TouchableOpacity onPress={onPress}>
				<View style={dynamicStyles.updateButton(isTabletLandscape)}>
					<Text style={styles.titleBtn}>{t('updateGate.updateNow')}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default UpdateGateScreen;
