import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () => {
    return StyleSheet.create({
        emoji: {
            width: size.s_16,
            height: size.s_16,
            transform: [{ translateY: size.s_2 }]
        }
    });
};
