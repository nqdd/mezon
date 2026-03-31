import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: size.s_16,
			width: '100%',
			borderRadius: size.s_8,
			borderWidth: 1,
			borderColor: colors.border,
			marginBottom: size.s_6,
			padding: size.s_12
		},
		userAvatar: {
			width: size.s_40,
			height: size.s_40,
			borderRadius: size.s_20,
			overflow: 'hidden'
		},
		userName: {
			fontSize: size.medium,
			color: colors.text,
			flexShrink: 1
		},
		userWrapper: {
			flexDirection: 'row',
			gap: size.s_6,
			alignItems: 'center',
			flexShrink: 1
		},
		unbanButton: {
			paddingVertical: size.s_8,
			paddingHorizontal: size.s_16,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: size.s_30,
			backgroundColor: baseColor.flamingo
		},
		buttonText: {
			color: baseColor.white,
			fontSize: size.medium
		}
	});
