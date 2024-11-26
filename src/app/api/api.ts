// api/api.ts
import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

// Create axios instance with default config
export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Add a helper function for consistent URLs
export const withTrailingSlash = (url: string) =>
	url.endsWith('/') ? url : `${url}/`;

// Request interceptor to add auth token
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

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Handle token expiration
			storage.removeItem('token');
			window.location.href = '/signin';
		}
		if (error.response?.status === 307) {
			// Handle redirects
			const redirectUrl = error.response.headers.location;
			return api.get(redirectUrl);
		}
		return Promise.reject(error);
	}
);
// Export error handling utility
export const handleApiError = (error: Error) => {
	if (axios.isAxiosError(error)) {
		const response = error.response;
		throw new Error(response?.data?.detail || 'An error occurred');
	}
	throw error;
};
