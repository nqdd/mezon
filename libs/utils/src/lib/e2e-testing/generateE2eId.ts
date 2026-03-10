import type { E2eKeyType } from './constants';
const IS_REMOVED_E2E = process.env.BABEL_ENV === 'remove-e2e';

export function generateE2eId(path: E2eKeyType | '' = '', identifier = ''): string | undefined {
	if (IS_REMOVED_E2E) return undefined;
	return [...path.split('.'), identifier].filter(Boolean).join('-');
}
