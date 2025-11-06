import { selectTheme, useAppSelector } from '@mezon/store';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';

export function useMenuStyles(warningStatus: string) {
	const appearanceTheme = useAppSelector(selectTheme);
	const isLightMode = appearanceTheme === 'light';

	const menuStyles = useMemo(
		() =>
			({
				'--contexify-menu-bgColor': 'var(--bg-theme-contexify)',
				'--contexify-item-color': 'var(--text-theme-primary)',
				'--contexify-activeItem-color': 'var(--text-secondary)',
				'--contexify-activeItem-bgColor': warningStatus || 'var(--bg-item-hover)',
				'--contexify-rightSlot-color': 'var(--text-secondary)',
				'--contexify-activeRightSlot-color': 'var(--text-secondary)',
				'--contexify-arrow-color': 'var(--text-theme-primary)',
				'--contexify-activeArrow-color': 'var(--text-secondary)',
				'--contexify-activeItem-radius': '6px',
				'--contexify-menu-radius': '8px',
				border: '1px solid var(--border-primary)'
			}) as CSSProperties,
		[warningStatus]
	);

	return { menuStyles, isLightMode };
}
