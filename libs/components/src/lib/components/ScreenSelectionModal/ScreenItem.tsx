import { voiceActions } from '@mezon/store';
import { memo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

type ScreenItemsProps = {
	id: string;
	name: string;
	thumbnail: string;
	audio: boolean;
	onClose?: () => void;
};

const ScreenItems = memo(({ id, name, thumbnail, onClose, audio }: ScreenItemsProps) => {
	const dispatch = useDispatch();
	const [isSelecting, setIsSelecting] = useState(false);

	const selectStreamScreen = useCallback(async () => {
		if (isSelecting) return;

		setIsSelecting(true);
		try {
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
		} catch (error) {
			setIsSelecting(false);
		}
	}, [id, dispatch, onClose, audio, isSelecting]);

	return (
		<div
			onClick={() => selectStreamScreen()}
			className={`h-40 overflow-hidden flex flex-col gap-2 ${isSelecting ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
		>
			<img className="w-full h-[136px] object-cover" src={thumbnail} alt={thumbnail} />
			<p className="text-base h-4 truncate leading-4">{name}</p>
		</div>
	);
});

export default ScreenItems;
