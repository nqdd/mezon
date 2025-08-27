/* eslint-disable prettier/prettier */
import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
    StyleSheet.create({
        emptyStickerBox: {
            marginTop: size.s_40,
            gap: size.s_10,
            flexDirection: 'column',
            alignItems: 'center',
        },
        emptyStickerTitle: {
            fontSize: size.h4,
            color: colors.textStrong,
            fontWeight: '600',
            textAlign: 'center'
        }
    });