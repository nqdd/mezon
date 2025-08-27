import { size, useTheme } from '@mezon/mobile-ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import MezonIconCDN from '../../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../../constants/icon_cdn';
import { style } from './styles';

const EmptySticker = ({ isAudio }: { isAudio: boolean }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['clanStickerSetting']);

	return (
		<View style={styles.emptyStickerBox}>
			<MezonIconCDN icon={isAudio ? IconCDN.recordIcon : IconCDN.sticker} width={size.s_90} height={size.s_90} color={themeValue.text} />
			<Text style={styles.emptyStickerTitle}>{isAudio ? t('empty.voiceSticker.title') : t('empty.sticker.title')}</Text>
		</View>
	);
};

export default memo(EmptySticker);
