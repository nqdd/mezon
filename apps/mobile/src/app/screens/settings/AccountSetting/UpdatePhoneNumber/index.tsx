/* eslint-disable @nx/enforce-module-boundaries */
import { useTheme } from '@mezon/mobile-ui';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MezonButton from '../../../../componentUI/MezonButton';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import MezonInput from '../../../../componentUI/MezonInput';
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

	const [selectedCountry, setSelectedCountry] = useState<ICountry>(countries[0]);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);

	const handleCountrySelect = (country: ICountry) => {
		setSelectedCountry(country);
		setIsShowDropdown(false);
	};

	const toggleShowCountryDropdown = useCallback(() => {
		setIsShowDropdown(!isShowDropdown);
	}, [isShowDropdown]);

	const handleAddPhoneNumber = useCallback(() => {
		// Navigate to verify phone number screen for testing
		const fullPhoneNumber = selectedCountry.prefix + phoneNumber;
		navigation.navigate('ROUTES.SETTINGS.VERIFY_PHONE_NUMBER', {
			phoneNumber: fullPhoneNumber
		});
	}, [selectedCountry, phoneNumber]);

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
							onTextChange={setPhoneNumber}
							inputStyle={styles.input}
							inputWrapperStyle={styles.inputWrapper}
							keyboardType="phone-pad"
						/>
					</View>
				</View>

				{isShowDropdown && renderCountrySelectDropdown()}
			</View>

			<View style={styles.buttonContainer}>
				<MezonButton
					titleStyle={[styles.buttonTitle, { color: 'white' }]}
					title={t('phoneNumberSetting.updatePhoneNumber.nextButton')}
					onPress={handleAddPhoneNumber}
					containerStyle={[styles.nextButton, phoneNumber ? styles.nextButtonActive : {}]}
					disabled={!phoneNumber}
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
