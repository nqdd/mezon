import type { UnknownAction } from '@reduxjs/toolkit';
import type { EStateFriend } from './friend.slice';
import { friendsActions } from './friend.slice';

export const FRIEND_RELATION_SYNC_STORAGE_KEY = 'mezon:friend-relation-sync';

export function initFriendRelationCrossTabSync(dispatch: (action: UnknownAction) => void): () => void {
	if (typeof window === 'undefined') return () => void 0;

	const handleStorage = (e: StorageEvent) => {
		if (e.key !== FRIEND_RELATION_SYNC_STORAGE_KEY || !e.newValue) return;
		try {
			const data = JSON.parse(e.newValue) as {
				userId: string;
				state: EStateFriend;
				sourceId?: string;
			};
			dispatch(friendsActions.applyFriendBlockState(data));
		} catch {
			// ignore malformed payload
		}
	};

	window.addEventListener('storage', handleStorage);
	return () => window.removeEventListener('storage', handleStorage);
}

export function broadcastFriendRelationToOtherTabs(payload: { userId: string; state: EStateFriend; sourceId?: string }) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(FRIEND_RELATION_SYNC_STORAGE_KEY, JSON.stringify({ ...payload, t: Date.now() }));
	} catch {
		// quota / private mode
	}
}
