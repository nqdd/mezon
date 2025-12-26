import { useEscapeKeyClose } from '@mezon/core';
import { useAppDispatch, voiceActions } from '@mezon/store';
import { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScreenListItems from './ScreenListItems';

type ScreenSelectionModalProps = {
	onClose: () => void;
};

const ScreenSelectionModal = memo(({ onClose }: ScreenSelectionModalProps) => {
	const { t } = useTranslation('screenShare');
	const modalRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();
	const [currentTab, setCurrentTab] = useState(0);
	const [audio, setAudio] = useState(false);
	const [selectedSource, setSelectedSource] = useState<string | null>(null);

	const TABS = [
		{ label: t('window'), value: 'window' },
		{ label: t('entireScreen'), value: 'screen' }
	];

	const handleClose = useCallback(() => {
		dispatch(voiceActions.setShowSelectScreenModal(false));
		onClose?.();
	}, [dispatch, onClose]);

	const handleShare = useCallback(() => {
		if (!selectedSource) return;

		dispatch(voiceActions.setShowSelectScreenModal(false));
		dispatch(
			voiceActions.setScreenSource({
				id: selectedSource,
				audio,
				mode: 'electron'
			})
		);
		dispatch(voiceActions.setShowScreen(true));
		onClose?.();
	}, [selectedSource, audio, dispatch, onClose]);

	useEscapeKeyClose(modalRef, handleClose);

	const handleStop = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	const handleToggleAudio = () => {
		setAudio(!audio);
	};

	const activeSource = TABS[currentTab]?.value || 'window';

	return (
		<div
			ref={modalRef}
			tabIndex={-1}
			onClick={handleClose}
			className="outline-none justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 focus:outline-none bg-black bg-opacity-50 dark:text-white text-black"
		>
			<div className="relative w-full max-w-[680px] bg-white dark:bg-[#2b2d31] rounded-lg shadow-2xl flex flex-col" onClick={handleStop}>
				<div className="px-6 pt-6 pb-4">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('chooseWhatToShare')}</h2>
				</div>

				<div className="px-6 border-b border-gray-200 dark:border-[#202225] flex gap-6">
					{TABS.map((tab, index) => {
						const isActive = currentTab === index;
						return (
							<button
								key={tab.value}
								onClick={() => {
									setCurrentTab(index);
									setSelectedSource(null);
								}}
								className={`relative pb-3 pt-2 text-sm font-medium transition-colors ${
									isActive
										? 'text-theme-primary dark:text-white'
										: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
								}`}
							>
								{tab.label}
								{isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theme-primary" />}
							</button>
						);
					})}
				</div>

				<div id="screen-selection-scroll-container" className="overflow-y-auto p-6 min-h-[352px] max-h-[352px] messages-scroll">
					<ScreenListItems
						onClose={onClose}
						source={activeSource}
						audio={audio}
						onSelect={(id) => setSelectedSource(id)}
						selectedId={selectedSource}
					/>
				</div>

				<div className="px-6 py-4 border-t border-gray-200 dark:border-[#202225] space-y-4">
					<label className="flex items-center justify-between cursor-pointer">
						<span className="text-sm text-gray-700 dark:text-gray-300">{t('alsoShareSystemAudio')}</span>
						<input
							type="checkbox"
							checked={audio}
							onChange={handleToggleAudio}
							className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-300 dark:bg-[#4f545c] transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all checked:bg-theme-primary checked:after:left-4 hover:bg-gray-400 dark:hover:bg-[#5d6269] checked:hover:bg-theme-primary/80 focus:outline-none focus-visible:outline-none"
						/>
					</label>

					<div className="flex justify-end gap-3">
						<button
							onClick={handleClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2f3136] border border-gray-300 dark:border-[#202225] rounded-md hover:bg-gray-50 dark:hover:bg-[#232428] hover:border-gray-400 dark:hover:border-[#2f3136] transition-colors"
						>
							{t('cancel')}
						</button>
						<button
							onClick={handleShare}
							disabled={!selectedSource}
							className={`px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2f3136] border border-gray-300 dark:border-[#202225] rounded-md transition-colors ${
								!selectedSource
									? 'cursor-not-allowed opacity-50'
									: 'hover:bg-gray-50 dark:hover:bg-[#232428] hover:border-gray-400 dark:hover:border-[#2f3136] cursor-pointer'
							}`}
						>
							{t('share')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ScreenSelectionModal;
