import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { EPermission } from '@mezon/utils';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import MezonIconCDN from '../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../constants/icon_cdn';
import { EPermissionStatus } from '../../types/channelPermission.enum';
import type { IPermissionItemProps } from '../../types/channelPermission.type';
import { styles as stylesFn } from './PermissionItem.styles';

export const PermissionItem = memo(({ permission, status, onPermissionStatusChange }: IPermissionItemProps) => {
	const { slug } = permission;
	const { themeValue } = useTheme();
	const styles = stylesFn(themeValue);
	const { t } = useTranslation(['channelSetting', 'clanRoles']);

	const permissionOptionList = [
		{
			icon: (color: string) => <MezonIconCDN icon={IconCDN.closeIcon} color={color} />,
			activeBackground: baseColor.redStrong,
			color: baseColor.redStrong,
			type: EPermissionStatus.Deny
		},
		{
			icon: (color: string) => <MezonIconCDN icon={IconCDN.slashIcon} height={size.s_16} width={size.s_16} color={color} />,
			activeBackground: '#404249',
			color: '#404249',
			type: EPermissionStatus.None
		},
		{
			icon: (color: string) => <MezonIconCDN icon={IconCDN.checkmarkSmallIcon} color={color} />,
			activeBackground: baseColor.green,
			color: baseColor.green,
			type: EPermissionStatus.Allow
		}
	];

	const getPermissionDescription = useCallback(() => {
		switch (slug) {
			case EPermission.viewChannel:
				return t('channelPermission.description.viewChannel');
			case EPermission.manageChannel:
				return t('channelPermission.description.manageChannel');
			default:
				return '';
		}
	}, [t, slug]);

	const getPermissionTitle = (slug: string) => {
		return t(`clanRoles:permissionTitles.${slug}`, { defaultValue: '' });
	};

	return (
		<View>
			<View style={styles.headerRow}>
				<Text style={styles.titleText}>{getPermissionTitle(slug)}</Text>
				<View style={styles.optionRow}>
					{permissionOptionList?.map((option, index) => {
						return (
							<TouchableOpacity
								style={index !== permissionOptionList.length - 1 && styles.optionButtonContainer}
								key={option.type.toString()}
								onPress={() => onPermissionStatusChange(permission?.id, option.type)}
							>
								<View
									style={[
										styles.optionButton,
										{ backgroundColor: status === option.type ? option.activeBackground : themeValue.primary }
									]}
								>
									{option.icon(status === option.type ? baseColor.white : option.color)}
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
			<Text style={styles.descriptionText}>{getPermissionDescription()}</Text>
		</View>
	);
});
