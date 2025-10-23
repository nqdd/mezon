import { useTheme } from '@mezon/mobile-ui';
import { auditLogFilterActions, selectActionAuditLog, useAppDispatch } from '@mezon/store-mobile';
import { ActionLog } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MezonOption, { IMezonOptionData } from '../../../componentUI/MezonOption';
import InputSearchAuditLog from '../InputSearchAuditLog/InputSearchAuditLog';
import { style } from './styles';

const iconMap: { [key in ActionLog]: ReactNode | string } = {
	[ActionLog.ALL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CLAN_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CHANNEL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_PRIVATE_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CHANNE_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CHANNEL_PERMISSION_ACTION_AUDIT]: '-',
	[ActionLog.KICK_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.PRUNE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.BAN_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UNBAN_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_ROLES_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.MOVE_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.DISCONNECT_MEMBER_ACTION_AUDIT]: '-',
	[ActionLog.ADD_BOT_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_THREAD_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_ROLE_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_WEBHOOK_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_EMOJI_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_STICKER_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_EVENT_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CANVAS_ACTION_AUDIT]: '-',
	[ActionLog.CREATE_CATEGORY_ACTION_AUDIT]: '-',
	[ActionLog.UPDATE_CATEGORY_ACTION_AUDIT]: '-',
	[ActionLog.DELETE_CATEGORY_ACTION_AUDIT]: '-'
};

export default function FilterActionAuditLog() {
	const { themeValue } = useTheme();
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const actionAuditLog = useSelector(selectActionAuditLog);
	const [searchText, setSearchText] = useState<string>('');
	const [actionOption, setActionOption] = useState<string>(actionAuditLog ?? ActionLog.ALL_ACTION_AUDIT);
	const { t } = useTranslation('auditLog');
	const styles = style(themeValue);

	const actionOptions: IMezonOptionData = useMemo(
		() =>
			Object.values(ActionLog)
				?.map((action) => ({
					title: action,
					value: action,
					icon: <Text style={styles.iconText}>{iconMap[action]}</Text>
				}))
				?.filter((option) => option?.title?.toLowerCase().includes(searchText?.toLowerCase())),
		[searchText, styles.iconText]
	);
	const handleSearchTerm = useCallback((text) => {
		setSearchText(text);
	}, []);

	const handleOptionChange = useCallback((action: string) => {
		dispatch(auditLogFilterActions.setAction(action));
		navigation.goBack();
	}, []);
	return (
		<View style={styles.container}>
			<InputSearchAuditLog onChangeText={handleSearchTerm} placeHolder={t('filterActionAuditLog.placeholder')} />
			<View style={styles.scrollContainer}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<MezonOption data={actionOptions} onChange={handleOptionChange} value={actionOption} />
				</ScrollView>
			</View>
		</View>
	);
}
