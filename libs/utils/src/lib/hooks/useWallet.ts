import { selectAllAccount, selectIsEnabledWallet, selectSession, selectWalletDetail, useAppDispatch, walletActions } from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export function useWallet() {
	const dispatch = useAppDispatch();
	const sessionUser = useSelector(selectSession);
	const userProfile = useSelector(selectAllAccount);
	const walletDetail = useSelector(selectWalletDetail);
	const isEnableWallet = useSelector(selectIsEnabledWallet);

	const fetchWalletData = useCallback(async () => {
		if (!isEnableWallet || !userProfile?.user?.id) return;
		try {
			await dispatch(walletActions.fetchWalletDetail({ userId: userProfile?.user?.id })).unwrap();
		} catch (error) {
			console.error(`Error loading wallet detail:`, error);
		}
	}, [isEnableWallet, userProfile]);

	const enableWallet = useCallback(async () => {
		const userId = userProfile?.user?.id || '';
		if (sessionUser?.token && userId) {
			await dispatch(walletActions.fetchEphemeralKeyPair());
			await dispatch(walletActions.fetchAddress({ userId: userId }));

			const proofInput = {
				userId: userId,
				jwt: sessionUser?.token
			};

			await dispatch(walletActions.fetchZkProofs(proofInput));
			await dispatch(walletActions.setIsEnabledWallet(true));
		}
	}, [userProfile, sessionUser]);

	const disableWallet = useCallback(async () => {
		await dispatch(walletActions.resetState());
	}, []);

	return { isEnableWallet, walletDetail, fetchWalletData, enableWallet, disableWallet };
}
