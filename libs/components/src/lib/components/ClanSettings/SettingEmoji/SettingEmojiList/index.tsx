import type { ClanEmoji } from 'mezon-js';
import { useTranslation } from 'react-i18next';
import SettingEmojiItem from '../SettingEmojiItem';

type SettingEmojiListProps = {
	title: string;
	emojiList: ClanEmoji[];
	onUpdateEmoji: (emoji: ClanEmoji) => void;
};

const SettingEmojiList = ({ title, emojiList, onUpdateEmoji }: SettingEmojiListProps) => {
	const { t } = useTranslation('clanEmojiSetting');
	return (
		<div className={'flex flex-col gap-3 pb-[60px]'}>
			<div className={'flex items-center flex-row w-full '}>
				<p className={'min-w-14  text-xs font-bold '}>{t('image')}</p>
				<p className={'flex-1 pl-5 text-xs font-bold'}>{t('name')}</p>
				<p className={'flex-1 flex text-xs font-bold'}>{t('uploadedBy')}</p>
			</div>
			<div className={'flex flex-col w-full'}>
				{emojiList.map((emoji) => (
					<SettingEmojiItem emoji={emoji} key={emoji.id} onUpdateEmoji={onUpdateEmoji} />
				))}
			</div>
		</div>
	);
};

export default SettingEmojiList;
