import { View } from 'react-native';

export const Bubble = ({ size, position, color }) => (
	<View
		style={{
			position: 'absolute',
			backgroundColor: color,
			height: size,
			width: size,
			borderRadius: size / 2,
			...position,
			elevation: 1
		}}
	/>
);
