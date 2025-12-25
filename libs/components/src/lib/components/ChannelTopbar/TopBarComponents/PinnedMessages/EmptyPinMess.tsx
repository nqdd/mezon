import { useTranslation } from 'react-i18next';

const EmptyPinMess = () => {
	const { t } = useTranslation('channelTopbar');

	return (
		<div className="flex flex-col items-center justify-center ">
			<div className="flex flex-col items-center py-16 px-7">
				<p className="text-base font-medium text-center">{t('pinnedMessages.emptyTitle')}</p>
			</div>
		</div>
	);
};

export default EmptyPinMess;
