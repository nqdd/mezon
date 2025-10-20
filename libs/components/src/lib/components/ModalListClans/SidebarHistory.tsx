import { appActions, selectHistory } from '@mezon/store';
import { Icons } from '@mezon/ui';
import isElectron from 'is-electron';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SideBarHistory = () => {
	const history = useSelector(selectHistory);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleHistoryNavigate = useCallback(
		(move: boolean) => {
			if (history?.current === null) return;
			if ((history?.current === 0 || !history?.url?.length) && move) {
				return;
			}
			if (history?.current === null || history?.current === undefined || (history?.current === history?.url?.length - 1 && !move)) {
				return;
			}
			dispatch(appActions.setBackHistory(move));
			navigate(history?.url[history?.current + (move ? -1 : 1)]);
		},
		[history]
	);
	if (!isElectron()) return null;

	return (
		<div className="flex pb-1 text-theme-primary-active">
			<div
				className={`rotate-180 rounded-full aspect-square p-1 bg-item-theme-hover cursor-pointer  ${history?.current === 0 || !history?.url?.length ? 'opacity-40' : ''}`}
				onClick={() => handleHistoryNavigate(true)}
			>
				<Icons.LongArrowRight className="w-5" />
			</div>
			<div
				onClick={() => handleHistoryNavigate(false)}
				className={`rounded-full aspect-square bg-item-theme-hover p-1 cursor-pointer ${history?.current !== null && history?.current < history?.url?.length - 1 ? '' : 'opacity-40'}`}
			>
				<Icons.LongArrowRight className="w-5" />
			</div>
		</div>
	);
};

export default memo(SideBarHistory);
