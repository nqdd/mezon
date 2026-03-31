import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			paddingLeft: size.s_14
		},
		leftContent: {
			flexDirection: 'row' as const,
			alignItems: 'center' as const,
			flex: 1
		},
		avatar: {
			width: size.s_36,
			height: size.s_36,
			borderRadius: size.s_16,
			marginRight: size.s_12,
			overflow: 'hidden'
		},
		defaultAvatar: {
			width: size.s_36,
			height: size.s_36,
			borderRadius: size.s_36,
			marginRight: size.s_12,
			justifyContent: 'center' as const,
			alignItems: 'center' as const,
			backgroundColor: baseColor.orange
		},
		avatarText: {
			color: colors.white,
			fontSize: size.s_16,
			fontWeight: '600'
		},
		textContent: {
			flex: 1,
			justifyContent: 'center' as const,
			borderBottomWidth: 1,
			borderBottomColor: colors.borderDim,
			minHeight: size.s_50
		},
		groupName: {
			fontSize: size.s_12,
			color: colors.text
		}
	});

export default style;
