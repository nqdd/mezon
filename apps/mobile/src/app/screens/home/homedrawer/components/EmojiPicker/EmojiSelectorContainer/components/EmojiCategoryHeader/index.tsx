import { size, useTheme } from '@mezon/mobile-ui';
import { PREDEFINED_EMOJI_CATEGORIES } from '@mezon/utils';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import MezonIconCDN from '../../../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../../../constants/icon_cdn';
import { style } from '../../styles';

interface IEmojiCategoryHeaderProps {
	categoryName: string;
	isExpanded: boolean;
	onToggle: () => void;
}

const EmojiCategoryHeader = ({ categoryName, isExpanded, onToggle }: IEmojiCategoryHeaderProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('common');

	const displayCategoryName = useMemo(() => {
		if (!categoryName) return '';
		return PREDEFINED_EMOJI_CATEGORIES.includes(categoryName) ? t(`emojiCategories.${categoryName}`) : categoryName;
	}, [categoryName, t]);

	return (
		<TouchableOpacity onPress={onToggle} style={styles.categoryHeader}>
			<Text style={styles.titleCategories}>{displayCategoryName}</Text>
			<MezonIconCDN
				icon={isExpanded ? IconCDN.chevronDownSmallIcon : IconCDN.chevronSmallRightIcon}
				color={themeValue.text}
				width={size.s_16}
				height={size.s_16}
				customStyle={styles.chevronIcon}
			/>
		</TouchableOpacity>
	);
};

export default memo(EmojiCategoryHeader);
