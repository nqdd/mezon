import type { LoadingStatus } from '@mezon/utils';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { ApiTransactionDetail } from 'mezon-js/api.gen';

export const WALLET_LEDGER_FEATURE_KEY = 'walletLedger';

export interface WalletLedgerState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	count?: number;
	detailLedger?: ApiTransactionDetail | null;
}

export const initialWalletLedgerState: WalletLedgerState = {
	loadingStatus: 'not loaded',
	error: null,
	detailLedger: null,
	count: 0
};

export const walletLedgerSlice = createSlice({
	name: WALLET_LEDGER_FEATURE_KEY,
	initialState: initialWalletLedgerState,
	reducers: {
		resetWalletLedger: (state) => {
			state.count = 0;
		}
	},
	extraReducers: (builder) => {
		('');
	}
});

export const getWalletLedgerState = (rootState: { [WALLET_LEDGER_FEATURE_KEY]: WalletLedgerState }): WalletLedgerState =>
	rootState[WALLET_LEDGER_FEATURE_KEY];
export const walletLedgerReducer = walletLedgerSlice.reducer;
export const walletLedgerActions = {
	...walletLedgerSlice.actions
};
export const selectCountWalletLedger = createSelector(getWalletLedgerState, (state) => state.count);
