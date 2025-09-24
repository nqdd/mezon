import { useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

export type CountryCode = 'VN' | 'JP' | 'US';

export interface ICountry {
	code: CountryCode;
	prefix: string;
	name: string;
	icon: IconCDN;
}

interface ICountryDropdownProps {
	onCountrySelect: (country: ICountry) => void;
	isVisible?: boolean;
	selectedCountry?: ICountry;
}

export const countries: ICountry[] = [
	{ code: 'VN', prefix: '+84', name: 'Vietnam', icon: IconCDN.vietnamFlagIcon },
	{ code: 'JP', prefix: '+81', name: 'Japan', icon: IconCDN.japanFlagIcon },
	{ code: 'US', prefix: '+1', name: 'USA', icon: IconCDN.usaFlagIcon }
];

export const CountryDropdown = memo<ICountryDropdownProps>(({ onCountrySelect, isVisible = true, selectedCountry }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	if (!isVisible) return null;

	return (
		<View style={styles.dropdownContainer}>
			{countries.length > 0 &&
				countries.map((country) => (
					<TouchableOpacity
						key={country.code}
						style={[styles.dropdownItem, selectedCountry?.code === country.code && styles.selectedItem]}
						activeOpacity={0.8}
						onPress={() => onCountrySelect(country)}
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
});
