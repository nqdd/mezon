import { usePersistentUserChoices } from '@livekit/components-react';
import { selectShowCamera, selectShowMicrophone, useAppSelector } from '@mezon/store';
import { memo, useEffect } from 'react';

export const VoiceTrackState = memo(() => {
	const showMicrophone = useAppSelector(selectShowMicrophone);
	const showCamera = useAppSelector(selectShowCamera);
	const { saveAudioInputEnabled, saveVideoInputEnabled, userChoices } = usePersistentUserChoices();

	useEffect(() => {
		if (!showMicrophone && userChoices.audioEnabled) {
			saveAudioInputEnabled(false);
		}

		if (!showCamera && userChoices.videoEnabled) {
			saveVideoInputEnabled(false);
		}
	}, [showMicrophone, showCamera, userChoices.audioEnabled, userChoices.videoEnabled, saveAudioInputEnabled, saveVideoInputEnabled]);

	return null;
});

VoiceTrackState.displayName = 'VoiceTrackState';
