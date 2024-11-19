// api/auth.ts
import axios, { AxiosError } from 'axios';
import { AuthFormData, AuthResponse, User } from '../types/auth';
import { ApiError, ApiErrorResponse } from '../types/error';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

const handleApiError = (error: Error | AxiosError) => {
	if (axios.isAxiosError(error)) {
		const response = error.response as ApiErrorResponse | undefined;
		throw new ApiError(response?.data?.detail || 'An error occurred', response);
	}
	throw new ApiError(error.message);
};

// Create axios instance with default config
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Add response interceptor to handle redirects
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 307) {
			const redirectUrl = error.response.headers.location;
			return api.get(redirectUrl);
		}
		return Promise.reject(error);
	}
);

export const authApi = {
	async signup(data: AuthFormData): Promise<AuthResponse> {
		try {
			const response = await api.post('/users/', {
				username: data.email,
				email: data.email,
				password: data.password,
			});

			if (response.data) {
				console.log('Signup successful:', response.data);
				return this.signin({
					email: data.email,
					password: data.password,
				});
			}
			throw new ApiError('No data received from signup');
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('An unexpected error occurred');
		}
	},

	async signin(data: AuthFormData): Promise<AuthResponse> {
		try {
			const formData = new FormData();
			formData.append('username', data.email);
			formData.append('password', data.password);

			const tokenResponse = await api.post('/token', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			const { access_token } = tokenResponse.data;

			// Update authorization header for future requests
			api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

			// Store token
			localStorage.setItem('token', access_token);

			// Get user data
			const userResponse = await api.get('/users/me/');

			return {
				access_token,
				token_type: 'bearer',
				user: userResponse.data,
			};
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('An unexpected error occurred');
		}
	},

	async getCurrentUser(): Promise<User> {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new ApiError('No token found');
			}

			// Set token in headers
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			const response = await api.get('/users/me/');
			return response.data;
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('An unexpected error occurred');
		}
	},

	logout(): void {
		localStorage.removeItem('token');
		delete api.defaults.headers.common['Authorization'];
	},

	async forgotPassword(email: string): Promise<void> {
		try {
			await api.post('/password-reset/request', { email });
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('Failed to send reset email');
		}
	},

	async verifyResetToken(token: string): Promise<void> {
		try {
			await api.get(`/password-reset/verify/${token}`);
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('Invalid or expired reset token');
		}
	},

	async resetPassword(token: string, newPassword: string): Promise<void> {
		try {
			await api.post(`/password-reset/reset/${token}`, {
				new_password: newPassword,
			});
		} catch (error: unknown) {
			handleApiError(error as Error);
			throw new ApiError('Failed to reset password');
		}
	},
};
