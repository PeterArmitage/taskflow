// hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/auth';
import { AuthFormData, User } from '@/app/types/auth';

export const useAuth = () => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const signin = useCallback(async (data: AuthFormData) => {
		setLoading(true);
		setError(null);
		try {
			const response = await authApi.signin(data);
			setUser(response.user);
			window.location.href = '/dashboard';
			return response;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Sign in failed');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const signup = useCallback(
		async (data: AuthFormData) => {
			setLoading(true);
			setError(null);
			try {
				const user = await authApi.signup(data);
				await signin(data);
				return user;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Signup failed');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[signin]
	);

	const signout = useCallback(async () => {
		try {
			authApi.logout();
			setUser(null);
			window.location.href = '/signin';
		} catch (error) {
			console.error('Signout error:', error);
		}
	}, []);

	return {
		user,
		loading,
		error,
		signup,
		signin,
		signout,
	};
};
