import { useMaybeRoomContext, useMediaDeviceSelect } from '@livekit/components-react';
import { RoomEvent, type LocalAudioTrack, type LocalVideoTrack } from 'livekit-client';
import * as React from 'react';
import { mergeProps } from '../../lib/mergeProps';

/** @public */
export interface MediaDeviceSelectProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onError'> {
	kind: MediaDeviceKind;
	onActiveDeviceChange?: (deviceId: string) => void;
	onDeviceListChange?: (devices: MediaDeviceInfo[]) => void;
	onDeviceSelectError?: (e: Error) => void;
	initialSelection?: string;
	/** will force the browser to only return the specified device
	 * will call `onDeviceSelectError` with the error in case this fails
	 */
	exactMatch?: boolean;
	track?: LocalAudioTrack | LocalVideoTrack;
	/**
	 * this will call getUserMedia if the permissions are not yet given to enumerate the devices with device labels.
	 * in some browsers multiple calls to getUserMedia result in multiple permission prompts.
	 * It's generally advised only flip this to true, once a (preview) track has been acquired successfully with the
	 * appropriate permissions.
	 *
	 * @see {@link MediaDeviceMenu}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices | MDN enumerateDevices}
	 */
	requestPermissions?: boolean;
	onError?: (e: Error) => void;
}

/**
 * The `MediaDeviceSelect` list all media devices of one kind.
 * Clicking on one of the listed devices make it the active media device.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <MediaDeviceSelect kind='audioinput' />
 * </LiveKitRoom>
 * ```
 * @public
 */
export const MediaDeviceSelect = React.memo(
	/* @__PURE__ */ React.forwardRef<HTMLUListElement, MediaDeviceSelectProps>(function MediaDeviceSelect(
		{
			kind,
			initialSelection,
			onActiveDeviceChange,
			onDeviceListChange,
			onDeviceSelectError,
			exactMatch,
			track,
			requestPermissions,
			onError,
			...props
		}: MediaDeviceSelectProps,
		ref
	) {
		const room = useMaybeRoomContext();
		const previousActiveDeviceId = React.useRef<string | undefined>(undefined);
		const onActiveDeviceChangeRef = React.useRef(onActiveDeviceChange);

		React.useEffect(() => {
			onActiveDeviceChangeRef.current = onActiveDeviceChange;
		}, [onActiveDeviceChange]);

		const handleError = React.useCallback(
			(e: Error) => {
				if (room) {
					// awkwardly emit the event from outside of the room, as we don't have other means to raise a MediaDeviceError
					room.emit(RoomEvent.MediaDevicesError, e);
				}
				onError?.(e);
			},
			[room, onError]
		);
		const { devices, activeDeviceId, setActiveMediaDevice, className } = useMediaDeviceSelect({
			kind,
			room,
			track,
			requestPermissions,
			onError: handleError
		});

		React.useEffect(() => {
			if (typeof onDeviceListChange === 'function') {
				onDeviceListChange(devices);
			}
		}, [onDeviceListChange, devices]);

		React.useEffect(() => {
			if (activeDeviceId === previousActiveDeviceId.current) {
				return;
			}

			const hasChanged = previousActiveDeviceId.current !== undefined;
			previousActiveDeviceId.current = activeDeviceId;

			if (hasChanged && activeDeviceId) {
				onActiveDeviceChangeRef.current?.(activeDeviceId);
			}
		}, [activeDeviceId]);

		const handleActiveDeviceChange = async (deviceId: string) => {
			try {
				await setActiveMediaDevice(deviceId, { exact: exactMatch ?? true });
			} catch (e) {
				if (e instanceof Error) {
					onDeviceSelectError?.(e);
				} else {
					throw e;
				}
			}
		};
		// Merge Props
		const mergedProps = React.useMemo(
			() => mergeProps(props, { className }, { className: 'lk-list bg-zinc-800 dark:bg-zinc-900 rounded-lg shadow-lg p-1 min-w-[260px]' }),
			[className, props]
		);

		const hasDefault = !!devices.find((info) => info.label.toLowerCase().startsWith('default'));

		function isActive(deviceId: string, activeDeviceId: string, index: number) {
			return deviceId === activeDeviceId || (!hasDefault && index === 0 && activeDeviceId === 'default');
		}

		const isDeviceActive = (deviceId: string, currentActiveId: string, index: number) => {
			return isActive(deviceId, currentActiveId, index);
		};

		if (!devices?.length) return null;

		return (
			<ul ref={ref} {...mergedProps}>
				{devices.map((device, index) => {
					const active = isDeviceActive(device.deviceId, activeDeviceId, index);
					return (
						<li
							key={device.deviceId}
							id={device.deviceId}
							data-lk-active={active}
							aria-selected={active}
							role="option"
							className="w-full"
						>
							<button
								className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:hover:bg-zinc-800 rounded transition-colors"
								onClick={() => handleActiveDeviceChange(device.deviceId)}
							>
								<span className="flex-1 text-left truncate">{device.label}</span>
								<div className="ml-3 flex-shrink-0">
									{active ? (
										<div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
											<div className="w-1.5 h-1.5 rounded-full bg-white"></div>
										</div>
									) : (
										<div className="w-4 h-4 rounded-full border-2 border-zinc-400 dark:border-zinc-500"></div>
									)}
								</div>
							</button>
						</li>
					);
				})}
			</ul>
		);
	})
);
