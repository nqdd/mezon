import { ipcMain, shell, systemPreferences } from 'electron';

import { CHECK_PERMISSION_CAMERA, CHECK_PERMISSION_MICROPHONE, REQUEST_PERMISSION_CAMERA, REQUEST_PERMISSION_MICROPHONE } from './events/constants';

export default function setupRequestPermission() {
	const openPrivacySettings = async (type: 'microphone' | 'camera') => {
		try {
			if (process.platform === 'darwin') {
				type OpenSystemPreferences = (pane: string, section?: string) => Promise<boolean>;
				const openSystemPreferences = (systemPreferences as unknown as { openSystemPreferences?: OpenSystemPreferences })
					.openSystemPreferences;

				if (typeof openSystemPreferences === 'function') {
					const pane = 'privacy';
					const section = type === 'microphone' ? 'Microphone' : 'Camera';
					const opened = await openSystemPreferences(pane, section);
					if (opened) {
						return;
					}
				}

				const path =
					type === 'microphone'
						? 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone'
						: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Camera';
				await shell.openExternal(path);
			}
		} catch (error) {
			console.error('Failed to open privacy settings', error);
		}
	};

	ipcMain.handle(REQUEST_PERMISSION_MICROPHONE, async () => {
		if (process.platform === 'darwin') {
			const beforeStatus = systemPreferences.getMediaAccessStatus('microphone');
			let status = beforeStatus;
			if (beforeStatus !== 'granted') {
				const granted = await systemPreferences.askForMediaAccess('microphone');
				status = granted ? 'granted' : systemPreferences.getMediaAccessStatus('microphone');

				if (!granted && status !== 'granted') {
					await openPrivacySettings('microphone');
				}
			}
			return status;
		}
		return 'prompt';
	});

	ipcMain.handle(REQUEST_PERMISSION_CAMERA, async () => {
		if (process.platform === 'darwin') {
			const beforeStatus = systemPreferences.getMediaAccessStatus('camera');
			let status = beforeStatus;

			if (beforeStatus !== 'granted') {
				const granted = await systemPreferences.askForMediaAccess('camera');
				status = granted ? 'granted' : systemPreferences.getMediaAccessStatus('camera');

				if (!granted && status !== 'granted') {
					await openPrivacySettings('camera');
				}
			}

			return status;
		}
		return 'prompt';
	});

	ipcMain.handle(CHECK_PERMISSION_MICROPHONE, async () => {
		if (process.platform === 'darwin') {
			const status = systemPreferences.getMediaAccessStatus('microphone');
			return status;
		}
		return null;
	});

	ipcMain.handle(CHECK_PERMISSION_CAMERA, async () => {
		if (process.platform === 'darwin') {
			const status = systemPreferences.getMediaAccessStatus('camera');
			return status;
		}
		return null;
	});
}
