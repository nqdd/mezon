import { type ChannelsEntity } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';

type IChannelHashtag = {
	channelHashtagId: string;
	channelEntity: ChannelsEntity;
};
export const ChannelHashtag = ({ channelHashtagId, channelEntity }: IChannelHashtag) => {
	const channel = channelEntity || {
		id: channelHashtagId,
		channel_label: 'unknown'
	};

	const dataPress = `${channel.type}***${channel.channel_id}***${channel.clan_id}***${channel.status}***${channel.meeting_code}***${channel.category_id}`;

	if (channel.type === ChannelType.CHANNEL_TYPE_MEZON_VOICE) {
		return `[${channel.channel_label}](##voice${JSON.stringify(dataPress)})`;
	}
	if (channel.type === ChannelType.CHANNEL_TYPE_STREAMING) {
		return `[${channel.channel_label}](#stream${JSON.stringify(dataPress)})`;
	}
	if (channel.type === ChannelType.CHANNEL_TYPE_APP) {
		return `[${channel.channel_label}](#app${JSON.stringify(dataPress)})`;
	}
	if (channel.parent_id !== '0') {
		return `[${channel.channel_label}](#thread${JSON.stringify(dataPress)})`;
	}
	return channel['channel_id']
		? `[#${channel.channel_label}](#${JSON.stringify(dataPress)})`
		: `[\\# ${channel.channel_label}](#${JSON.stringify(dataPress)})`;
};
