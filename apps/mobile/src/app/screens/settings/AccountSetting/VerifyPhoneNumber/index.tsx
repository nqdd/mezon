import { useTheme } from '@mezon/mobile-ui';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import MezonButton from '../../../../componentUI/MezonButton';
import { style } from './styles';

interface IVerifyPhoneNumberProps {
	navigation: any;
	route?: {
		params?: {
			phoneNumber?: string;
		};
	};
}

const OTP_LENGTH = 6;

export const VerifyPhoneNumber = memo(({ navigation, route }: IVerifyPhoneNumberProps) => {
	const { themeValue } = useTheme();
	const { t } = useTranslation('accountSetting');
	const styles = style(themeValue);

	const phoneNumber = route?.params?.phoneNumber || '';
	const [otpCode, setOtpCode] = useState<string>('');
	const otpInputRef = useRef<TextInput>(null);
	const isValidOtp = useMemo(() => otpCode.length === OTP_LENGTH, [otpCode]);

	useEffect(() => {
		const showKeyboardSubscription = Keyboard.addListener('keyboardDidShow', () => {
			otpInputRef.current?.focus();
		});
		const hideKeyboardSubscription = Keyboard.addListener('keyboardDidHide', () => {
			otpInputRef.current?.blur();
		});

		return () => {
			showKeyboardSubscription && showKeyboardSubscription.remove();
			hideKeyboardSubscription && hideKeyboardSubscription.remove();
		};
	}, []);

	const handleVerify = useCallback(() => {
		if (otpCode.length === OTP_LENGTH) {
			// TODO: Implement OTP verification logic
		}
	}, [otpCode]);

	const handleOtpChange = useCallback((value: string) => {
		const numericValue = value.replace(/[^0-9]/g, '');
		setOtpCode(numericValue);
	}, []);

	const handleOtpInputPress = useCallback(() => {
		otpInputRef.current?.focus();
	}, []);

	const renderOTPInput = () => {
		return (
			<Pressable style={styles.otpContainer} onPress={handleOtpInputPress}>
				{Array.from({ length: OTP_LENGTH }, (_, index) => (
					<View key={`otp-box-${index}`} style={[styles.otpInputBox, otpCode[index] ? styles.otpInputBoxActive : {}]}>
						<Text style={styles.otpInputText}>{otpCode[index] || ''}</Text>
					</View>
				))}
			</Pressable>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.subtitle}>{`${t('phoneNumberSetting.verifyPhoneNumber.description')} ${phoneNumber}`}</Text>
			{renderOTPInput()}

			<MezonButton
				title={t('phoneNumberSetting.verifyPhoneNumber.verifyButton')}
				titleStyle={styles.buttonTitle}
				onPress={handleVerify}
				containerStyle={[styles.verifyButton, isValidOtp ? styles.verifyButtonActive : {}]}
				disabled={!isValidOtp}
			/>

			<TextInput
				ref={otpInputRef}
				style={styles.hiddenInput}
				value={otpCode}
				keyboardType="number-pad"
				inputMode="numeric"
				maxLength={OTP_LENGTH}
				onChangeText={handleOtpChange}
				autoFocus
				textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined}
				autoComplete={Platform.OS === 'android' ? 'sms-otp' : undefined}
				autoCorrect={false}
				autoCapitalize="none"
				onSubmitEditing={handleVerify}
			/>
		</SafeAreaView>
	);
});
