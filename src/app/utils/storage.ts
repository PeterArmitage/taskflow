// utils/storage.ts
import Cookies from 'js-cookie';

export const storage = {
	setItem(key: string, value: string, persistent: boolean = false) {
		// Set cookie for middleware
		Cookies.set(key, value, {
			secure: true,
			sameSite: 'lax',
			expires: persistent ? 30 : 1,
		});

		// Also set in localStorage
		localStorage.setItem(key, value);
	},

	getItem(key: string): string | null {
		return localStorage.getItem(key) || Cookies.get(key) || null;
	},

	removeItem(key: string) {
		localStorage.removeItem(key);
		Cookies.remove(key);
	},
};
