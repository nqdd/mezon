import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			marginBottom: size.s_10,
			paddingHorizontal: size.s_20
		},
		label: {
			fontSize: size.s_14,
			marginVertical: size.s_10,
			color: colors.text,
			fontWeight: '600'
		},
		inputTexts: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			height: size.s_50,
			borderColor: colors.border,
			borderWidth: 1,
			borderRadius: size.s_4,
			paddingHorizontal: size.s_10,
			paddingLeft: size.s_8
		},
		inputText: {
			fontSize: size.s_14,
			color: colors.textStrong,
			width: '90%'
		},
		errorText: {
			fontSize: size.s_12,
			marginTop: size.s_8,
			color: baseColor.red
		},
		require: {
			color: baseColor.red
		}
	});
