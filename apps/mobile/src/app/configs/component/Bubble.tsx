import { useMemo } from 'react';
import { View } from 'react-native';
import { createBubbleStyle } from '../styles';

export const Bubble = ({ size, position, color }) => {
	const bubbleStyle = useMemo(() => createBubbleStyle(size, position, color), [size, position, color]);
	return <View style={bubbleStyle.bubble} />;
};
