// api/auth.ts
import axios, { AxiosError } from 'axios';
import {
	AuthFormData,
	AuthResponse,
	User,
	PasswordResetRequest,
	PasswordResetVerify,
	PasswordReset,
} from '../types/auth';
import { ApiError, ApiErrorResponse, ApiErrorData } from '../types/error';
import { storage } from '../utils/storage';
import { ProfileUpdateData } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const withTrailingSlash = (url: string) =>
	url.endsWith('/') ? url : `${url}/`;
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Configure axios interceptors
api.interceptors.request.use(
	(config) => {
		const token = storage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			storage.removeItem('token');
			// Optional: Redirect to login page
		}
		return Promise.reject(error);
	}
);

const handleApiError = (error: Error | AxiosError) => {
	if (axios.isAxiosError(error)) {
		const response = error.response as ApiErrorResponse | undefined;
		const errorMessage = response?.data?.detail || 'An error occurred';
		console.error('API Error:', errorMessage, response);
		throw new ApiError(errorMessage, response);
	}
	console.error('Non-Axios Error:', error);
	throw new ApiError(error.message);
};

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
					rememberMe: data.rememberMe,
				});
			}
			throw new ApiError('No data received from signup');
		} catch (error) {
			console.error('Signup error:', error);
			throw handleApiError(error as Error);
		}
	},

	async signin(data: AuthFormData): Promise<AuthResponse> {
		try {
			const formData = new FormData();
			formData.append('username', data.email);
			formData.append('password', data.password);

			const tokenResponse = await api.post(
				withTrailingSlash('token'),
				formData
			);
			const { access_token } = tokenResponse.data;

			if (!access_token) throw new Error('No access token received');

			// Save token first
			storage.setItem('token', access_token, data.rememberMe ?? false);

			// Set token in axios defaults
			api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

			// Get user data - note the trailing slash
			const userResponse = await api.get(withTrailingSlash('users/me'));

			if (!userResponse.data) throw new Error('No user data received');

			return {
				access_token,
				token_type: 'bearer',
				user: userResponse.data,
			};
		} catch (error) {
			console.error('Signin error:', error);
			storage.removeItem('token'); // Clean up on error
			throw handleApiError(error as Error);
		}
	},

	async getCurrentUser(): Promise<User> {
		try {
			const token = storage.getItem('token');
			if (!token) throw new ApiError('No token found');

			const response = await api.get(withTrailingSlash('users/me'));
			return response.data;
		} catch (error) {
			storage.removeItem('token');
			throw handleApiError(error as Error);
		}
	},

	logout(): void {
		storage.removeItem('token');
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
	async updateProfile(userId: string, data: ProfileUpdateData): Promise<User> {
		try {
			const response = await api.put(`/users/${userId}`, data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateAvatar(userId: string, file: File): Promise<User> {
		try {
			const formData = new FormData();
			formData.append('avatar', file);

			const response = await api.put(`/users/${userId}/avatar`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
