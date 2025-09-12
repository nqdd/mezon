import { size, useTheme } from '@mezon/mobile-ui';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Images from '../../../../assets/Images';

interface IAvatarCallProps {
	receiverName: string;
	receiverAvatar: string;
	isAnswerCall: boolean;
	isConnected?: boolean; // Add isConnected prop
}

const AvatarCall = ({ receiverAvatar, receiverName, isAnswerCall = false, isConnected = false }: IAvatarCallProps) => {
	const ring1 = useRef(new Animated.Value(0)).current;
	const ring2 = useRef(new Animated.Value(0)).current;
	const ring3 = useRef(new Animated.Value(0)).current;
	const animationRefs = useRef<Animated.CompositeAnimation[]>([]);

	const { themeValue } = useTheme();

	useEffect(() => {
		const createRingAnimation = (animValue, delay = 0) => {
			return Animated.loop(
				Animated.sequence([
					Animated.delay(delay),
					Animated.timing(animValue, {
						toValue: 1,
						duration: 2000,
						useNativeDriver: true
					}),
					Animated.timing(animValue, {
						toValue: 0,
						duration: 0,
						useNativeDriver: true
					})
				])
			);
		};

		// Only start animations if not connected
		if (!isConnected) {
			// Start animations with staggered delays
			const animation1 = createRingAnimation(ring1, 0);
			const animation2 = createRingAnimation(ring2, 500);
			const animation3 = createRingAnimation(ring3, 1000);

			// Store animation references
			animationRefs.current = [animation1, animation2, animation3];

			animation1.start();
			animation2.start();
			animation3.start();
		} else {
			// Stop all animations when connected
			animationRefs.current.forEach((animation) => {
				animation.stop();
			});

			// Reset animation values to 0
			ring1.setValue(0);
			ring2.setValue(0);
			ring3.setValue(0);
		}

		return () => {
			// Cleanup animations
			animationRefs.current.forEach((animation) => {
				animation.stop();
			});
		};
	}, [isConnected, ring1, ring2, ring3]);

	const createRingStyle = (animValue, baseSize) => ({
		position: 'absolute',
		width: baseSize,
		height: baseSize,
		borderRadius: baseSize / 2,
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		transform: [
			{
				scale: animValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 2.5]
				})
			}
		],
		opacity: animValue.interpolate({
			inputRange: [0, 0.7, 1],
			outputRange: [0.8, 0.4, 0]
		})
	});

	return (
		<View style={styles.container}>
			<View style={styles.profileContainer}>
				{/* Only show rings when not connected */}
				{!isConnected && (
					<>
						<Animated.View style={createRingStyle(ring3, 180) as any} />
						<Animated.View style={createRingStyle(ring2, 160) as any} />
						<Animated.View style={createRingStyle(ring1, 120) as any} />
					</>
				)}
				<FastImage
					source={receiverAvatar ? { uri: receiverAvatar } : Images.ANONYMOUS_AVATAR}
					style={[styles.avatar, isConnected && styles.avatarConnected]}
				/>
			</View>
			{!!receiverName && <Text style={[styles.name, { color: themeValue.text }]}>{receiverName}</Text>}
			{!isConnected && (
				<Text
					style={[
						styles.status,
						{
							color: themeValue.textDisabled
						}
					]}
				>
					{isAnswerCall ? 'Connecting...' : 'Ringing...'}
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		top: size.s_100
	},
	profileContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: size.s_20
	},
	name: {
		fontSize: size.s_20,
		textAlign: 'center',
		fontWeight: '600'
	},
	status: {
		marginTop: size.s_10,
		fontSize: size.s_16,
		textAlign: 'center'
	},
	avatar: {
		width: size.s_100,
		height: size.s_100,
		borderRadius: size.s_100,
		alignSelf: 'center'
	},
	avatarConnected: {
		borderWidth: size.s_4,
		borderColor: '#4CAF50'
	}
});

export default React.memo(AvatarCall);
