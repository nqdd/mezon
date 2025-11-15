import { generateE2eId } from '@mezon/utils';
import { useTranslation } from 'react-i18next';

export type ModalAskChangeChannelProps = {
	onReset: () => void;
	onSave: () => void;
	className?: string;
};

const ModalAskChangeChannel = (props: ModalAskChangeChannelProps) => {
	const { onReset, onSave, className } = props;
	const { t } = useTranslation('channelSetting');

	return (
		<div
			className={`flex flex-row gap-2  bg-gray-500 absolute max-w-[815px] w-full left-1/2 translate-x-[-50%] bottom-4 min-w-96 h-fit p-3 rounded transform text-white ${className}`}
		>
			<div className="flex-1 flex items-center text-nowrap">
				<p className={`text-[15px] ${className ? 'hidden' : ''}`}>{t('unsavedChanges.warning')}</p>
			</div>
			<div className="flex flex-row justify-end gap-3">
				<button
					className="text-[15px] bg-gray-600 rounded-[4px] p-[8px]"
					onClick={onReset}
					data-e2e={generateE2eId('channel_setting_page.permissions.modal.ask_change.button.reset')}
				>
					{t('unsavedChanges.reset')}
				</button>
				<button
					className="text-[15px] ml-auto bg-blue-600 rounded-[4px] p-[8px] text-nowrap"
					onClick={onSave}
					data-e2e={generateE2eId('channel_setting_page.permissions.modal.ask_change.button.save_changes')}
				>
					{t('unsavedChanges.saveChanges')}
				</button>
			</div>
		</div>
	);
};

export default ModalAskChangeChannel;
