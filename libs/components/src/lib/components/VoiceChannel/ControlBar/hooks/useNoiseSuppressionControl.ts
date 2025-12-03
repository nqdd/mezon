import { selectNoiseSuppressionEnabled, selectNoiseSuppressionLevel, useAppDispatch, voiceActions } from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export function useNoiseSuppressionControl() {
	const dispatch = useAppDispatch();
	const enabled = useSelector(selectNoiseSuppressionEnabled);
	const level = useSelector(selectNoiseSuppressionLevel);

	const toggleNoiseSuppression = useCallback(() => {
		dispatch(voiceActions.setNoiseSuppressionEnabled(!enabled));
	}, [dispatch, enabled]);

	const handleLevelChange = useCallback(
		(newLevel: number) => {
			dispatch(voiceActions.setNoiseSuppressionLevel(newLevel));
		},
		[dispatch]
	);

	return {
		enabled,
		level,
		toggleNoiseSuppression,
		handleLevelChange
	};
}
