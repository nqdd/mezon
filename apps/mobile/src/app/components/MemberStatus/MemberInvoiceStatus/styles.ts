import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		voiceContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 4
		},
		voiceText: {
			color: colors.textDisabled,
			fontSize: size.s_12,
			fontWeight: '500'
		}
	});
