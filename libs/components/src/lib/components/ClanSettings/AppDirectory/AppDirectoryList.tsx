import { useTranslation } from 'react-i18next';
import AppDirectoryItem from './AppDirectoryItem';
import { ListGaming } from './listAppDirectory';

export interface IAppDirectoryList {
	cate: string;
	listAppDirectory: IAppDirectoryItem[];
}

export interface IAppDirectoryItem {
	botName: string;
	botCate?: string;
	botDescription: string;
	botNumber: number;
}

const AppDirectoryList = () => {
	const { t } = useTranslation('clanSettings');
	
	const listAppDirectory: IAppDirectoryList[] = [
		{
			cate: t('appDirectory.categories.gamingCompanion'),
			listAppDirectory: ListGaming
		},
		{
			cate: t('appDirectory.categories.popularTrending'),
			listAppDirectory: ListGaming
		},
		{
			cate: t('appDirectory.categories.serverMiniGames'),
			listAppDirectory: ListGaming
		},
		{
			cate: t('appDirectory.categories.rolePlayingFavorites'),
			listAppDirectory: ListGaming
		}
	];
	return (
		<>
			{listAppDirectory.map((listAppDirectByCate) => (
				<div key={listAppDirectByCate.cate} className="flex flex-col gap-4">
					<p className="font-semibold text-xl">{listAppDirectByCate.cate}</p>
					<div className="flex justify-between items-center gap-4">
						{listAppDirectByCate.listAppDirectory.map((appDirectoryItem, index) => (
							<AppDirectoryItem key={index} appDirectory={appDirectoryItem} />
						))}
					</div>
				</div>
			))}
		</>
	);
};

export default AppDirectoryList;
