import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, Keyboard, TouchableOpacity } from 'react-native';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import { style } from './styles';

export type AttachmentPickerProps = {
	mode: string;
	onChange: (mode: string) => void;
};

const AdvancedFunctionSwitcher = memo(({ mode: _mode, onChange }: AttachmentPickerProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const rotation = useRef(new Animated.Value(0)).current;
	const [mode, setMode] = useState<string>(_mode);

	const animateRotation = useCallback(
		(toValue: number) => {
			Animated.spring(rotation, {
				toValue,
				useNativeDriver: true
			}).start();
		},
		[rotation]
	);

	const onPickerPress = useCallback(() => {
		if (mode !== 'advanced') {
			Keyboard.dismiss();
			onChange?.('advanced');
			animateRotation(1);
		} else {
			setMode('text');
			onChange?.('text');
			animateRotation(0);
		}
	}, [mode, onChange, animateRotation]);

	const animatedSwitcher = useCallback(
		(keyboardMode: string) => {
			animateRotation(keyboardMode === 'advanced' ? 1 : 0);
		},
		[animateRotation]
	);

	useEffect(() => {
		const eventListener = DeviceEventEmitter.addListener(ActionEmitEvent.ON_PANEL_KEYBOARD_BOTTOM_SHEET, ({ isShow = false, mode = '' }) => {
			if (!isShow) {
				setMode('text');
				animatedSwitcher('text');
			} else {
				setMode(mode);
				animatedSwitcher(mode);
			}
		});

		return () => {
			eventListener.remove();
		};
	}, [animatedSwitcher]);

	const rotate = useMemo(
		() =>
			rotation.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '45deg']
			}),
		[rotation]
	);

	return (
		<Animated.View style={{ marginLeft: size.s_6, transform: [{ rotate }] }}>
			<TouchableOpacity activeOpacity={0} onPress={onPickerPress} style={styles.touchableButton}>
				{mode === 'advanced' ? (
					<MezonIconCDN icon={IconCDN.plusLargeIcon} width={size.s_24} height={size.s_24} color={themeValue.bgViolet} />
				) : (
					<MezonIconCDN icon={IconCDN.advancedFunctionIcon} width={size.s_20} height={size.s_20} color={themeValue.textStrong} />
				)}
			</TouchableOpacity>
		</Animated.View>
	);
});

AdvancedFunctionSwitcher.displayName = 'AdvancedFunctionSwitcher';

export default AdvancedFunctionSwitcher;
