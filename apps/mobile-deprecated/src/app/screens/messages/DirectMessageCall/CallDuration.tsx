import { size, useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

interface ICallDurationProps {
	isConnected: boolean;
}

const CallDuration = ({ isConnected }: ICallDurationProps) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [callDuration, setCallDuration] = useState<number>(0);
	const { themeValue } = useTheme();

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	useEffect(() => {
		if (isConnected) {
			timerRef.current = setInterval(() => {
				setCallDuration((prev) => prev + 1);
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
			setCallDuration(0);
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isConnected]);

	return (
		<Text
			style={[
				styles.status,
				{
					color: themeValue.text
				}
			]}
		>
			{formatTime(callDuration)}
		</Text>
	);
};

const styles = StyleSheet.create({
	status: {
		marginTop: size.s_10,
		fontSize: size.s_16,
		textAlign: 'center'
	}
});

export default React.memo(CallDuration);
