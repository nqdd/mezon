import { voiceActions } from '@mezon/store';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type ScreenItemsProps = {
	id: string;
	name: string;
	thumbnail: string;
	audio: boolean;
	onClose?: () => void;
	onSelect?: (id: string) => void;
	isSelected?: boolean;
};

const ScreenItems = memo(({ id, name, thumbnail, onClose, audio, onSelect, isSelected }: ScreenItemsProps) => {
	const dispatch = useDispatch();
	const [isSelecting, setIsSelecting] = useState(false);
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		setImageError(false);
	}, [thumbnail]);

	const handleClick = useCallback(() => {
		if (isSelecting) return;

		if (onSelect) {
			onSelect(id);
		} else {
			setIsSelecting(true);
			dispatch(voiceActions.setShowSelectScreenModal(false));
			dispatch(
				voiceActions.setScreenSource({
					id,
					audio,
					mode: 'electron'
				})
			);
			dispatch(voiceActions.setShowScreen(true));
			onClose?.();
		}
	}, [id, dispatch, onClose, audio, isSelecting, onSelect]);

	return (
		<div
			onClick={handleClick}
			className={`group relative overflow-hidden flex flex-col rounded-lg border-2 transition-all duration-200 ${
				isSelected
					? 'border-theme-primary shadow-lg ring-2 ring-theme-primary/20'
					: 'border-gray-200 dark:border-[#202225] hover:border-theme-primary/50'
			} ${isSelecting ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
		>
			<div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100 dark:bg-[#1E1F22]">
				{imageError ? (
					<div className="w-full h-full flex items-center justify-center">
						<svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				) : (
					<img
						className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
						src={thumbnail}
						alt={name}
						onError={() => setImageError(true)}
					/>
				)}
				{isSelecting && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/50">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
					</div>
				)}
			</div>
			<div className="p-3 bg-white dark:bg-[#2f3136] rounded-b-lg">
				<div className="flex items-center gap-2">
					<p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{name}</p>
				</div>
			</div>
		</div>
	);
});

export default ScreenItems;
