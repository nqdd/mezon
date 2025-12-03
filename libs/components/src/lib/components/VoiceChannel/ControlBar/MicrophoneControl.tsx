import { usePersistentUserChoices } from '@livekit/components-react';
import { useAppDispatch, voiceActions } from '@mezon/store';
import { Track } from 'livekit-client';
import { memo, useCallback, useEffect } from 'react';
import { MediaDeviceMenu } from './MediaDeviceMenu/MediaDeviceMenu';
import { TrackToggle } from './TrackToggle/TrackToggle';

interface MicrophoneControlProps {
	isShowMember?: boolean;
	saveUserChoices?: boolean;
	onDeviceError?: (error: Error) => void;
}

export const MicrophoneControl = memo(({ isShowMember, saveUserChoices = true, onDeviceError }: MicrophoneControlProps) => {
	const dispatch = useAppDispatch();
	const { userChoices, saveAudioInputDeviceId, saveAudioInputEnabled } = usePersistentUserChoices({
		preventSave: !saveUserChoices
	});

	useEffect(() => {
		if (typeof userChoices.audioEnabled === 'boolean') {
			dispatch(voiceActions.setShowMicrophone(userChoices.audioEnabled));
		}
	}, [dispatch, userChoices.audioEnabled]);

	const handleChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (!isUserInitiated) return;

			saveAudioInputEnabled(enabled);
			dispatch(voiceActions.setShowMicrophone(enabled));
		},
		[dispatch, saveAudioInputEnabled]
	);

	return (
		<div className="relative rounded-full bg-gray-300 dark:bg-black">
			<TrackToggle
				id="btn-meet-micro"
				className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
				source={Track.Source.Microphone}
				onChange={handleChange}
				onDeviceError={onDeviceError}
			/>
			<div className="lk-button-group-menu">
				<MediaDeviceMenu kind="audioinput" onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? 'default')} />
			</div>
		</div>
	);
});
