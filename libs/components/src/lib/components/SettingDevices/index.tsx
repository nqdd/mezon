import { Icons } from '@mezon/ui';
import { useTranslation } from 'react-i18next';

type SettingDevicesProps = {
	menuIsOpen: boolean;
};

const mockCurrentDevice = {
	id: '1',
	platform: 'WINDOWS',
	client: 'CLIENT',
	location: 'Da Nang, Da Nang, Vietnam',
	isCurrent: true
};

const mockOtherDevices = [
	{
		id: '2',
		platform: 'IOS',
		client: 'MEZON IOS',
		location: 'Hanoi, Hanoi, Vietnam',
		lastActive: '14 hours ago'
	},
	{
		id: '3',
		platform: 'WINDOWS',
		client: 'CLIENT',
		location: 'Hanoi, Hanoi, Vietnam',
		lastActive: '3 days ago'
	},
	{
		id: '4',
		platform: 'WINDOWS',
		client: 'CHROME',
		location: 'Da Nang, Da Nang, Vietnam',
		lastActive: '23 days ago'
	}
];

const DeviceIcon = ({ platform }: { platform: string }) => {
	if (platform === 'IOS' || platform === 'ANDROID') {
		return (
			<div className="w-12 h-12 rounded-full bg-theme-setting-nav flex items-center justify-center">
				<Icons.DeviceMobileIcon className="w-6 h-6 text-theme-primary-active" />
			</div>
		);
	}
	return (
		<div className="w-12 h-12 rounded-full bg-theme-setting-nav flex items-center justify-center">
			<Icons.DeviceDesktopIcon className="w-6 h-6 text-theme-primary-active" />
		</div>
	);
};

type DeviceItemProps = {
	platform: string;
	client: string;
	location: string;
	lastActive?: string;
	isCurrent?: boolean;
	onRemove?: () => void;
};

const DeviceItem = ({ platform, client, location, lastActive, isCurrent, onRemove }: DeviceItemProps) => {
	return (
		<div className="flex items-center justify-between py-4 border-b-theme-primary last:border-b-0">
			<div className="flex items-center gap-4">
				<DeviceIcon platform={platform} />
				<div>
					<div className="flex items-center gap-2">
						<span className="text-theme-primary-active font-semibold text-sm">{platform}</span>
						<span className="text-theme-primary-active text-sm">·</span>
						<span className="btn-primary text-xs px-2 py-0.5 rounded font-medium">{client}</span>
					</div>
					<div className="text-theme-primary text-sm mt-1">
						{location}
						{lastActive && <span> · {lastActive}</span>}
					</div>
				</div>
			</div>
			{!isCurrent && onRemove && (
				<button onClick={onRemove} className="text-theme-primary hover:text-red-500 transition-colors p-2" aria-label="Remove device">
					<Icons.CloseIcon className="w-5 h-5" />
				</button>
			)}
		</div>
	);
};

const SettingDevices = ({ menuIsOpen }: SettingDevicesProps) => {
	const { t } = useTranslation('setting');

	const handleRemoveDevice = (deviceId: string) => {};

	return (
		<div
			className={`overflow-y-auto flex flex-col flex-1 shrink w-full sbm:w-1/2 pt-[94px] pb-7 pr-[10px] sbm:pl-[40px] pl-[10px] overflow-x-hidden ${menuIsOpen === true ? 'sbm:min-w-[700px]' : ''} 2xl:min-w-[900px] max-w-[740px] hide-scrollbar z-20`}
		>
			<h1 className="text-xl font-semibold tracking-wider text-theme-primary-active mb-6">{t('accountSettings.device')}</h1>

			<div className="mb-8">
				<p className="text-theme-primary text-sm leading-relaxed">{t('deviceSettings.description1')}</p>
				<p className="text-theme-primary text-sm leading-relaxed mt-4">{t('deviceSettings.description2')}</p>
			</div>

			<div className="mb-8">
				<h2 className="text-theme-primary-active font-semibold text-lg mb-4">{t('deviceSettings.currentDevice')}</h2>
				<DeviceItem
					platform={mockCurrentDevice.platform}
					client={mockCurrentDevice.client}
					location={mockCurrentDevice.location}
					isCurrent={true}
				/>
			</div>

			<div className="mb-8">
				<h2 className="text-theme-primary-active font-semibold text-lg mb-4">{t('deviceSettings.otherDevices')}</h2>
				<div>
					{mockOtherDevices.map((device) => (
						<DeviceItem
							key={device.id}
							platform={device.platform}
							client={device.client}
							location={device.location}
							lastActive={device.lastActive}
							onRemove={() => handleRemoveDevice(device.id)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default SettingDevices;
