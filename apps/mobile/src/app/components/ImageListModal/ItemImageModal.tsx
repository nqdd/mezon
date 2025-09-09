import { sleep } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export const ItemImageModal = React.memo(
	({ item }: { item: ApiMessageAttachment }) => {
		const [dims, setDims] = useState(Dimensions.get('window'));
		const [ready, setReady] = useState(true);
		useEffect(() => {
			const sub = Dimensions.addEventListener('change', async ({ window }) => {
				setReady(false);
				setDims(window);
				await sleep(100);
				setReady(true);
			});
			return () => sub.remove();
		}, []);

		if (!ready) {
			return <View />;
		}
		return (
			<FastImage
				source={{ uri: item?.url }}
				style={(StyleSheet.absoluteFillObject, { width: dims.width, height: dims.height })}
				resizeMode="contain"
			/>
		);
	},
	(prev, next) => prev.item?.url === next.item?.url
);
