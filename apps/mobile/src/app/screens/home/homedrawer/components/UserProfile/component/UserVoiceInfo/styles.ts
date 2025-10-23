import type { Attributes } from '@mezon/mobile-ui';
import { baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTabletLandscape: boolean) =>
    StyleSheet.create({
        userInfo: {
            backgroundColor: colors.secondary,
            marginBottom: size.s_20,
            padding: size.s_16,
            borderRadius: 8
        },
        actionText: {
            color: colors.text,
            fontSize: size.medium,
            flexShrink: 1
        },
        wrapManageVoice: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: size.s_12,
            marginBottom: size.s_16
        },
        voiceJoinButton: {
            flexDirection: 'row',
            gap: size.s_6,
            backgroundColor: baseColor.bgSuccess,
            borderRadius: size.s_50,
            justifyContent: 'center',
            paddingVertical: size.s_8,
            alignItems: 'center',
        }
    });
