export const searchFieldName: Record<string, string> = {
	from: 'username',
	mentions: 'mention',
	has: 'has',
	before: 'before',
	after: 'after',
	in: 'channel_label',
	pinned: '',
	content: 'content',
	'>': 'username',
	'~': 'mention',
	'&': 'has'
};

export const getSearchOptions = (t: (key: string) => string) => [
	{ title: '>', content: t('searchOptionsData.fromUserShort'), value: 'username' },
	{ title: '~', content: t('searchOptionsData.mentionsUserShort'), value: 'mentions' },
	{ title: '&', content: t('searchOptionsData.hasContentShort'), value: 'has' }
];

// Keep the original for backward compatibility but deprecated
export const searchOptions = [
	{ title: '>', content: 'user (from:)', value: 'username' },
	{ title: '~', content: 'user (mentions:)', value: 'mentions' },
	{ title: '&', content: 'link, embed or file (has:)', value: 'has' }
];

export const hasKeySearch = (value: string) => {
	return searchOptions.map((item) => item.title).some((fieldName) => value?.includes(fieldName));
};
