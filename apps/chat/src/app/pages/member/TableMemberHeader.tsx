import { Icons } from '@mezon/ui';
import { useTranslation } from 'react-i18next';

const TableMemberHeader = () => {
	const { t } = useTranslation('memberTable');
	return (
		<div className="flex flex-row justify-between items-center px-4 h-12 shadow border-b-theme-primary">
			<div className="flex-3 p-1">
				<span className="text-xs font-bold uppercase">{t('headers.name')}</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs font-bold uppercase">{t('headers.memberSince')}</span>
			</div>
			<div className="flex-1 p-1 text-center">
				<span className="text-xs font-bold uppercase">{t('headers.joinedMezon')}</span>
			</div>
			<div className="flex-2 flex flex-row gap-1 p-1 justify-center cursor-pointer">
				<span className="text-xs font-bold uppercase select-none">{t('headers.roles')}</span>
				<Icons.FiltersIcon className="rotate-90" />
			</div>
			<div className="flex-1 flex flex-row gap-1 p-1 justify-center cursor-pointer">
				<span className="text-xs font-bold uppercase select-none">{t('headers.signals')}</span>
				<Icons.FiltersIcon className="rotate-90" />
			</div>
		</div>
	);
};

export default TableMemberHeader;
