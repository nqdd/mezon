import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { reportMessageActions } from '@mezon/store';
import { useAppDispatch } from '@mezon/store-mobile';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, DeviceEventEmitter, FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { SeparatorWithSpace } from '../../../../../components/Common';
import StatusBarHeight from '../../../../../components/StatusBarHeight/StatusBarHeight';
import { IconCDN } from '../../../../../constants/icon_cdn';
import { style } from './styles';

interface IReportOption {
	title: string;
	type: EReportCategory;
}

enum EReportCategory {
	ABUSE_OR_HARASSMENT = 'ABUSE_OR_HARASSMENT',
	SPAM = 'SPAM',
	HARMFUL_MISINFORMATION_OR_GLORIFYING_VIOLENCE = 'HARMFUL_MISINFORMATION_OR_GLORIFYING_VIOLENCE',
	EXPOSING_PRIVATE_IDENTIFYING_INFORMATION = 'EXPOSING_PRIVATE_IDENTIFYING_INFORMATION',
	OTHERS = 'OTHERS'
}
//mock data
const reportOptionList: IReportOption[] = [
	{
		title: 'Spam',
		type: EReportCategory.SPAM
	},
	{
		title: 'Abuse or harassment',
		type: EReportCategory.ABUSE_OR_HARASSMENT
	},
	{
		title: 'Harmful misinformation or glorifying violence',
		type: EReportCategory.HARMFUL_MISINFORMATION_OR_GLORIFYING_VIOLENCE
	},
	{
		title: 'Exposing private identifying information',
		type: EReportCategory.EXPOSING_PRIVATE_IDENTIFYING_INFORMATION
	}
];

type ReportMessageModalProps = {
	messageId: string;
};

export const ReportMessageModal = memo(({ messageId }: ReportMessageModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [reportSelected, setReportSelected] = useState<IReportOption | null>(null);
	const slideAnim = useRef(new Animated.Value(1)).current;
	const { t } = useTranslation('message');
	const dispatch = useAppDispatch();

	const onVisibleChange = (value: boolean) => {
		if (!value) {
			onClose();
		}
	};

	const reportOptionList: IReportOption[] = [
		{
			title: t('reportMessage.spam'),
			type: EReportCategory.SPAM
		},
		{
			title: t('reportMessage.harassment'),
			type: EReportCategory.ABUSE_OR_HARASSMENT
		},
		{
			title: t('reportMessage.violentContent'),
			type: EReportCategory.HARMFUL_MISINFORMATION_OR_GLORIFYING_VIOLENCE
		},
		{
			title: t('reportMessage.private'),
			type: EReportCategory.EXPOSING_PRIVATE_IDENTIFYING_INFORMATION
		}
	];

	const onClose = () => {
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	};

	useEffect(() => {
		Animated.timing(slideAnim, {
			toValue: reportSelected ? 0 : size.s_100,
			duration: 300,
			useNativeDriver: true
		}).start();
	}, [reportSelected]);

	const handleReportMessage = async () => {
		try {
			onVisibleChange(false);
			dispatch(reportMessageActions.reportMessageAbuse({ messageId, abuseType: reportSelected?.type || EReportCategory.SPAM }));
			Toast.show({
				type: 'success',
				props: {
					text2: t('reportMessage.reportSubmitted'),
					leadingIcon: <MezonIconCDN icon={IconCDN.checkmarkSmallIcon} color={baseColor.green} width={20} height={20} />
				}
			});
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
		} catch (error) {
			console.error('Error reporting message:', error);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBarHeight />
			<View style={styles.reportMessageModalContainer}>
				<View style={styles.contentWrapper}>
					{reportSelected ? (
						<Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
							<Pressable
								onPress={() => setReportSelected(null)}
								style={{ position: 'absolute', top: 0, left: 0, padding: size.s_10, paddingLeft: 0, zIndex: 2 }}
							>
								<MezonIconCDN icon={IconCDN.arrowLargeLeftIcon} color={themeValue.textStrong} width={size.s_20} height={size.s_20} />
							</Pressable>

							<View>
								<Text style={styles.title}>{t('reportMessage.reportSummary')}</Text>
								<Text style={styles.subTitle}>{t('reportMessage.reviewYourReportBeforeSubmitting')}</Text>
							</View>
							<View style={styles.categoryTitle}>
								<Text style={styles.reportCategory}>{t('reportMessage.reportCategory')}</Text>

								<View style={styles.reportCategoryWrapper}>
									<MezonIconCDN icon={IconCDN.circleIcon} color={themeValue.bgViolet} height={size.s_6} width={size.s_6} />
									<Text style={styles.reportCategoryTitle}>{reportSelected?.title}</Text>
								</View>
							</View>
						</Animated.View>
					) : (
						<View>
							<Text style={styles.title}>{t('reportMessage.title')}</Text>
							<Text style={styles.subTitle}>{t('reportMessage.subTitle')}</Text>
						</View>
					)}

					{!reportSelected ? (
						<View style={styles.reportList}>
							<Text style={styles.selectedMessageText}>{t('reportMessage.selectedMessage')}</Text>
							<FlatList
								data={reportOptionList}
								keyExtractor={(item) => item.type}
								ItemSeparatorComponent={SeparatorWithSpace}
								initialNumToRender={1}
								maxToRenderPerBatch={1}
								windowSize={2}
								renderItem={({ item }) => {
									return (
										<TouchableOpacity onPress={() => setReportSelected(item)} style={styles.reportItem}>
											<Text style={styles.reportTitle}>{item.title}</Text>
											<MezonIconCDN icon={IconCDN.chevronSmallRightIcon} height={15} width={15} color={themeValue.text} />
										</TouchableOpacity>
									);
								}}
							/>
						</View>
					) : null}
				</View>

				{reportSelected ? (
					<View style={styles.buttonWrapper}>
						<Text style={styles.subTitle}>{t('reportMessage.submitDescription')}</Text>
						<TouchableOpacity style={styles.SubmitButton} onPress={() => handleReportMessage()}>
							<Text style={styles.SubmitText}>{t('reportMessage.submitReport')}</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.buttonWrapper}>
						<TouchableOpacity style={styles.buttonCannel} onPress={() => onVisibleChange(false)}>
							<Text style={styles.cannelText}>{t('reportMessage.cancel')}</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</View>
	);
});
