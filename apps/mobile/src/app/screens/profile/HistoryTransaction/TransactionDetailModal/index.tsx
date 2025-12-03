import { ActionEmitEvent } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import type { UsersEntity } from '@mezon/store-mobile';
import { selectDetailTransaction, useAppSelector } from '@mezon/store-mobile';
import { formatBalanceToString } from '@mezon/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { safeJSONParse } from 'mezon-js';
import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeviceEventEmitter, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { CURRENCY, TRANSACTION_DETAIL } from '../../../../constants/transaction';
import useTabletLandscape from '../../../../hooks/useTabletLandscape';
import { style } from './styles';

interface IMezonConfirmProps {
	usersClan: UsersEntity[];
}
export default function TransactionDetailModal({ usersClan }: IMezonConfirmProps) {
	const isTabletLandscape = useTabletLandscape();
	const { themeValue } = useTheme();
	const styles = style(themeValue, isTabletLandscape);
	const { t } = useTranslation(['token']);
	const detailLedger = useAppSelector((state) => selectDetailTransaction(state));

	function handleClose() {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	}

	const formatDate = useMemo(() => {
		return moment(new Date((detailLedger?.transaction_timestamp ?? 0) * 1000)).format('DD/MM/YYYY HH:mm');
	}, [detailLedger?.transaction_timestamp]);

	const detailFields = useMemo(() => {
		const extraInfo = safeJSONParse(detailLedger?.extra_info || '{}');
		const sender = extraInfo?.UserSenderId ? usersClan.find((user) => user.id === extraInfo?.UserSenderId) : null;
		const receiver = extraInfo?.UserReceiverId ? usersClan.find((user) => user.id === extraInfo?.UserReceiverId) : null;
		return [
			{
				label: t('historyTransaction.detail.transactionId'),
				value: detailLedger?.hash
			},
			{
				label: t('historyTransaction.detail.senderName'),
				value: sender?.username || ''
			},
			{
				label: t('historyTransaction.detail.time'),
				value: formatDate
			},
			{
				label: t('historyTransaction.detail.receiverName'),
				value: receiver?.username || ''
			},
			{
				label: t('historyTransaction.detail.note'),
				value: detailLedger?.text_data || TRANSACTION_DETAIL.DEFAULT_NOTE
			},
			{
				label: t('historyTransaction.detail.amount'),
				value: `${formatBalanceToString(detailLedger?.value)} ${CURRENCY.SYMBOL}`
			}
		];
	}, [detailLedger, usersClan, t, formatDate]);

	const copyTransactionId = () => {
		if (detailLedger?.hash) {
			Clipboard.setString(detailLedger?.hash);
			Toast.show({
				type: 'success',
				props: {
					text2: t('historyTransaction.copied'),
					leadingIcon: <MezonIconCDN icon={IconCDN.copyIcon} color={themeValue.text} />
				}
			});
		}
	};

	return (
		<View style={styles.main}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerTitle}>{t('historyTransaction.detail.title')}</Text>
					<TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleClose}>
						<MezonIconCDN icon={IconCDN.closeIcon} width={size.s_24} height={size.s_24} color={themeValue.text} />
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={styles.detail}>
					{detailFields.map((field, idx) => (
						<View key={`${field.label}_${idx}`} style={styles.row}>
							<View style={styles.field}>
								<TouchableOpacity
									disabled={field.label !== t('historyTransaction.detail.transactionId')}
									onPress={copyTransactionId}
									style={styles.touchableRow}
								>
									<Text style={styles.title}>{field.label}</Text>
									{field.label === t('historyTransaction.detail.transactionId') && detailLedger?.hash && (
										<View style={styles.copyIconWrapper}>
											<Pressable style={styles.copyButton} onPress={copyTransactionId}>
												<MezonIconCDN icon={IconCDN.copyIcon} color={themeValue.text} width={size.s_16} height={size.s_16} />
											</Pressable>
										</View>
									)}
								</TouchableOpacity>
								<Text style={styles.description}>{field.value ?? ''}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
			<TouchableOpacity style={styles.backdrop} onPress={handleClose} />
		</View>
	);
}
