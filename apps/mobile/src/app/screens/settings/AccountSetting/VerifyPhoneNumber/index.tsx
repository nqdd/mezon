import { baseColor, useTheme } from '@mezon/mobile-ui';
import { accountActions, useAppDispatch } from '@mezon/store-mobile';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, NativeEventEmitter, NativeModules, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonButton from '../../../../componentUI/MezonButton';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { style } from './styles';

interface IVerifyPhoneNumberProps {
	navigation: any;
	route?: {
		params?: {
			phoneNumber?: string;
			requestId?: string;
		};
	};
}

const OTP_LENGTH = 6;

export const VerifyPhoneNumber = memo(({ navigation, route }: IVerifyPhoneNumberProps) => {
	const { SmsUserConsent } = NativeModules;
	const { themeValue } = useTheme();
	const { t } = useTranslation('accountSetting');
	const styles = style(themeValue);
	const dispatch = useAppDispatch();

	const requestId = route?.params?.requestId || '';
	const phoneNumber = route?.params?.phoneNumber || '';
	const [otpCode, setOtpCode] = useState<string>('');
	const otpInputRef = useRef<TextInput>(null);
	const isValidOtp = useMemo(() => otpCode.length === OTP_LENGTH, [otpCode]);
	const smsSubscriptionsRef = useRef<any[]>([]);

	const setupSmsAutoFill = useCallback(async () => {
		if (Platform.OS !== 'android' || !SmsUserConsent) return;

		try {
			const emitter = new NativeEventEmitter(SmsUserConsent);

			smsSubscriptionsRef.current = [
				emitter.addListener('onSmsReceived', async ({ message }: { message?: string }) => {
					if (!message) return;
					try {
						const otp = await SmsUserConsent.extractOtpFromMessage(message, OTP_LENGTH);
						setOtpCode(otp);
					} catch (error) {
						console.error('Error extract OTP from message: ', error);
					}
				})
			];

			await SmsUserConsent.startSmsUserConsent(null);
		} catch (error) {
			console.error('Error start SMS User Consent:', error);
		}
	}, [SmsUserConsent, phoneNumber]);

	useEffect(() => {
		setupSmsAutoFill();
		return () => {
			SmsUserConsent?.stopSmsUserConsent?.();
			smsSubscriptionsRef.current?.length > 0 && smsSubscriptionsRef.current.forEach((s) => s?.remove?.());
			smsSubscriptionsRef.current = [];
		};
	}, [setupSmsAutoFill]);

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

	const handleVerify = useCallback(async () => {
		if (!isValidOtp) return;
		const payload = {
			otp_code: otpCode,
			req_id: requestId
		};

		try {
			const response = await dispatch(accountActions.verifyPhone(payload));
			if (response?.meta?.requestStatus === 'fulfilled') {
				Toast.show({
					type: 'success',
					props: {
						text2: t('phoneNumberSetting.verifyPhoneNumber.success'),
						leadingIcon: <MezonIconCDN icon={IconCDN.checkmarkLargeIcon} color={baseColor.green} />
					}
				});
				navigation.navigate('ROUTES.SETTINGS.ACCOUNT');
			} else if (response?.meta?.requestStatus === 'rejected') {
				Toast.show({
					type: 'error',
					text1: t('phoneNumberSetting.verifyPhoneNumber.failed')
				});
			}
		} catch (error) {
			console.error('Error verify phone number: ', error);
		}
	}, [otpCode, requestId, t]);

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
