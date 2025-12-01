import {
	selectGroupCallJoined,
	selectShowScreen,
	selectShowSelectScreenModal,
	selectVoiceFullScreen,
	useAppDispatch,
	voiceActions
} from '@mezon/store';
import isElectron from 'is-electron';
import { Track } from 'livekit-client';
import { memo, useCallback, useEffect } from 'react';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ScreenSelectionModal from '../../ScreenSelectionModal/ScreenSelectionModal';
import { CameraControl } from './CameraControl';
import { FullscreenControl } from './FullscreenControl';
import { LeaveButton } from './LeaveButton';
import { MicrophoneControl } from './MicrophoneControl';
import { NoiseSuppressionControl } from './NoiseSuppressionControl';
import { PopoutControl } from './PopoutControl';
import { ReactionControls } from './ReactionControls';
import { ScreenShareControl } from './ScreenShareControl';

import { useControlBarPermissions } from './hooks/useControlBarPermissions';
import { useViewControls } from './hooks/useViewControls';

export type ControlBarControls = {
	microphone?: boolean;
	camera?: boolean;
	screenShare?: boolean;
	leave?: boolean;
	noiseSuppression?: boolean;
	backgroundEffect?: boolean;
	emoji?: boolean;
	sound?: boolean;
	popout?: boolean;
	fullscreen?: boolean;
};

export interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
	onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
	saveUserChoices?: boolean;
	controls?: ControlBarControls;
	onLeaveRoom: (self?: boolean) => void;
	onFullScreen: () => void;
	isExternalCalling?: boolean;
	isShowMember?: boolean;
	isGridView?: boolean;
}

const ControlBar = ({
	saveUserChoices = true,
	controls,
	onDeviceError,
	onLeaveRoom,
	onFullScreen,
	isExternalCalling,
	isShowMember = true,
	isGridView = true
}: ControlBarProps) => {
	const dispatch = useAppDispatch();

	const isGroupCall = useSelector(selectGroupCallJoined);
	const isDesktop = isElectron();

	const showScreen = useSelector(selectShowScreen);
	const isFullScreen = useSelector(selectVoiceFullScreen);
	const isShowSelectScreenModal = useSelector(selectShowSelectScreenModal);

	const visibleControls = useControlBarPermissions(controls);
	const { isOpenPopOut, togglePopout } = useViewControls();

	const browserSupportsScreenSharing = supportsScreenSharing();

	const [openScreenSelection, closeScreenSelection] = useModal(() => {
		return <ScreenSelectionModal onClose={closeScreenSelection} />;
	});

	useEffect(() => {
		if (isShowSelectScreenModal) {
			openScreenSelection();
		}
	}, [isShowSelectScreenModal, openScreenSelection]);

	const handleLeaveRoom = useCallback(() => {
		onLeaveRoom(true);
	}, [onLeaveRoom]);

	const handleOpenScreenSelection = useCallback(async () => {
		if (isDesktop) {
			if (typeof document !== 'undefined' && document.fullscreenElement) {
				try {
					await document.exitFullscreen();
				} catch (_e) {
					void 0;
				}
				dispatch(voiceActions.setFullScreen(false));
			} else if (isFullScreen) {
				onFullScreen?.();
			}

			if (!showScreen) {
				dispatch(voiceActions.setShowSelectScreenModal(true));
			} else {
				dispatch(voiceActions.setShowScreen(false));
			}
		}
	}, [dispatch, isDesktop, isFullScreen, onFullScreen, showScreen]);

	return (
		<div className="lk-control-bar !flex !justify-between !border-none !bg-transparent max-md:flex-col">
			<ReactionControls isGroupCall={isGroupCall} isGridView={isGridView} isShowMember={isShowMember} className="max-md:hidden" />

			<div className="flex justify-center gap-3 flex-1 max-md:scale-75">
				{visibleControls.microphone && (
					<MicrophoneControl
						isShowMember={isShowMember}
						saveUserChoices={saveUserChoices}
						onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Microphone, error })}
					/>
				)}

				{visibleControls.microphone && isExternalCalling && <NoiseSuppressionControl isShowMember={isShowMember} />}
				{visibleControls.camera && (
					<CameraControl
						isShowMember={isShowMember}
						isExternalCalling={isExternalCalling}
						saveUserChoices={saveUserChoices}
						onDeviceError={(error) => onDeviceError?.({ source: Track.Source.Camera, error })}
					/>
				)}

				{visibleControls.screenShare && browserSupportsScreenSharing && (
					<ScreenShareControl
						showScreen={showScreen}
						isShowMember={isShowMember}
						saveUserChoices={saveUserChoices}
						onDeviceError={(error) => onDeviceError?.({ source: Track.Source.ScreenShare, error })}
						onDesktopScreenShare={handleOpenScreenSelection}
					/>
				)}

				{visibleControls.leave && <LeaveButton onLeaveRoom={handleLeaveRoom} />}
			</div>

			<div className="flex justify-end gap-4 max-md:hidden">
				{!isExternalCalling && (
					<PopoutControl isGridView={isGridView} isShowMember={isShowMember} isOpenPopOut={isOpenPopOut} onToggle={togglePopout} />
				)}
				<FullscreenControl isGridView={isGridView} isShowMember={isShowMember} isFullScreen={isFullScreen} onToggle={onFullScreen} />
			</div>
		</div>
	);
};

export default memo(ControlBar);

const supportsScreenSharing = () => {
	return typeof navigator !== 'undefined' && navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
};
