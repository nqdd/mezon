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

const MAX_IMAGE_SIZE = 4096;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const resizeImage = (img: HTMLImageElement): { width: number; height: number; needsResize: boolean } => {
	const { width: originalWidth, height: originalHeight } = img;

	if (originalWidth <= MAX_IMAGE_SIZE && originalHeight <= MAX_IMAGE_SIZE) {
		return { width: originalWidth, height: originalHeight, needsResize: false };
	}

	const scale = Math.min(MAX_IMAGE_SIZE / originalWidth, MAX_IMAGE_SIZE / originalHeight);
	const newWidth = Math.floor(originalWidth * scale);
	const newHeight = Math.floor(originalHeight * scale);

	return {
		width: newWidth,
		height: newHeight,
		needsResize: true
	};
};

const processImageBlob = async (blob: Blob | null): Promise<boolean> => {
	if (!blob) return false;

	if (blob.size > MAX_FILE_SIZE) {
		console.warn('Image too large after processing:', blob.size, 'bytes');
		return false;
	}

	return await copyBlobToClipboard(blob);
};

const processImageOnCanvas = async (ctx: CanvasRenderingContext2D, img: HTMLImageElement): Promise<boolean> => {
	const { width, height, needsResize } = resizeImage(img);
	const canvas = ctx.canvas;

	canvas.width = width;
	canvas.height = height;

	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			try {
				ctx.drawImage(img, 0, 0, width, height);
				const quality = needsResize ? 0.9 : 1.0;

				canvas.toBlob(
					async (blob) => {
						const success = await processImageBlob(blob);
						resolve(success);
					},
					'image/png',
					quality
				);
			} catch (error) {
				console.error('Error processing image:', error);
				resolve(false);
			}
		});
	});
};

export const copyImageToClipboard = (imageUrl?: string): Promise<boolean> => {
	return new Promise((resolve) => {
		if (!imageUrl) {
			resolve(false);
			return;
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			resolve(false);
			return;
		}

		const imageEl = new Image();
		imageEl.crossOrigin = 'anonymous';

		imageEl.onload = async (e: Event) => {
			const target = e.currentTarget as HTMLImageElement;
			if (!target) {
				resolve(false);
				return;
			}

			try {
				const success = await processImageOnCanvas(ctx, target);
				resolve(success);
			} catch (error) {
				console.error('Error in image processing:', error);
				resolve(false);
			}
		};

		imageEl.onerror = () => {
			console.error('Error loading image');
			resolve(false);
		};

		imageEl.src = imageUrl;
	});
};

export const handleCopyImage = async (urlData: string): Promise<boolean> => {
	try {
		const success = await copyImageToClipboard(urlData);
		return success;
	} catch (error) {
		console.error('Error handling image copy:', error);
		return false;
	}
};
