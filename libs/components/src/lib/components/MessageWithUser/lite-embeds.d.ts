import type { CSSProperties } from 'react';

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'lite-youtube': {
				videoid: string;
				playlabel?: string;
				posterquality?: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault';
				params?: string;
				style?: CSSProperties;
			};
			'lite-tiktok': {
				videoid: string;
				autoload?: boolean;
				style?: CSSProperties;
			};
		}
	}
}
