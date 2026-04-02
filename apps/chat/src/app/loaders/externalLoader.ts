import { accountActions, authActions } from '@mezon/store';
import type { CustomLoaderFunction } from './appLoader';

export interface IAuthLoaderData {
	isLogin: boolean;
	redirect?: string;
}
export const externalLoader: CustomLoaderFunction = async ({ dispatch, initialPath }) => {
	try {
		const session = await dispatch(authActions.refreshSession()).unwrap();
		if (session) {
			await dispatch(accountActions.getUserProfile());
		}
		return true;
	} catch (error) {
		console.error('refreshSession error:', error);
		return true;
	}
};
