import { useTranslation } from 'react-i18next';

const EmptyPinMess = () => {
	const { t } = useTranslation('channelTopbar');

	return (
		<div className="flex flex-col items-center justify-center ">
			<div className="flex flex-col items-center py-16 px-7">
				<p className="text-base font-medium text-center">{t('pinnedMessages.emptyTitle')}</p>
			</div>
			<div className="flex flex-col items-center h-[106px]  p-4 w-full border-t-theme-primary">
				<h2 className="text-sm text-[#2DC770] font-bold mb-2">{t('pinnedMessages.protip')}</h2>
				<p className="text-sm font-normal  text-center">{t('pinnedMessages.emptyDescription')}</p>
			</div>
		</div>
	);
};

export default EmptyPinMess;
