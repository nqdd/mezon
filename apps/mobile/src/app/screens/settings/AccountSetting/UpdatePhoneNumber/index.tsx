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
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

type CountryCode = 'VN' | 'JP' | 'US';

interface ICountry {
	code: CountryCode;
	prefix: string;
	name: string;
	icon: IconCDN;
}

const countries: ICountry[] = [
	{ code: 'VN', prefix: '+84', name: 'Vietnam', icon: IconCDN.vietnamFlagIcon },
	{ code: 'JP', prefix: '+81', name: 'Japan', icon: IconCDN.japanFlagIcon },
	{ code: 'US', prefix: '+1', name: 'USA', icon: IconCDN.usaFlagIcon }
];

export const UpdatePhoneNumber = memo(({ navigation }: { navigation: any }) => {
	const { themeValue } = useTheme();
	const { t } = useTranslation('accountSetting');
	const styles = style(themeValue);
	const dispatch = useAppDispatch();

	const [selectedCountry, setSelectedCountry] = useState<ICountry>(countries[0]);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
	const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean | null>(null);

	const resetState = () => {
		setIsShowDropdown(false);
	};

	const handleCountrySelect = (country: ICountry) => {
		setSelectedCountry(country);
		setIsShowDropdown(false);
	};

	const toggleShowCountryDropdown = () => {
		setIsShowDropdown(!isShowDropdown);
	};

	const checkValidPhoneNumber = useCallback((phoneNum: string) => {
		if (phoneNum.length === 0) return null;
		if (phoneNum.length < 7) return false;
		return /^\d+$/.test(phoneNum);
	}, []);

	const handlePhoneNumberChange = useCallback(
		(value: string) => {
			setPhoneNumber(value);
			setIsValidPhoneNumber(checkValidPhoneNumber(value));
		},
		[checkValidPhoneNumber]
	);

	const handleAddPhoneNumber = useCallback(async () => {
		const fullPhoneNumber = `${selectedCountry.prefix}${phoneNumber}`;
		try {
			const response = await dispatch(accountActions.addPhoneNumber({ phone_number: fullPhoneNumber }));
			const requestId = response?.payload?.req_id;

			if (response?.meta?.requestStatus === 'fulfilled' && requestId) {
				navigation.navigate('ROUTES.SETTINGS.VERIFY_PHONE_NUMBER', {
					phoneNumber: fullPhoneNumber,
					requestId
				});
				resetState();
			} else if (response?.meta?.requestStatus === 'rejected' || !requestId) {
				Toast.show({
					type: 'error',
					text1: t('phoneNumberSetting.updatePhoneNumber.failed')
				});
			}
		} catch (error) {
			console.error('Error add phone number: ', error);
		}
	}, [selectedCountry.prefix, phoneNumber, t]);

	const handleRemovePhoneNumber = useCallback(() => {}, []);

	const renderCountrySelectDropdown = () => {
		return (
			<View style={styles.dropdownContainer}>
				{countries.length > 0 &&
					countries.map((country) => (
						<TouchableOpacity
							key={country.code}
							style={styles.dropdownItem}
							activeOpacity={0.8}
							onPress={() => handleCountrySelect(country)}
						>
							<View style={styles.dropdownItemContent}>
								<MezonIconCDN icon={country.icon} useOriginalColor customStyle={styles.customStyleFlagIcon} />
								<Text style={styles.dropdownText}>{country.name}</Text>
							</View>
							<Text style={[styles.dropdownText, { color: themeValue.bgViolet }]}>{`(${country.prefix})`}</Text>
						</TouchableOpacity>
					))}
			</View>
		);
	};

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

				{isValidPhoneNumber === false && (
					<ErrorInput errorMessage={t('phoneNumberSetting.updatePhoneNumber.invalidPhoneNumber')} style={styles.errorInput} />
				)}

				{isShowDropdown && renderCountrySelectDropdown()}
			</View>

			<View style={styles.buttonContainer}>
				<MezonButton
					titleStyle={[styles.buttonTitle, { color: 'white' }]}
					title={t('phoneNumberSetting.updatePhoneNumber.nextButton')}
					onPress={handleAddPhoneNumber}
					containerStyle={[styles.nextButton, isValidPhoneNumber ? styles.nextButtonActive : {}]}
					disabled={!isValidPhoneNumber}
				/>

				<MezonButton
					titleStyle={styles.buttonTitle}
					title={t('phoneNumberSetting.updatePhoneNumber.removeButton')}
					onPress={handleRemovePhoneNumber}
					containerStyle={styles.removeButton}
				/>
			</View>
		</SafeAreaView>
	);
});
