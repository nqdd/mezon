import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';

export const POLLS_FEATURE_KEY = 'polls';

export enum PollType {
	SINGLE = 0,
	MULTIPLE = 1
}

export interface PollOption {
	index: number;
	label: string;
}

export interface PollVote {
	user_id: string;
	username: string;
	value?: string;
	values?: string[];
}

export interface CreatePollRequest {
	channel_id: string;
	clan_id: string;
	title: string;
	options: string[];
	mode: number;
	is_public: boolean;
	expire_hours: number;
	type: PollType;
}

export interface CreatePollResponse {
	poll_id: string;
	message_id: string;
}

export interface VotePollRequest {
	poll_id: string;
	message_id: string;
	channel_id: string;
	value?: string;
	values?: string[];
}

export interface ClosePollRequest {
	poll_id: string;
	message_id: string;
	channel_id: string;
}

export type CreatePollPayload = {
	channelId: string;
	clanId: string;
	title: string;
	options: string[];
	mode: number;
	isPublic: boolean;
	expireHours: number;
	allowMultipleAnswers: boolean;
};

export type VotePollPayload = {
	pollId: string;
	messageId: string;
	channelId: string;
	selectedOptions: string[];
};

export type ClosePollPayload = {
	pollId: string;
	messageId: string;
	channelId: string;
};

export interface PollsState {
	loadingCreate: boolean;
	loadingVote: boolean;
	loadingClose: boolean;
	error: string | null;
}

export const initialPollsState: PollsState = {
	loadingCreate: false,
	loadingVote: false,
	loadingClose: false,
	error: null
};

export const createChannelPoll = createAsyncThunk('polls/createChannelPoll', async (payload: CreatePollPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const requestBody: CreatePollRequest = {
			channel_id: payload.channelId,
			clan_id: payload.clanId,
			title: payload.title,
			options: payload.options,
			mode: payload.mode,
			is_public: payload.isPublic,
			expire_hours: payload.expireHours,
			type: payload.allowMultipleAnswers ? PollType.MULTIPLE : PollType.SINGLE
		};

		const response = await (mezon.client as any).createChannelPoll(mezon.session, requestBody);

		return response as CreatePollResponse;
	} catch (error) {
		captureSentryError(error, 'polls/createChannelPoll');
		return thunkAPI.rejectWithValue(error);
	}
});

export const votePoll = createAsyncThunk('polls/votePoll', async (payload: VotePollPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const requestBody: VotePollRequest = {
			poll_id: payload.pollId,
			message_id: payload.messageId,
			channel_id: payload.channelId,

			...(payload.selectedOptions.length === 1 ? { value: payload.selectedOptions[0] } : { values: payload.selectedOptions })
		};

		await (mezon.client as any).votePoll(mezon.session, requestBody);

		return payload;
	} catch (error) {
		captureSentryError(error, 'polls/votePoll');
		return thunkAPI.rejectWithValue(error);
	}
});

export const closePoll = createAsyncThunk('polls/closePoll', async (payload: ClosePollPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const requestBody: ClosePollRequest = {
			poll_id: payload.pollId,
			message_id: payload.messageId,
			channel_id: payload.channelId
		};

		await (mezon.client as any).closePoll(mezon.session, requestBody);

		return payload;
	} catch (error) {
		captureSentryError(error, 'polls/closePoll');
		return thunkAPI.rejectWithValue(error);
	}
});

export const pollsSlice = createSlice({
	name: POLLS_FEATURE_KEY,
	initialState: initialPollsState,
	reducers: {},
	extraReducers: (builder) => {
		builder

			.addCase(createChannelPoll.pending, (state) => {
				state.loadingCreate = true;
				state.error = null;
			})
			.addCase(createChannelPoll.fulfilled, (state) => {
				state.loadingCreate = false;
			})
			.addCase(createChannelPoll.rejected, (state, action) => {
				state.loadingCreate = false;
				state.error = action.error.message || 'Failed to create poll';
			})

			.addCase(votePoll.pending, (state) => {
				state.loadingVote = true;
				state.error = null;
			})
			.addCase(votePoll.fulfilled, (state) => {
				state.loadingVote = false;
			})
			.addCase(votePoll.rejected, (state, action) => {
				state.loadingVote = false;
				state.error = action.error.message || 'Failed to vote';
			})

			.addCase(closePoll.pending, (state) => {
				state.loadingClose = true;
				state.error = null;
			})
			.addCase(closePoll.fulfilled, (state) => {
				state.loadingClose = false;
			})
			.addCase(closePoll.rejected, (state, action) => {
				state.loadingClose = false;
				state.error = action.error.message || 'Failed to close poll';
			});
	}
});

export const pollsReducer = pollsSlice.reducer;
export const pollsActions = pollsSlice.actions;

export const getPollsState = (rootState: { [POLLS_FEATURE_KEY]: PollsState }): PollsState => rootState[POLLS_FEATURE_KEY];

export const selectPollLoadingCreate = (rootState: { [POLLS_FEATURE_KEY]: PollsState }): boolean => getPollsState(rootState).loadingCreate;

export const selectPollLoadingVote = (rootState: { [POLLS_FEATURE_KEY]: PollsState }): boolean => getPollsState(rootState).loadingVote;

export const selectPollLoadingClose = (rootState: { [POLLS_FEATURE_KEY]: PollsState }): boolean => getPollsState(rootState).loadingClose;

export const selectPollError = (rootState: { [POLLS_FEATURE_KEY]: PollsState }): string | null => getPollsState(rootState).error;
