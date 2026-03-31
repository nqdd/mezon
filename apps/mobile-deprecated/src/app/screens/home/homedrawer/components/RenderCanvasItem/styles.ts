import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	buttonContainer: {
		borderColor: baseColor.link,
		borderWidth: size.s_2,
		padding: size.s_6,
		paddingHorizontal: size.s_16,
		borderRadius: size.s_6
	},
	buttonText: {
		color: baseColor.link,
		fontSize: size.s_14,
		textAlign: 'center',
		fontWeight: 'bold'
	}
});
