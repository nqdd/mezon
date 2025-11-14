import type { IOption, IUerMention } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import ListOptionSearch from '../../SearchMessageChannel/ListOptionSearch';
import { style } from './styles';

interface HeaderSearchMessageDmProps {
	initialSearchText?: string;
	onClearStoreInput?: (value: string) => void;
	onChangeText: (value: string) => void;
	onSelectOptionFilter?: (option: IOption) => void;
	optionFilter?: IOption;
	userMention?: IUerMention;
}

export default function HeaderSearchMessageDm({
	initialSearchText,
	onClearStoreInput,
	onChangeText,
	onSelectOptionFilter,
	optionFilter,
	userMention
}: HeaderSearchMessageDmProps) {
	const navigation = useNavigation<any>();
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation('common');
	const [textInput, setTextInput] = useState<string>(initialSearchText || '');
	const [isVisibleToolTip, setIsVisibleToolTip] = useState<boolean>(false);
	const inputSearchRef = useRef(null);

	const handleTextChange = (text: string) => {
		setTextInput(text);
		onChangeText(text);
	};

	const clearTextInput = () => {
		if (textInput?.length) {
			setTextInput('');
			onChangeText('');
			onClearStoreInput && onClearStoreInput('');
		}
		if (optionFilter) {
			onSelectOptionFilter && onSelectOptionFilter(null);
			onClearStoreInput && onClearStoreInput('');
		}
	};

	const onGoBack = () => {
		navigation.goBack();
	};

	const onChangeOptionFilter = (option) => {
		setTextInput('');
		onChangeText('');
		onClearStoreInput && onClearStoreInput('');
		setIsVisibleToolTip(false);
		onSelectOptionFilter && onSelectOptionFilter(option);
	};

	const shouldShowBadge = useMemo(() => optionFilter?.title || userMention?.display, [optionFilter?.title, userMention?.display]);

	const badgeText = useMemo(() => {
		if (optionFilter?.title || userMention?.display) {
			return `${optionFilter?.title || ''} ${userMention?.display || ''}`.trim();
		}
		return '';
	}, [optionFilter?.title, userMention?.display]);

	return (
		<View style={styles.headerContainer}>
			<TouchableOpacity onPress={onGoBack}>
				<MezonIconCDN icon={IconCDN.backArrowLarge} width={size.s_20} height={size.s_20} color={themeValue.text} />
			</TouchableOpacity>
			<View style={styles.searchBox}>
				<View style={styles.iconMargin}>
					<MezonIconCDN icon={IconCDN.magnifyingIcon} width={size.s_20} height={size.s_20} color={themeValue.text} />
				</View>
				{shouldShowBadge && (
					<View
						style={[
							styles.badge,
							{
								backgroundColor: themeValue.badgeHighlight,
								marginRight: Platform.OS === 'ios' ? size.s_6 : 0
							}
						]}
					>
						<Text numberOfLines={1} style={styles.textBadgeHighLight}>
							{badgeText}
						</Text>
					</View>
				)}
				<TextInput
					value={textInput}
					onChangeText={handleTextChange}
					style={styles.input}
					placeholderTextColor={themeValue.textDisabled}
					placeholder={t('search')}
					autoFocus
				/>
				{textInput?.length || shouldShowBadge ? (
					<Pressable onPress={() => clearTextInput()}>
						<MezonIconCDN icon={IconCDN.circleXIcon} height={size.s_18} width={size.s_18} color={themeValue.text} />
					</Pressable>
				) : null}
			</View>
			<Tooltip
				isVisible={isVisibleToolTip}
				closeOnBackgroundInteraction={true}
				disableShadow={true}
				closeOnContentInteraction={true}
				content={
					<ListOptionSearch
						onPressOption={(option) => {
							onChangeOptionFilter(option);
							if (inputSearchRef.current) {
								inputSearchRef.current.focus();
							}
							setIsVisibleToolTip(false);
						}}
					/>
				}
				contentStyle={styles.tooltip}
				arrowSize={styles.arrow}
				placement="bottom"
				onClose={() => setIsVisibleToolTip(false)}
				showChildInTooltip={false}
				topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
			>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						setIsVisibleToolTip(true);
						if (inputSearchRef.current) {
							inputSearchRef.current.focus();
						}
					}}
					style={styles.listSearchIcon}
				>
					<MezonIconCDN icon={IconCDN.filterHorizontalIcon} width={20} height={20} color={themeValue.textStrong} />
				</TouchableOpacity>
			</Tooltip>
		</View>
	);
}
