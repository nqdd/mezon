import { useAppDispatch, voiceActions } from '@mezon/store';
import { requestMediaPermission, useMediaPermissions } from '@mezon/utils';
import { useCallback } from 'react';

export function useTrackToggles(showCamera: boolean, showMicrophone: boolean) {
	const dispatch = useAppDispatch();
	const { hasCameraAccess, hasMicrophoneAccess } = useMediaPermissions();

	const handleRequestCameraPermission = useCallback(async () => {
		const permissionStatus = await requestMediaPermission('video');
		if (permissionStatus === 'granted') {
			dispatch(voiceActions.setShowCamera(true));
		}
	}, [dispatch]);

	const handleRequestMicrophonePermission = useCallback(async () => {
		const permissionStatus = await requestMediaPermission('audio');
		if (permissionStatus === 'granted') {
			dispatch(voiceActions.setShowMicrophone(true));
		}
	}, [dispatch]);

	const microphoneOnChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (!isUserInitiated) return;

			if (enabled !== showMicrophone) {
				if (!hasMicrophoneAccess && enabled) {
					handleRequestMicrophonePermission();
				} else {
					dispatch(voiceActions.setShowMicrophone(enabled));
				}
			}
		},
		[hasMicrophoneAccess, showMicrophone, handleRequestMicrophonePermission, dispatch]
	);

	const cameraOnChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (!isUserInitiated) return;

			if (enabled !== showCamera) {
				if (!hasCameraAccess && enabled) {
					handleRequestCameraPermission();
				} else {
					dispatch(voiceActions.setShowCamera(enabled));
				}
			}
		},
		[showCamera, hasCameraAccess, handleRequestCameraPermission, dispatch]
	);

	const onScreenShareChange = useCallback(
		(enabled: boolean, isUserInitiated: boolean) => {
			if (!isUserInitiated) return;

			if (enabled) {
				dispatch(voiceActions.setFullScreen(false));
			}

			dispatch(voiceActions.setShowScreen(enabled));
		},
		[dispatch]
	);

	return {
		microphoneOnChange,
		cameraOnChange,
		onScreenShareChange
	};
}
