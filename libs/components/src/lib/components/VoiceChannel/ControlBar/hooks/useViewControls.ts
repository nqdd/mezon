import { selectVoiceOpenPopOut } from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export function useViewControls() {
	const isOpenPopOut = useSelector(selectVoiceOpenPopOut);

	const togglePopout = useCallback(async () => {
		const video = document.getElementById('focusTrack') as HTMLVideoElement | null;
		if (video) {
			try {
				if (document.pictureInPictureElement) {
					await document.exitPictureInPicture();
				} else {
					await video.requestPictureInPicture();
				}
			} catch (err) {
				console.error('PiP error:', err);
			}
		} else {
			toast.warning('Please select a video track to popout !');
		}
	}, []);

	return {
		isOpenPopOut,
		togglePopout
	};
}
