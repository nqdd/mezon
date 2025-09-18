import { searchMentionsHashtag } from '@mezon/utils';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Mention, { type MentionData } from '../MessageBox/ReactionMentionInput/Mention';
import MentionsInput from '../MessageBox/ReactionMentionInput/MentionsInput';
import { UserMentionList } from '../UserMentionList';
import SelectItemUser from './SelectItemUser';
import type { SearchInputProps } from './types';

const HAS_OPTIONS: MentionData[] = [
	{ id: 'video', display: 'video' },
	{ id: 'link', display: 'link' },
	{ id: 'image', display: 'image' }
];

const SearchInput = ({
	channelId,
	mode,
	valueInputSearch,
	valueDisplay: _valueDisplay,
	appearanceTheme: _appearanceTheme,
	lightMentionsInputStyle: _lightMentionsInputStyle,
	darkMentionsInputStyle: _darkMentionsInputStyle,
	searchRef: _searchRef,
	onInputClick: _onInputClick,
	onKeyDown: _onKeyDown,
	onChange,
	setIsShowSearchOptions
}: SearchInputProps) => {
	const { t } = useTranslation('searchMessageChannel');
	const userListData = UserMentionList({
		channelID: channelId,
		channelMode: mode
	});

	const [valueHighlight, setValueHighlight] = useState<string>('');

	const handleSearchUserMention = useCallback(
		(search: string): MentionData[] => {
			setValueHighlight(search);
			const results = searchMentionsHashtag(search, userListData || []);
			const mentionResults = results.length > 0 ? results : userListData || [];

			// Convert MentionDataProps[] to MentionData[]
			return mentionResults.map((item) => ({
				id: String(item.id),
				display: item.display || '',
				avatarUrl: item.avatarUrl,
				username: item.username,
				isRole: item.isRoleUser
			}));
		},
		[userListData]
	);

	const handleMentionsInputChange = useCallback(
		(html: string) => {
			// Create a synthetic event to match OnChangeHandlerFunc signature
			const syntheticEvent = {
				target: { value: html }
			};
			onChange(syntheticEvent, html, html, []);
		},
		[onChange]
	);

	return (
		<MentionsInput
			placeholder={t('searchPlaceholder')}
			value={valueInputSearch ?? ''}
			onChange={handleMentionsInputChange}
			className="none-draggable-area w-full mr-[10px] bg-transparent text-theme-primary rounded-md focus-visible:!border-0 focus-visible:!outline-none focus-visible:[&>*]:!outline-none"
		>
			{/* From user filter: > */}
			<Mention
				trigger="@"
				title={t('prefixes.from')}
				data={handleSearchUserMention}
				displayTransform={(id: string, display: string) => `from:${display}`}
				renderSuggestion={(
					suggestion: MentionData,
					_search: string,
					_highlightedDisplay: React.ReactNode,
					_index?: number,
					focused?: boolean
				) => (
					<SelectItemUser
						search={valueHighlight}
						isFocused={focused || false}
						title={t('prefixes.from')}
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				appendSpaceOnAdd={true}
			/>

			<Mention
				trigger="~"
				title={t('prefixes.mentions')}
				data={handleSearchUserMention}
				displayTransform={(id: string, display: string) => `mentions:${display}`}
				renderSuggestion={(
					suggestion: MentionData,
					_search: string,
					_highlightedDisplay: React.ReactNode,
					_index?: number,
					focused?: boolean
				) => (
					<SelectItemUser
						search={valueHighlight}
						isFocused={focused || false}
						title={t('prefixes.mentions')}
						content={suggestion.display}
						onClick={() => setIsShowSearchOptions('')}
					/>
				)}
				appendSpaceOnAdd={true}
			/>

			<Mention
				trigger="&"
				title={t('prefixes.has')}
				data={(query: string) => {
					const queryLower = query.toLowerCase();
					return HAS_OPTIONS.filter((option) => option.display.toLowerCase().includes(queryLower));
				}}
				displayTransform={(id: string, display: string) => `has:${display}`}
				renderSuggestion={(
					suggestion: MentionData,
					search: string,
					_highlightedDisplay: React.ReactNode,
					_index?: number,
					focused?: boolean
				) => (
					<SelectItemUser
						search={search}
						isFocused={focused || false}
						title={t('prefixes.has')}
						content={suggestion.display}
						key={suggestion.id}
					/>
				)}
				appendSpaceOnAdd={true}
			/>
		</MentionsInput>
	);
};

export default memo(SearchInput);
