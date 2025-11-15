import { ITabList } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles as stylesFn } from './styles';
interface IHeaderTabSearchProps {
	onPress: (index: number) => void;
	tabList: ITabList[];
	activeTab: number;
}
const HeaderTabSearch = ({ onPress, tabList, activeTab }: IHeaderTabSearchProps) => {
	const { themeValue } = useTheme();
	const styles = stylesFn(themeValue);
	return (
		<View style={styles.container}>
			{tabList?.map((tab: ITabList, index: number) => (
				<Pressable key={`tab_search_${index.toString()}`} onPress={() => onPress(tab?.index)} style={styles.tabButton}>
					<View
						style={[
							styles.tabContent,
							{
								borderBottomColor: themeValue.bgViolet,
								borderBottomWidth: tab?.index === activeTab ? size.s_2 : 0
							}
						]}
					>
						<Text
							style={{ color: tab?.index === activeTab ? baseColor.blurple : themeValue.text }}
							numberOfLines={1}
							ellipsizeMode="middle"
						>
							{tab.title} {tab?.quantitySearch ? `(${tab?.quantitySearch})` : ''}
						</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
};

export default React.memo(HeaderTabSearch);
