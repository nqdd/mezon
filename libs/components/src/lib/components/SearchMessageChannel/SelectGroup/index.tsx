import { Icons } from '@mezon/ui';
import { useTranslation } from 'react-i18next';

type SelectGroupProps = {
	groupName?: string;
	children?: React.ReactNode;
	isSearch?: boolean;
};

const SelectGroup = ({ groupName, children, isSearch }: SelectGroupProps) => {
	const { t } = useTranslation('searchMessageChannel');
	return (
		<div className="first:mt-0 mt-3 mx-3 border-b-theme-primary last:border-b-0 last:bottom-b-0 pb-3 last:pb-0">
			<div className="flex items-center justify-between pb-2">
				<h3 className="px-2 text-xs font-bold uppercase">{groupName}</h3>
				<div className="relative">
					<button title={t('learnMore')}>
						<Icons.Help defaultSize="w-4 h-4" />
					</button>
				</div>
			</div>
			{children}
		</div>
	);
};

export default SelectGroup;
