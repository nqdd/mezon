import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Text, View } from 'react-native';
import { style } from './styles';

function MessageNewLine() {
	const styles = style();
	const { t } = useTranslation('message');
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(-10)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true
			})
		]).start();

		return () => {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true
				}),
				Animated.timing(translateY, {
					toValue: 10,
					duration: 200,
					useNativeDriver: true
				})
			]).start();
		};
	}, []);

	return (
		<Animated.View
			style={[
				styles.container,
				{
					opacity,
					transform: [{ translateY }]
				}
			]}
		>
			<View style={styles.line} />
			<Text style={styles.text}>{t('newMessages')}</Text>
			<View style={styles.line} />
		</Animated.View>
	);
}

export default React.memo(MessageNewLine);
