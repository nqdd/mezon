/* eslint-disable @nx/enforce-module-boundaries */
import { useTheme } from '@mezon/mobile-ui';
import { accountActions, useAppDispatch } from '@mezon/store-mobile';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonButton from '../../../../componentUI/MezonButton';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import MezonInput from '../../../../componentUI/MezonInput';
import { ErrorInput } from '../../../../components/ErrorInput';
import type { ICountry } from '../../../home/homedrawer/components/CountryDropdown';
import { CountryDropdown, countries } from '../../../home/homedrawer/components/CountryDropdown';
import { style } from './styles';

export const UpdatePhoneNumber = memo(({ navigation }: { navigation: any }) => {
	const { themeValue } = useTheme();
	const { t } = useTranslation('accountSetting');
	const styles = style(themeValue);
	const dispatch = useAppDispatch();

	const [selectedCountry, setSelectedCountry] = useState<ICountry>(countries[0]);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
	const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean | null>(null);

	const toggleShowCountryDropdown = () => {
		setIsShowDropdown(!isShowDropdown);
	};

	const checkValidPhoneNumber = useCallback(
		(phoneData: string, prefix: string = selectedCountry.prefix) => {
			if (phoneData.length === 0) return null;

			if (prefix === '+84') {
				const vietnamPhoneRegex = /^0?(3|5|7|8|9)[0-9]{8}$/;
				return vietnamPhoneRegex.test(phoneData);
			}

			if (phoneData.length < 7) return false;
			return /^\d+$/.test(phoneData);
		},
		[selectedCountry.prefix]
	);

	const handleCountrySelect = useCallback(
		(country: ICountry) => {
			setSelectedCountry(country);
			setIsShowDropdown(false);
			setIsValidPhoneNumber(checkValidPhoneNumber(phoneNumber, country.prefix));
		},
		[phoneNumber, checkValidPhoneNumber]
	);

	const handlePhoneNumberChange = useCallback(
		(value: string) => {
			setPhoneNumber(value);
			setIsValidPhoneNumber(checkValidPhoneNumber(value));
		},
		[checkValidPhoneNumber]
	);

	const handleAddPhoneNumber = useCallback(async () => {
		let processedPhoneNumber = phoneNumber;
		if (selectedCountry.prefix === '+84' && phoneNumber.startsWith('0')) {
			processedPhoneNumber = phoneNumber.substring(1);
		}
		const fullPhoneNumber = `${selectedCountry.prefix}${processedPhoneNumber}`;
		try {
			const response = await dispatch(accountActions.addPhoneNumber({ phone_number: fullPhoneNumber }));
			const requestId = response?.payload?.req_id;

			if (response?.meta?.requestStatus === 'fulfilled' && requestId) {
				navigation.navigate('ROUTES.SETTINGS.VERIFY_PHONE_NUMBER', {
					phoneNumber: fullPhoneNumber,
					requestId
				});
				setIsShowDropdown(false);
			} else {
				Toast.show({
					type: 'error',
					text1: t('phoneNumberSetting.updatePhoneNumber.failed')
				});
			}
		} catch (error) {
			console.error('Error add phone number: ', error);
		}
	}, [selectedCountry.prefix, phoneNumber, t]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.contentContainer}>
				<Text style={styles.label}>{t('phoneNumberSetting.updatePhoneNumber.newPhoneNumber')}</Text>

				<View style={styles.phoneContainer}>
					<TouchableOpacity style={styles.countryButton} onPress={toggleShowCountryDropdown}>
						<MezonIconCDN icon={selectedCountry.icon} useOriginalColor customStyle={styles.customStyleFlagIcon} />
						<Text style={styles.input}>{selectedCountry.prefix}</Text>
					</TouchableOpacity>

					<View style={{ flex: 1 }}>
						<MezonInput
							value={phoneNumber}
							onTextChange={handlePhoneNumberChange}
							inputStyle={styles.input}
							inputWrapperStyle={styles.inputWrapper}
							keyboardType="phone-pad"
						/>
					</View>
				</View>

				<View style={styles.errorContainer}>
					{isValidPhoneNumber === false && (
						<ErrorInput errorMessage={t('phoneNumberSetting.updatePhoneNumber.invalidPhoneNumber')} style={styles.errorInput} />
					)}
				</View>

				<CountryDropdown onCountrySelect={handleCountrySelect} isVisible={isShowDropdown} selectedCountry={selectedCountry} />
			</View>

			<MezonButton
				titleStyle={styles.buttonTitle}
				title={t('phoneNumberSetting.updatePhoneNumber.nextButton')}
				onPress={handleAddPhoneNumber}
				containerStyle={[styles.nextButton, isValidPhoneNumber ? styles.nextButtonActive : {}]}
				disabled={!isValidPhoneNumber}
			/>
		</SafeAreaView>
	);
});
