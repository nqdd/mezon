import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			gap: size.s_6
		},
		headerRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		titleText: {
			fontSize: verticalScale(18),
			color: colors.textStrong
		},
		optionRow: {
			flexDirection: 'row',
			borderRadius: size.s_4,
			overflow: 'hidden'
		},
		optionButton: {
			alignItems: 'center',
			justifyContent: 'center',
			width: size.s_34,
			height: size.s_30
		},
		descriptionText: {
			fontSize: verticalScale(10),
			color: colors.textDisabled
		}
	});
