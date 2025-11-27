import { inviteLinkRegexFlexible } from '@mezon/mobile-components';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import LinkInvite from './LinkInvite';

interface IRenderMessageInviteProps {
	content: string;
}

function RenderMessageInvite({ content }: IRenderMessageInviteProps) {
	const extractInviteIds = useMemo(() => {
		if (!content) return [];
		const matches = [...content.matchAll(inviteLinkRegexFlexible)];
		return [...new Set(matches.map((match) => match[1]))];
	}, [content]);

	return (
		<View>
			{extractInviteIds.length > 0 &&
				extractInviteIds.map((id, idx) => {
					return <LinkInvite inviteID={id} key={`invite_${id}_${idx}`} />;
				})}
		</View>
	);
}

export default memo(RenderMessageInvite);
