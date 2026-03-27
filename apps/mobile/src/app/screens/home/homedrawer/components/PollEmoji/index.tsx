import { memo, useMemo } from 'react';
import { Text, TextStyle, Image } from 'react-native';
import { getSrcEmoji } from '@mezon/utils';
import { pollEmojiRegex } from '@mezon/mobile-components';
import { style } from './styles';

type Token = { type: 'text'; value: string } | { type: 'emoji'; id: string };

interface IPollEmojiProps {
    text: string;
    textStyle: TextStyle | TextStyle[];
};

const tokenizePollText = (text?: string): Token[] => {
    if (!text) return [];
    const tokens: Token[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const re = new RegExp(pollEmojiRegex.source, 'g');

    while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        tokens.push({ type: 'emoji', id: match[1] });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        tokens.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return tokens;
}

export const PollEmoji = memo(({ text, textStyle }: IPollEmojiProps) => {
    const styles = style();
    const tokens = useMemo(() => tokenizePollText(text), [text]);

    return (
        <Text style={textStyle} numberOfLines={1}>
            {tokens.map((token, index) => {
                if (token.type === 'text') {
                    return <Text key={`text_${index}`}>{token.value}</Text>;
                }
                const uri = getSrcEmoji(token.id);
                if (!uri) return null;

                return (
                    <Image
                        key={`emoji_${token.id}_${index}`}
                        source={{ uri }}
                        style={styles.emoji}
                        resizeMode="contain"
                    />
                );
            })}
        </Text>
    );
});