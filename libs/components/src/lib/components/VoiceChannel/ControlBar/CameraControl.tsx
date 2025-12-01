import { useLocalParticipant, useLocalParticipantPermissions, usePersistentUserChoices } from '@livekit/components-react';
import { useAppDispatch, voiceActions } from '@mezon/store';
import { Track } from 'livekit-client';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { BackgroundEffectsMenu } from './BackgroundEffectMenu';
import { MediaDeviceMenu } from './MediaDeviceMenu/MediaDeviceMenu';
import { TrackToggle } from './TrackToggle/TrackToggle';
import { trackSourceToProtocol } from './hooks/useControlBarPermissions';

interface CameraControlProps {
	isShowMember?: boolean;
	isExternalCalling?: boolean;
	saveUserChoices?: boolean;
	onDeviceError?: (error: Error) => void;
}

export const CameraControl = memo(({ isShowMember, isExternalCalling, saveUserChoices = true, onDeviceError }: CameraControlProps) => {
	const dispatch = useAppDispatch();
	const localParticipant = useLocalParticipant();
	const localPermissions = useLocalParticipantPermissions();

	const { userChoices, saveVideoInputDeviceId, saveVideoInputEnabled } = usePersistentUserChoices({
		preventSave: !saveUserChoices
	});

	useEffect(() => {
		if (typeof userChoices.videoEnabled === 'boolean') {
			dispatch(voiceActions.setShowCamera(userChoices.videoEnabled));
		}
	}, [dispatch, userChoices.videoEnabled]);

	const isSupport = useMemo(() => {
		const sender = RTCRtpSender.prototype as any;
		const supports =
			(typeof sender.createEncodedStreams === 'function' || typeof sender.createEncodedVideoStreams === 'function') &&
			typeof (window as any).VideoFrame === 'function';
		return supports;
	}, []);

	const canPublishCamera = useCallback(() => {
		if (!localPermissions) return false;
		return (
			localPermissions.canPublish &&
			(localPermissions.canPublishSources.length === 0 ||
				localPermissions.canPublishSources.includes(trackSourceToProtocol(Track.Source.Camera)))
		);
	}, [localPermissions]);

	const handleChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (!isUserInitiated) return;

			if (enabled && !canPublishCamera()) {
				console.warn('Cannot enable camera: insufficient permissions');
				return;
			}

			saveVideoInputEnabled(enabled);
			dispatch(voiceActions.setShowCamera(enabled));
		},
		[dispatch, saveVideoInputEnabled, canPublishCamera]
	);

	return (
		<div className="relative rounded-full bg-gray-300 dark:bg-black">
			<TrackToggle
				id="btn-meet-camera"
				className={`w-14 aspect-square max-md:w-10 max-md:p-2 !rounded-full flex justify-center items-center border-none dark:border-none ${isShowMember ? 'bg-zinc-500 dark:bg-zinc-900' : 'bg-zinc-700'}`}
				source={Track.Source.Camera}
				onChange={handleChange}
				onDeviceError={onDeviceError}
			/>
			<div className="lk-button-group-menu">
				<MediaDeviceMenu kind="videoinput" onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? 'default')} />
			</div>
			{isExternalCalling && isSupport && <BackgroundEffectsMenu participant={localParticipant.localParticipant} />}
		</div>
	);
});
