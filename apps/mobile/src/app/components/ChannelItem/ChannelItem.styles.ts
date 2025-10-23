import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

const style = (colors: Attributes) =>
	StyleSheet.create({
		channelName: {
			fontSize: size.medium,
			color: colors.text,
			fontWeight: '600'
		},
		categoryChannel: {
			fontSize: size.medium,
			color: colors.text,
			fontWeight: '400'
		},
		joinChannelBtn: {
			backgroundColor: colors.primary,
			borderRadius: size.s_30,
			paddingHorizontal: size.s_20,
			paddingVertical: size.s_8,
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10
		},
		joinChannelBtnText: {
			fontSize: size.medium,
			color: colors.text,
			fontWeight: '500'
		},
		channelItemContainer: {
			marginBottom: size.s_20
		},
		channelRow: {
			flexDirection: 'row',
			gap: size.s_10,
			alignItems: 'center'
		},
		channelInfo: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_6,
			marginBottom: size.s_2
		},
		voiceChannelContainer: {
			flexDirection: 'row',
			gap: size.s_10,
			alignItems: 'center',
			justifyContent: 'space-between'
		}
	});

export default style;
