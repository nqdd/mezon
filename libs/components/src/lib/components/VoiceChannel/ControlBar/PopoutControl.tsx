import { Icons } from '@mezon/ui';
import { memo } from 'react';

interface PopoutControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isOpenPopOut: boolean | undefined;
	onToggle: () => void;
}

export const PopoutControl = memo(({ isGridView, isShowMember, isOpenPopOut, onToggle }: PopoutControlProps) => {
	const iconClassName = `cursor-pointer ${
		(isGridView && !isShowMember) || (isGridView && isShowMember) || (isShowMember && !isGridView)
			? 'text-theme-primary text-theme-primary-hover'
			: 'text-gray-300 hover:text-white'
	}`;

	return (
		<div onClick={onToggle}>
			{isOpenPopOut ? (
				<span>
					<Icons.VoicePopOutIcon className={`${iconClassName} rotate-180`} />
				</span>
			) : (
				<span>
					<Icons.VoicePopOutIcon className={iconClassName} />
				</span>
			)}
		</div>
	);
});
