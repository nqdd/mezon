import type { Attributes } from '@mezon/mobile-ui';
import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary
		},
		description: {
			marginBottom: size.s_6,
			color: colors.text,
			paddingHorizontal: size.s_20,
			fontSize: size.s_12,
			lineHeight: size.s_15
		},
		saveChangeButton: {
			fontSize: size.s_16,
			fontWeight: '600',
			color: colors.bgViolet,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_6
		}
	});
