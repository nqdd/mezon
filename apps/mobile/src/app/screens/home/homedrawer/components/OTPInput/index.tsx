import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform, TextInput, View } from 'react-native';
import { style } from './styles';

const OTP_LENGTH = 6;
interface OTPInputProps {
	onOtpChange: (otp: string[]) => void;
	onOtpComplete: (otp: string) => void;
	isError?: boolean;
	resetTrigger?: any;
	isSms?: boolean;
}

const { SmsUserConsent } = NativeModules;

const OTPInput: React.FC<OTPInputProps> = ({ onOtpChange, onOtpComplete, isError = false, resetTrigger, isSms = false }) => {
	const styles = style();
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
	}, [SmsUserConsent, fillOtp, onOtpComplete, isSms]);

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
			onOtpChange(newOtp);
			inputRefs?.current?.[0]?.focus();
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
					setOtp((prev) => {
						const newOtp = [...prev];
						newOtp[index] = valueLatest;
						onOtpChange(newOtp);

						if (valueLatest !== '' && index < OTP_LENGTH - 1) {
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
		[fillOtp, onOtpChange, onOtpComplete]
	);

	const handleKeyPress = (e: any, index: number) => {
		if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
			inputRefs?.current?.[index - 1]?.focus();
		}
	};

	return (
		<View style={styles.inputSection}>
			{otp.map((digit, index) => (
				<TextInput
					key={index}
					ref={(ref) => (inputRefs.current[index] = ref)}
					style={[styles.input, digit !== '' ? styles.inputFilled : styles.inputEmpty, isError && styles.inputError]}
					value={digit}
					onChangeText={(value) => handleOtpChange(value, index)}
					onKeyPress={(e) => handleKeyPress(e, index)}
					keyboardType="number-pad"
					maxLength={OTP_LENGTH}
					autoFocus={index === 0}
					selectTextOnFocus={true}
					autoComplete={isSms ? 'sms-otp' : undefined}
					textContentType={isSms ? 'oneTimeCode' : undefined}
				/>
			))}
		</View>
	);
};

export default memo(OTPInput);
