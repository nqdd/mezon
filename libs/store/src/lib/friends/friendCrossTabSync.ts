import type { UnknownAction } from '@reduxjs/toolkit';
import { friendsActions } from './friend.slice';

export const FRIEND_RELATION_SYNC_STORAGE_KEY = 'mezon:friend-relation-sync';

export interface FriendRelationPayload {
	userId: string;
	state: number;
	sourceId: string;
}

export function broadcastFriendRelationToOtherTabs(payload: FriendRelationPayload): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(FRIEND_RELATION_SYNC_STORAGE_KEY, JSON.stringify(payload));
}

export function initFriendRelationCrossTabSync(dispatch: (action: UnknownAction) => void): void {
	if (typeof window === 'undefined') return;

	window.addEventListener('storage', (e: StorageEvent) => {
		if (e.key !== FRIEND_RELATION_SYNC_STORAGE_KEY || !e.newValue) return;
		try {
			const data = JSON.parse(e.newValue);
			dispatch(friendsActions.applyFriendBlockState(data));
		} catch {
			// ignore malformed payload
		}
	});
}
