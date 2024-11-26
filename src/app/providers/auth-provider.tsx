// providers/auth-provider.tsx
'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import type {
	AuthContextType,
	AuthState,
	AuthFormData,
	User,
	AuthResponse,
	AuthError,
} from '@/app/types/auth';
import { authApi } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/app/types/error';
import { storage } from '@/app/utils/storage';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	});
	const router = useRouter();

	useEffect(() => {
		let mounted = true;

		const initializeAuth = async () => {
			try {
				const token = storage.getItem('token');
				if (token) {
					const user = await authApi.getCurrentUser();
					if (mounted) {
						setState((prev) => ({ ...prev, user, loading: false }));
					}
				} else {
					if (mounted) {
						setState((prev) => ({ ...prev, loading: false }));
					}
				}
			} catch (error) {
				console.error('Auth initialization error:', error);
				storage.removeItem('token');
				if (mounted) {
					setState((prev) => ({ ...prev, loading: false }));
				}
			}
		};

		initializeAuth();

		return () => {
			mounted = false;
		};
	}, []);

	const signin = async (data: AuthFormData): Promise<AuthResponse> => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			const response = await authApi.signin(data);

			storage.setItem('token', response.access_token, data.rememberMe ?? false);

			setState((prev) => ({
				...prev,
				user: response.user,
				loading: false,
			}));

			window.location.href = '/dashboard';
			return response;
		} catch (error) {
			const apiError = error as ApiError;
			const authError: AuthError = {
				message: apiError.message || 'Sign in failed',
			};
			setState((prev) => ({
				...prev,
				error: authError,
				loading: false,
			}));
			throw error;
		}
	};

	const signup = async (data: AuthFormData): Promise<AuthResponse> => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			const response = await authApi.signup(data);
			setState((prev) => ({
				...prev,
				user: response.user,
				loading: false,
			}));
			router.push('/dashboard');
			return response;
		} catch (error) {
			const apiError = error as ApiError;
			const authError: AuthError = {
				message: apiError.message || 'Sign up failed',
			};
			setState((prev) => ({
				...prev,
				error: authError,
				loading: false,
			}));
			throw error;
		}
	};

	const signout = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, loading: true }));
			await authApi.logout();
			setState({ user: null, loading: false, error: null });
			storage.removeItem('token');
			window.location.href = '/signin';
		} catch (error) {
			console.error('Signout error:', error);
			setState((prev) => ({ ...prev, loading: false }));
		}
	}, []);

	const updateUser = useCallback((data: Partial<User>) => {
		setState((prev) => ({
			...prev,
			user: prev.user ? { ...prev.user, ...data } : null,
		}));
	}, []);

	const contextValue: AuthContextType = {
		user: state.user,
		loading: state.loading,
		error: state.error,
		signin,
		signup,
		signout,
		updateUser,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}
