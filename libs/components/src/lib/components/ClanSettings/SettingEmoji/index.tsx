import { selectCurrentClanId, selectEmojiByClanId, settingClanStickerActions, useAppDispatch, useAppSelector } from '@mezon/store';
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
					<p className="font-bold text-xs uppercase text-theme-primary-active">{t('emoji.uploadInstructions')}</p>

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
					className=" font-[500] capitalize disabled:opacity-50 disabled:cursor-not-allowed ease-linear transition-all duration-150  px-2 py-2.5 btn-primary btn-primary-hover rounded-lg w-28 cursor-pointer text-center max-w-max"
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
