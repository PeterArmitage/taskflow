// providers/auth-provider.tsx
'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { AuthState, AuthFormData } from '../types/auth';
import { authApi } from '../api/auth';
import { useRouter } from 'next/navigation';
import { ApiError } from '../types/error';

interface AuthContextType extends AuthState {
	signin: (data: AuthFormData) => Promise<void>;
	signup: (data: AuthFormData) => Promise<void>;
	signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	});
	const router = useRouter();

	// Check for existing auth session
	useEffect(() => {
		let mounted = true;

		const initializeAuth = async () => {
			try {
				const token = localStorage.getItem('token');
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
				localStorage.removeItem('token');
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

	const signin = async (data: AuthFormData) => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			const response = await authApi.signin(data);
			setState((prev) => ({
				...prev,
				user: response.user,
				loading: false,
			}));
			window.location.href = '/dashboard';
		} catch (error) {
			const apiError = error as ApiError;
			setState((prev) => ({
				...prev,
				error: apiError.message
					? { message: apiError.message }
					: { message: 'Sign in failed' },
				loading: false,
			}));
		}
	};

	const signup = async (data: AuthFormData) => {
		try {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			const response = await authApi.signup(data);
			setState((prev) => ({
				...prev,
				user: response.user,
				loading: false,
			}));
			router.push('/dashboard');
		} catch (error) {
			const apiError = error as ApiError;
			setState((prev) => ({
				...prev,
				error: { message: apiError.message },
				loading: false,
			}));
		}
	};

	const signout = useCallback(async () => {
		try {
			setState((prev) => ({ ...prev, loading: true }));
			await authApi.logout();
			setState({ user: null, loading: false, error: null });
			localStorage.removeItem('token');
			window.location.href = '/signin';
		} catch (error) {
			console.error('Signout error:', error);
			setState((prev) => ({ ...prev, loading: false }));
		}
	}, []);

	const value = {
		...state,
		signin,
		signup,
		signout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
