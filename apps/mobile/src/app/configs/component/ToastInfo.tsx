import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { View } from 'react-native';
import { BaseToast, ToastConfigParams } from 'react-native-toast-message';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { style } from '../styles';
import { Bubble } from './Bubble';

const WrapperIcon = ({ children }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const defaultLeadingIcon = <MezonIconCDN icon={IconCDN.checkmarkLargeIcon} color={baseColor.bgSuccess} />;
	return <View style={styles.iconWrapper}>{children || defaultLeadingIcon}</View>;
};

export const ToastInfo = memo((props: ToastConfigParams<any>) => {
	const { text1Style, text2Style, props: data, text1, text2 } = props;
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const containerStyle = data?.customStyle ? [styles.container, data.customStyle] : styles.container;
	const text1Content = text1 || data?.text1 || text2 || data?.text2;
	const text2Content = !data?.text1 && !text1 && (text2 || data?.text2) ? '' : text2 || data?.text2;

	return (
		<View
			style={[
				styles.toastWrapper,
				{
					backgroundColor: '#b6e1c6'
				}
			]}
		>
			<Bubble size={size.s_60} position={{ left: -size.s_20, top: -size.s_20 }} color={'#90ddb1'} />
			<Bubble size={size.s_30} position={{ left: size.s_20, bottom: -size.s_20 }} color={'#90ddb1'} />
			<Bubble size={size.s_10} position={{ left: size.s_60, bottom: size.s_20 }} color={'#90ddb1'} />
			<BaseToast
				style={[containerStyle]}
				contentContainerStyle={{ paddingHorizontal: size.s_20 }}
				text1Style={[styles.titleBaseStyle, text1Style]}
				text2Style={[styles.descriptionBaseStyle, text2Style]}
				text1={text1Content}
				text2={text2Content}
				text2NumberOfLines={1}
				text1NumberOfLines={!text2Content ? 2 : 1}
				renderLeadingIcon={() => <WrapperIcon>{data?.leadingIcon}</WrapperIcon>}
				renderTrailingIcon={() => <View style={{ marginRight: -size.s_30 }}></View>}
			/>
		</View>
	);
});
