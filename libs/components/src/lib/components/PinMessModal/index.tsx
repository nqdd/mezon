import { ColorRoleProvider, useEscapeKeyClose } from '@mezon/core';
import { selectAllAccount, selectMemberClanByUserId2, useAppSelector } from '@mezon/store';
import { generateE2eId, IMessageWithUser, KEY_KEYBOARD } from '@mezon/utils';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MessageWithUser from '../MessageWithUser';

type ModalAddPinMessProps = {
	mess: IMessageWithUser;
	mode: number;
	channelLabel: string;
	closeModal: () => void;
	handlePinMessage: () => void;
};
export const ModalAddPinMess = (props: ModalAddPinMessProps) => {
	const { mess, channelLabel, closeModal, handlePinMessage, mode } = props;
	const { t } = useTranslation('pinMessage');
	const userId = useSelector(selectAllAccount)?.user?.id;
	const currentClanUser = useAppSelector((state) => selectMemberClanByUserId2(state, userId as string));

	const handlePinMessageAndCloseModal = () => {
		handlePinMessage();
		closeModal();
	};

	useEffect(() => {
		const handleEnterKey = (event: KeyboardEvent) => {
			if (event.keyCode === KEY_KEYBOARD.ENTER) {
				handlePinMessageAndCloseModal();
			}
		};

		document.addEventListener('keydown', handleEnterKey);
		return () => {
			document.removeEventListener('keydown', handleEnterKey);
		};
	}, [handlePinMessageAndCloseModal]);

	const modalRef = useRef<HTMLDivElement>(null);

	useEscapeKeyClose(modalRef, closeModal);

	return (
		<div
			ref={modalRef}
			tabIndex={-1}
			className="w-[100vw] h-[100vh] overflow-hidden fixed top-0 left-0 z-50 bg-black bg-opacity-80 flex flex-row justify-center items-center"
		>
			<div className="w-fit h-fit text-theme-primary bg-theme-setting-primary rounded-lg flex-col justify-start  items-start gap-3 inline-flex overflow-hidden max-w-[440px]">
				<div className=" max-w-full">
					<div className="p-4 pb-0">
						<h3 className="font-semibold pb-4 text-xl text-theme-primary-active">{t('modal.title')}</h3>
						<p>{t('modal.description', { channelLabel })}</p>
					</div>
					<div className="p-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
						<ColorRoleProvider>
							<MessageWithUser
								isSearchMessage={true} // to correct size youtube emmbed
								allowDisplayShortProfile={false}
								message={mess}
								mode={mode}
								isMention={true}
								isShowFull={true}
								user={currentClanUser}
							/>
						</ColorRoleProvider>
					</div>
					<div className="w-full  p-4 flex justify-end gap-x-4 bg-theme-setting-nav">
						<button onClick={closeModal} className="px-4 py-2 hover:underline rounded" data-e2e={generateE2eId('chat.message_action_modal.confirm_modal.button.cancel')}>
							{t('modal.cancel')}
						</button>
						<button
							data-e2e={generateE2eId('chat.message_action_modal.confirm_modal.button.confirm')}
							onClick={handlePinMessageAndCloseModal}
							className="px-4 py-2 hover:bg-opacity-80 rounded-lg btn-primary-hover btn-primary font-medium"
						>
							{t('modal.confirm')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
