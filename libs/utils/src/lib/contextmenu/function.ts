async function copyBlobToClipboard(pngBlob: Blob | null): Promise<boolean> {
	if (!pngBlob || !(window.navigator.clipboard && window.ClipboardItem)) {
		return false;
	}

	try {
		await window.navigator.clipboard.write?.([
			new ClipboardItem({
				[pngBlob.type]: pngBlob
			})
		]);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export const copyImageToClipboard = (imageUrl?: string): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		if (!imageUrl) {
			resolve(false);
			return;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const imageEl = new Image();
		imageEl.crossOrigin = 'anonymous';

		imageEl.onload = async (e: Event) => {
			if (ctx && e.currentTarget) {
				const img = e.currentTarget as HTMLImageElement;
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.width, img.height);

				canvas.toBlob(
					async (blob) => {
						try {
							const success = await copyBlobToClipboard(blob);
							resolve(success);
						} catch (error) {
							reject(error);
						}
					},
					'image/png',
					1
				);
			} else {
				resolve(false);
			}
		};

		imageEl.onerror = () => {
			reject(new Error('Failed to load image'));
		};

		imageEl.src = imageUrl;
	});
};

export const handleCopyImage = async (urlData: string, onSuccess?: () => void): Promise<boolean> => {
	try {
		const success = await copyImageToClipboard(urlData);
		if (success && onSuccess) {
			onSuccess();
		}
		return success;
	} catch (error) {
		console.error('Error handling image copy:', error);
		return false;
	}
};

export const handleSaveImage = (urlData: string) => {
	fetch(urlData)
		.then((response) => response.blob())
		.then((blob) => {
			const fileName = urlData.split('/').pop()?.split('?')[0] || 'image.png';
			const url = window.URL.createObjectURL(new Blob([blob]));
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		})
		.catch((error) => console.error('Error downloading image:', error));
};

const extractUrlFromText = (text: string): string => {
	const urlRegex = /(https?:\/\/[^\s]+|ftp:\/\/[^\s]+|www\.[^\s]+)/gi;
	const matches = text.match(urlRegex);

	if (matches && matches.length > 0) {
		let url = matches[0];

		if (url.startsWith('www.')) {
			url = `https://${url}`;
		}

		return url;
	}

	return text;
};

export const handleCopyLink = (urlData: string, isLink?: boolean) => {
	const linkToCopy = isLink ? extractUrlFromText(urlData) : urlData;

	if (navigator.clipboard) {
		navigator.clipboard.writeText(linkToCopy).catch((error) => {
			console.error('Failed to copy link:', error);
		});
	} else {
		console.warn('Clipboard API not supported. Link not copied.');
	}
};

export const handleOpenLink = (urlData: string, isLink?: boolean) => {
	const url = isLink ? extractUrlFromText(urlData) : urlData;
	window.open(url, '_blank');
};
