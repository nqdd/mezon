import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		userInfoBox: { flexDirection: 'row', gap: size.s_14, alignItems: 'center', height: size.s_60 },
		username: {
			fontSize: size.s_16,
			marginBottom: size.s_4,
			color: colors.text,
			fontWeight: '600'
		},
		subUserName: {
			fontSize: size.s_12,
			color: colors.textDisabled,
			fontWeight: '600'
		}
	});
