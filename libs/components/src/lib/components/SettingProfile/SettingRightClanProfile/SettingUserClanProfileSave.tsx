import { getSelectedRoleId } from '@mezon/store';
import { ButtonLoading } from '@mezon/ui';
import { generateE2eId } from '@mezon/utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export type ModalSettingSave = {
	flagOption: boolean;
	handleClose: () => void;
	handleUpdateUser: () => Promise<void>;
};
export type SettingUserClanProfileSaveProps = {
	PropsSave: ModalSettingSave;
};

export const SettingUserClanProfileSave = (props: SettingUserClanProfileSaveProps) => {
	const { PropsSave } = props;
	const clickRole = useSelector(getSelectedRoleId);
	const { t } = useTranslation('profileSetting');
	const handleSaveChanges = async () => {
		await PropsSave.handleUpdateUser();
	};
	return PropsSave.flagOption || clickRole === 'New Role' ? (
		<div
			className="flex flex-row gap-2 dark:bg-bgProfileBody bg-bgLightSecondary text-theme-primary text-sm font-medium absolute max-w-[815px] w-[94%] md:w-full left-1/2 translate-x-[-50%] bottom-2 min-w-96 h-fit p-2.5 rounded transform z-10 shadow-sm dark:shadow-gray-400 shadow-gray-600"
			data-e2e={generateE2eId('user_setting.profile.clan_profile')}
		>
			<div className="flex-1 flex items-center">
				<p className="text-base">{t('unsavedChangesWarning')}</p>
			</div>
			<div className="flex flex-row justify-end gap-3">
				<button
					className="rounded px-4 py-1.5 hover:underline"
					onClick={() => {
						PropsSave.handleClose();
					}}
					data-e2e={generateE2eId('button.base')}
				>
					{t('reset')}
				</button>
				<ButtonLoading
					className="ml-auto btn-primary btn-primary-hover  rounded-lg px-4 py-1.5 text-nowrap "
					label={t('saveChanges')}
					onClick={handleSaveChanges}
				/>
			</div>
		</div>
	) : null;
};
