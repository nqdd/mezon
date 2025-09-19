import { selectCurrentClanId, selectEmojiByClanId, settingClanStickerActions, useAppDispatch, useAppSelector } from '@mezon/store';
import { generateE2eId } from '@mezon/utils';
import type { ClanEmoji } from 'mezon-js';
import type { RefObject } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ModalErrorTypeUpload, ModalLayout, ModalOverData } from '../../../components';
import ModalSticker, { EGraphicType } from '../SettingSticker/ModalEditSticker';
import SettingEmojiList from './SettingEmojiList';

const SettingEmoji = ({ parentRef }: { parentRef: RefObject<HTMLDivElement> }) => {
	const { t } = useTranslation('clanSettings');
	const currentClanId = useSelector(selectCurrentClanId);
	const [openModal, setOpenModal] = useState(false);
	const [openModalType, setOpenModalType] = useState(false);
	const emojiList = useAppSelector((state) => selectEmojiByClanId(state, currentClanId || ''));
	const [selectedEmoji, setSelectedEmoji] = useState<ClanEmoji | null>(null);
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const handleOpenUpdateEmojiModal = (emoji: ClanEmoji) => {
		setSelectedEmoji(emoji);
		setIsOpenEditModal(true);
		dispatch(settingClanStickerActions.openModalInChild());
	};

	const handleCreateEmoji = () => {
		setSelectedEmoji(null);
		setIsOpenEditModal(true);
		dispatch(settingClanStickerActions.openModalInChild());
	};

	const handleCloseModal = useCallback(() => {
		setIsOpenEditModal(false);
		setTimeout(() => {
			dispatch(settingClanStickerActions.closeModalInChild());
			parentRef?.current?.focus();
		}, 0);
	}, []);

	return (
		<>
			<div className="flex flex-col gap-3 pb-[40px] 0 text-sm">
				<div className={'flex flex-col gap-2'}>
					<p className={''}>{t('emoji.description')}</p>
					<p className={'uppercase text-xs'}>{t('emoji.uploadRequirements')}</p>
					<ul className={'list-disc ml-[16px]'}>
						<li>{t('emoji.requirements.fileType')}</li>
						<li>{t('emoji.requirements.fileSize')}</li>
						<li>{t('emoji.requirements.dimensions')}</li>
						<li>{t('emoji.requirements.naming')}</li>
					</ul>
				</div>
				<div
					onClick={handleCreateEmoji}
					className="h-[38px] font-semibold rounded-lg btn-primary btn-primary-hover w-28 relative flex flex-row items-center justify-center cursor-pointer"
					data-e2e={generateE2eId('clan_page.settings.emoji.upload')}
				>
					{t('emoji.uploadEmoji')}
				</div>
			</div>

			<SettingEmojiList title={t('emoji.title')} emojiList={emojiList} onUpdateEmoji={handleOpenUpdateEmojiModal} />

			<ModalErrorTypeUpload open={openModalType} onClose={() => setOpenModalType(false)} />

			<ModalOverData open={openModal} onClose={() => setOpenModal(false)} />
			{isOpenEditModal && (
				<ModalLayout onClose={handleCloseModal}>
					<ModalSticker graphic={selectedEmoji} handleCloseModal={handleCloseModal} type={EGraphicType.EMOJI} />
				</ModalLayout>
			)}
		</>
	);
};

export default SettingEmoji;
