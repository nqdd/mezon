import { protocol } from 'electron';
import { existsSync, readFileSync, statSync } from 'fs';
import { extname, join, normalize } from 'path';

export const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.xml': 'application/xml',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.mp4': 'video/mp4',
	'.webm': 'video/webm'
};

export const MEZON_APP_HOSTNAME = 'mezon.desktop';

export function registerHttpInterceptor(appPath: string) {
	protocol.handle('http', async (request) => {
		const url = new URL(request.url);
		const PATH_NAME_INDEX = 1;

		if (url.hostname === MEZON_APP_HOSTNAME) {
			let pathname = url.pathname.substring(PATH_NAME_INDEX);
			pathname = decodeURIComponent(pathname) || 'index.html';

			const filePath = normalize(join(appPath, pathname));
			const normalizedAppPath = normalize(appPath);

			if (!filePath.startsWith(normalizedAppPath)) {
				return new Response('This resource is not allowed to be accessed', { status: 403 });
			}

			if (!existsSync(filePath) || !statSync(filePath).isFile()) {
				return new Response('Resource not found', { status: 404 });
			}

			const fileData = readFileSync(filePath);
			const mimeType = MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';

			return new Response(fileData, {
				status: 200,
				headers: {
					'Content-Type': mimeType
				}
			});
		}
		return fetch(request);
	});
}
