import { useTheme } from '@mezon/mobile-ui';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform, TextInput, View } from 'react-native';
import { style } from './styles';

interface IOTPInputProps {
	onOtpChange: (otp: string) => void;
	onOtpComplete: (otp: string) => void;
}

const OTP_LENGTH = 6;

export const OTPInput = memo(({ onOtpChange, onOtpComplete }: IOTPInputProps) => {
	const { SmsUserConsent } = NativeModules;
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
	const otpInputRef = useRef<(TextInput | null)[]>([]);
	const smsSubscriptionsRef = useRef<any[]>([]);

	const fillOtp = useCallback(
		(otp: string) => {
			const otps = otp.slice(0, OTP_LENGTH).split('');
			setOtpCode(otps);
			otpInputRef.current[OTP_LENGTH - 1]?.focus();
			onOtpChange(otp.slice(0, OTP_LENGTH));
		},
		[onOtpChange]
	);

	const setupSmsAutoFill = useCallback(async () => {
		if (Platform.OS !== 'android' || !SmsUserConsent) return;

		try {
			const emitter = new NativeEventEmitter(SmsUserConsent);

			smsSubscriptionsRef.current = [
				emitter.addListener('onSmsReceived', async ({ message }: { message?: string }) => {
					if (!message) return;
					try {
						const otps = await SmsUserConsent?.extractOtpFromMessage?.(message, OTP_LENGTH);
						fillOtp(otps);
						onOtpComplete(otps);
					} catch (error) {
						console.error('Error extract OTP from message: ', error);
					}
				})
			];

			await SmsUserConsent?.startSmsUserConsent?.(null);
		} catch (error) {
			console.error('Error start SMS User Consent:', error);
		}
	}, [SmsUserConsent, fillOtp, onOtpComplete]);

	useEffect(() => {
		setupSmsAutoFill();
		return () => {
			SmsUserConsent?.stopSmsUserConsent?.();
			smsSubscriptionsRef.current?.length > 0 && smsSubscriptionsRef.current.forEach((s) => s?.remove?.());
			smsSubscriptionsRef.current = [];
		};
	}, [setupSmsAutoFill]);

	const handleOtpChange = useCallback(
		(value: string, index: number) => {
			if (/^\d{6}$/.test(value)) {
				fillOtp(value);
				onOtpComplete(value);
				return;
			}
			if (!/^\d*$/.test(value)) return;

			setOtpCode((prevOtp) => {
				const newOtp = [...prevOtp];
				if (value.length <= 1) {
					newOtp[index] = value;
					onOtpChange(newOtp.join(''));

					if (value !== '' && index < OTP_LENGTH - 1) {
						otpInputRef.current[index + 1]?.focus();
					}
				}
				return newOtp;
			});
		},
		[onOtpChange, onOtpComplete, fillOtp]
	);

	const handleKeyPress = useCallback(
		(e: any, index: number) => {
			if (e.nativeEvent.key !== 'Backspace') return;

			setOtpCode((prevOtp) => {
				const newOtp = [...prevOtp];
				if (prevOtp[index]) {
					newOtp[index] = '';
					onOtpChange(newOtp.join(''));
					return newOtp;
				}

				if (index > 0) {
					newOtp[index - 1] = '';
					onOtpChange(newOtp.join(''));
					otpInputRef.current[index - 1]?.focus();
				}
				return newOtp;
			});
		},
		[onOtpChange]
	);

	return (
		<View style={styles.otpContainer}>
			{Array.from({ length: OTP_LENGTH }, (_, index) => {
				return (
					<TextInput
						key={`otp-box-${index}`}
						ref={(ref: TextInput | null) => {
							otpInputRef.current[index] = ref;
						}}
						style={[styles.otpTextInput, otpCode[index] || '' ? styles.otpInputBoxActive : {}]}
						value={otpCode[index] || ''}
						onChangeText={(v) => handleOtpChange(v, index)}
						onKeyPress={(e) => handleKeyPress(e, index)}
						keyboardType="number-pad"
						inputMode="numeric"
						maxLength={OTP_LENGTH}
						autoCorrect={false}
						autoCapitalize="none"
						textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined}
						autoComplete={Platform.OS === 'android' ? 'sms-otp' : undefined}
						selectTextOnFocus
						autoFocus={index === 0}
					/>
				);
			})}
		</View>
	);
});
