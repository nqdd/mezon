import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, View } from 'react-native';
import { style } from './styles';
import { useTranslation } from 'react-i18next';

function MessageNewLine() {
	const styles = style();
	const { t } = useTranslation('message');

	return (
		<View style={styles.container}>
			<View style={styles.line} />
			<Text style={styles.text}>{t('newMessages')}</Text>
			<View style={styles.line} />
		</View>
	);
}

export default React.memo(MessageNewLine);
