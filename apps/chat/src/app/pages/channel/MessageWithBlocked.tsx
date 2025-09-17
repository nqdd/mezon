import { useTranslation } from 'react-i18next';

export default function MessageWithBlocked() {
	const { t } = useTranslation('common');
	return (
		<div className="flex px-5 py-3 mx-4 my-[6px] rounded-md bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500">
			<span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{t('blockedMessage')}</span>
		</div>
	);
}
