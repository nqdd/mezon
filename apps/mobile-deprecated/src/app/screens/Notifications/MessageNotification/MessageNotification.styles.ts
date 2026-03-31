import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		tapToSeeAttachmentText: {
			color: colors.textDisabled,
			fontSize: size.medium
		},
		attachmentBox: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_4
		}
	});
