import { size } from '@mezon/mobile-ui';
import { useMemo } from 'react';
import { View } from 'react-native';
import { IMezonMenuItemProps } from './MezonMenuItem';
import MezonMenuSection, { IMezonMenuSectionProps } from './MezonMenuSection';
import { createContainerStyle } from './styles';

interface IMezonMenu {
	menu: IMezonMenuSectionProps[];
	marginVertical?: number | null;
	paddingBottom?: number | null;
}

export default function MezonMenu({ menu, marginVertical = size.s_18, paddingBottom = size.s_18 }: IMezonMenu) {
	const styles = useMemo(() => createContainerStyle(marginVertical, paddingBottom), [marginVertical, paddingBottom]);

	return (
		<View style={styles.container}>
			{menu.map((item, index) => (
				<MezonMenuSection key={index.toString()} {...item} />
			))}
		</View>
	);
}

export const reserve = () => {
	// Toast.show({
	// 	type: 'info',
	// 	text1: 'Coming soon'
	// });
};

export { IMezonMenuItemProps, IMezonMenuSectionProps };
