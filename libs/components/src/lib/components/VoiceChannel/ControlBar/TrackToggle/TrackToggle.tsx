import type { CaptureOptionsBySource, ToggleSource } from '@livekit/components-core';
import { useTrackToggle } from '@livekit/components-react';
import { Icons } from '@mezon/ui';
import type { TrackPublishOptions } from 'livekit-client';
import { Track } from 'livekit-client';
import type { ButtonHTMLAttributes, ForwardedRef, ReactNode, RefAttributes } from 'react';
import React, { forwardRef } from 'react';

export interface TrackToggleProps<T extends ToggleSource> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
	source: T;
	initialState?: boolean;
	onChange?: (enabled: boolean, isUserInitiated: boolean) => void;
	captureOptions?: CaptureOptionsBySource<T>;
	publishOptions?: TrackPublishOptions;
	onDeviceError?: (error: Error) => void;
}

export const TrackToggle: <T extends ToggleSource>(props: TrackToggleProps<T> & RefAttributes<HTMLButtonElement>) => ReactNode = forwardRef(
	function TrackToggle<T extends ToggleSource>({ ...props }: TrackToggleProps<T>, ref: ForwardedRef<HTMLButtonElement>) {
		const { buttonProps, enabled } = useTrackToggle(props);
		const [isClient, setIsClient] = React.useState(false);
		React.useEffect(() => {
			setIsClient(true);

			const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;

			navigator.mediaDevices.getDisplayMedia = async function (...args) {
				console.warn('🖥️ [LiveKit] Requesting display media...', args);

				try {
					const stream = await originalGetDisplayMedia.apply(this, args);
					console.warn('✅ [LiveKit] Display media granted:', stream);

					// Log chi tiết track để debug trên macOS
					const videoTrack = stream.getVideoTracks()[0];
					if (videoTrack) {
						const settings = videoTrack.getSettings();
						console.warn('🎥 Track settings:', settings);
					}

					return stream;
				} catch (err: any) {
					console.error('❌ [LiveKit] getDisplayMedia failed:', err);

					// Log cụ thể cho macOS
					if (err?.name === 'NotAllowedError') {
						console.error('🚫 User denied screen capture permission.');
					} else if (err?.name === 'NotFoundError') {
						console.error('📁 No display source found.');
					} else if (err?.name === 'AbortError') {
						console.error('❗ User closed the picker or canceled selection.');
					} else if (err?.name === 'NotReadableError') {
						console.error('⚠️ macOS Screen Recording permission might be missing.');
					} else {
						console.error('🧩 Unknown error:', err);
					}
					throw err;
				}
			};

			return () => {
				navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
			};
		}, []);

		return (
			isClient && (
				<button ref={ref} {...buttonProps}>
					{getSourceIcon(props.source, enabled)}
					{props.children}
				</button>
			)
		);
	}
);

export function getSourceIcon(source: Track.Source, enabled: boolean) {
	switch (source) {
		case Track.Source.Microphone:
			return enabled ? <Icons.VoiceMicIcon scale={1.3} /> : <Icons.VoiceMicDisabledIcon scale={1.3} />;
		case Track.Source.Camera:
			return enabled ? <Icons.VoiceCameraIcon scale={1.5} /> : <Icons.VoiceCameraDisabledIcon scale={1.5} />;
		case Track.Source.ScreenShare:
			return enabled ? <Icons.VoiceScreenShareStopIcon /> : <Icons.VoiceScreenShareIcon />;
		default:
			return undefined;
	}
}
