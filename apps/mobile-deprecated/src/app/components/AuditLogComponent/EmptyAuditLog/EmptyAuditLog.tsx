import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { style } from './styles';

export default function EmptyAuditLog() {
	const { themeValue } = useTheme();
	const { t } = useTranslation('auditLog');
	const styles = style(themeValue);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('emptyAuditLog.noLogsYet')}</Text>
			<Text style={styles.description}>{t('emptyAuditLog.description')}</Text>
		</View>
	);
}
