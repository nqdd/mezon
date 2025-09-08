import { sleep } from '@mezon/utils';
import { ApiMessageAttachment } from 'mezon-js/api.gen';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { RenderItemInfo } from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';

export const ItemImageModal = React.memo(({ item, setImageDimensions }: RenderItemInfo<ApiMessageAttachment>) => {
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
			onLoad={(event) => {
				const { width = dims.width, height = dims.height } = event.nativeEvent;
				setImageDimensions({ width, height });
			}}
		/>
	);
});
