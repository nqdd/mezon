import { useTheme } from '@mezon/mobile-ui';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform, TextInput, TextStyle, View } from 'react-native';
import { style } from './styles';

const OTP_LENGTH = 6;
interface OTPInputProps {
	onOtpChange: (otp: string[]) => void;
	onOtpComplete: (otp: string) => void;
	isError?: boolean;
	resetTrigger?: any;
	isSms?: boolean;
	styleTextOtp?: TextStyle;
}

const { SmsUserConsent } = NativeModules;

const OTPInput: React.FC<OTPInputProps> = ({ onOtpChange, onOtpComplete, isError = false, resetTrigger, isSms = false, styleTextOtp }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
	const inputRefs = useRef<(TextInput | null)[]>([]);
	const smsSubscriptionsRef = useRef<any[]>([]);

	const fillOtp = useCallback(
		(otpString: string) => {
			const otps = otpString.split('');
			otps.forEach((digit, index) => {
				if (inputRefs.current[index]) {
					inputRefs.current[index].setNativeProps({ text: digit });
				}
			});
			setOtp(otps);
			inputRefs.current[OTP_LENGTH - 1]?.focus();
			onOtpChange(otps);
		},
		[onOtpChange]
	);

	const setupSmsAutoFill = useCallback(async () => {
		if (Platform.OS !== 'android' || !SmsUserConsent || !isSms) return;

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
	}, [fillOtp, onOtpComplete, isSms]);

	useEffect(() => {
		setupSmsAutoFill();
		return () => {
			SmsUserConsent?.stopSmsUserConsent?.();
			smsSubscriptionsRef.current?.length > 0 && smsSubscriptionsRef.current.forEach((s) => s?.remove?.());
			smsSubscriptionsRef.current = [];
		};
	}, [setupSmsAutoFill]);

	useEffect(() => {
		if (resetTrigger) {
			const newOtp = new Array(OTP_LENGTH).fill('');
			setOtp(newOtp);
			inputRefs?.current?.[0]?.focus();
			onOtpChange(newOtp);
		}
	}, [resetTrigger, onOtpChange]);

	const handleOtpChange = useCallback(
		(value: string, index: number) => {
			try {
				if (value.length === OTP_LENGTH) {
					fillOtp(value);
					onOtpComplete(value);
					return;
				}

				if (value === '') {
					setOtp((prev) => {
						const newOtp = [...prev];
						newOtp[index] = '';
						onOtpChange(newOtp);
						return newOtp;
					});
					return;
				}

				if (value.length >= 1 && /^\d*$/.test(value)) {
					const valueLatest = value[value.length - 1];
					const hadValue = otp[index] !== '';
					setOtp((prev) => {
						const newOtp = [...prev];
						newOtp[index] = valueLatest;
						onOtpChange(newOtp);

						if (index < OTP_LENGTH - 1 && (hadValue || valueLatest !== '')) {
							inputRefs.current[index + 1]?.focus();
						}

						if (newOtp.every((digit) => digit !== '')) {
							onOtpComplete(newOtp.join(''));
						}

						return newOtp;
					});
				}
			} catch (error) {
				console.error('handleOtpChange error', error);
			}
		},
		[fillOtp, onOtpChange, onOtpComplete, otp]
	);

	const handleKeyPress = (e: any, index: number) => {
		if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
			inputRefs?.current?.[index - 1]?.focus();
			inputRefs.current[index - 1].setNativeProps({ text: '' });
			setOtp((prev) => {
				const newOtp = [...prev];
				newOtp[index - 1] = '';
				onOtpChange(newOtp);
				return newOtp;
			});
		}
	};

	return (
		<View style={styles.inputSection}>
			{otp.map((digit, index) => (
				<TextInput
					key={index}
					ref={(ref) => (inputRefs.current[index] = ref)}
					style={[styles.input, digit !== '' ? [styles.inputFilled, styleTextOtp] : styles.inputEmpty, isError && styles.inputError]}
					value={digit?.[0] || ''}
					onChangeText={(value) => handleOtpChange(value, index)}
					onKeyPress={(e) => handleKeyPress(e, index)}
					keyboardType="number-pad"
					maxLength={OTP_LENGTH}
					autoFocus={index === 0}
					selectTextOnFocus={true}
					selection={digit !== '' ? { start: 1, end: 1 } : undefined}
					autoComplete={isSms ? 'sms-otp' : undefined}
					textContentType={isSms ? 'oneTimeCode' : undefined}
				/>
			))}
		</View>
	);
};

export default memo(OTPInput);
