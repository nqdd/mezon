export enum Platform {
	ANDROID = 'Android',
	IOS = 'iOS',
	WINDOWS_PHONE = 'Windows Phone',
	WINDOWS = 'Windows',
	MACOS = 'macOS',
	LINUX = 'Linux',
	UNKNOWN = 'Unknown'
}

export const getPlatformLabel = (platform: string | undefined): string => {
	if (!platform) return 'DESKTOP';
	return platform.toUpperCase();
};

export const isMobilePlatform = (platform: string | undefined): boolean => {
	if (!platform) return false;
	const platformUpper = platform.toUpperCase();
	return platformUpper === 'IOS' || platformUpper === 'ANDROID';
};
