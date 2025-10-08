import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useEscapeKeyClose = (ref: RefObject<HTMLElement> | undefined, onClose: () => void) => {
	useEffect(() => {
		const element = ref?.current;
		if (!element) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' || event.key === 'Esc') {
				if (element.offsetParent !== null) {
					event.stopPropagation();
					onClose();
				}
			}
		};

		if (element.tabIndex < 0) {
			element.tabIndex = -1;
		}

		document.addEventListener('keydown', handleKeyDown);

		if (document.activeElement !== element && !element.contains(document.activeElement)) {
			element.focus();
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [ref, onClose]);
};
