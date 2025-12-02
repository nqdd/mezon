import { computeMenuPosition, wasClickOutside } from '@livekit/components-core';
import { Icons } from '@mezon/ui';
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import type { ButtonHTMLAttributes } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MediaDeviceSelect } from './MediaDeviceSelect';

export interface MediaDeviceMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	kind?: MediaDeviceKind;
	initialSelection?: string;
	onActiveDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void;
	tracks?: Partial<Record<MediaDeviceKind, LocalAudioTrack | LocalVideoTrack | undefined>>;
	requestPermissions?: boolean;
}

export function MediaDeviceMenu({
	kind,
	initialSelection,
	onActiveDeviceChange,
	tracks,
	requestPermissions = false,
	...props
}: MediaDeviceMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [updateRequired, setUpdateRequired] = useState<boolean>(true);
	const [needPermissions, setNeedPermissions] = useState(requestPermissions);

	const handleActiveDeviceChange = (kind: MediaDeviceKind, deviceId: string) => {
		setIsOpen(false);
		onActiveDeviceChange?.(kind, deviceId);
	};

	const button = useRef<HTMLButtonElement>(null);
	const tooltip = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (isOpen) {
			setNeedPermissions(true);
		}
	}, [isOpen]);

	useLayoutEffect(() => {
		let cleanup: ReturnType<typeof computeMenuPosition> | undefined;
		if (button.current && tooltip.current && (devices || updateRequired)) {
			cleanup = computeMenuPosition(button.current, tooltip.current, (x, y) => {
				if (tooltip.current) {
					Object.assign(tooltip.current.style, { left: `${x}px`, top: `${y}px` });
				}
			});
		}
		setUpdateRequired(false);
		return () => {
			cleanup?.();
		};
	}, [button, tooltip, devices, updateRequired]);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (!tooltip.current) {
				return;
			}
			if (event.target === button.current) {
				return;
			}
			if (isOpen && wasClickOutside(tooltip.current, event)) {
				setIsOpen(false);
			}
		},
		[isOpen, tooltip, button]
	);

	useEffect(() => {
		document.addEventListener<'click'>('click', handleClickOutside);
		return () => {
			document.removeEventListener<'click'>('click', handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<>
			<button
				className="lk-button !w-5 !h-5 !p-2 !absolute !bottom-0 !left-[36px] !rounded-full !border-2 !border-solid bg-zinc-500 dark:bg-zinc-900 !border-zinc-600 dark:border-zinc-950"
				aria-pressed={isOpen}
				{...props}
				ref={button}
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
			>
				{isOpen ? (
					<Icons.VoiceArowUpIcon className="w-4 h-4 bg-white text-black rounded-full" />
				) : (
					<Icons.VoiceArowDownIcon className="w-4 h-4" />
				)}
				{props.children}
			</button>
			{!props.disabled && (
				<div className={`lk-device-menu bottom-0 h-fit !top-auto ${isOpen ? 'visible' : 'invisible'}`} ref={tooltip}>
					{kind ? (
						<MediaDeviceSelect
							initialSelection={initialSelection}
							onActiveDeviceChange={(deviceId) => handleActiveDeviceChange(kind, deviceId)}
							onDeviceListChange={setDevices}
							kind={kind}
							track={tracks?.[kind]}
							requestPermissions={needPermissions}
						/>
					) : (
						<>
							<div className="lk-device-menu-heading">Audio inputs</div>
							<MediaDeviceSelect
								kind="audioinput"
								onActiveDeviceChange={(deviceId) => handleActiveDeviceChange('audioinput', deviceId)}
								onDeviceListChange={setDevices}
								track={tracks?.audioinput}
								requestPermissions={needPermissions}
							/>
							<div className="lk-device-menu-heading">Video inputs</div>
							<MediaDeviceSelect
								kind="videoinput"
								onActiveDeviceChange={(deviceId) => handleActiveDeviceChange('videoinput', deviceId)}
								onDeviceListChange={setDevices}
								track={tracks?.videoinput}
								requestPermissions={needPermissions}
							/>
						</>
					)}
				</div>
			)}
		</>
	);
}
