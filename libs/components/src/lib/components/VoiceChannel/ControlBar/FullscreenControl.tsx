import { Icons } from '@mezon/ui';
import { memo } from 'react';

interface FullscreenControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isFullScreen: boolean | undefined;
	onToggle: () => void;
}

export const FullscreenControl = memo(({ isGridView, isShowMember, isFullScreen, onToggle }: FullscreenControlProps) => {
	const iconClassName = `cursor-pointer ${
		(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
			? 'text-theme-primary text-theme-primary-hover'
			: 'text-gray-300 hover:text-white'
	}`;

	return (
		<div onClick={onToggle}>
			{isFullScreen ? (
				<span>
					<Icons.ExitFullScreen className={iconClassName} />
				</span>
			) : (
				<span>
					<Icons.FullScreen className={iconClassName} />
				</span>
			)}
		</div>
	);
});
