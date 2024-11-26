// hooks/usePasswordReset.ts
import { useState } from 'react';
import { authApi } from '@/app/api/auth';
import { ApiErrorResponse } from '@/app/types/auth';

interface UsePasswordReset {
	loading: boolean;
	error: string | null;
	success: boolean;
	requestReset: (email: string) => Promise<void>;
	verifyToken: (token: string) => Promise<void>;
	resetPassword: (token: string, password: string) => Promise<void>;
}

export const usePasswordReset = (): UsePasswordReset => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const requestReset = async (email: string) => {
		try {
			setLoading(true);
			setError(null);
			await authApi.forgotPassword(email);
			setSuccess(true);
		} catch (err) {
			const error = err as ApiErrorResponse;
			setError(error.response?.data?.detail || 'Failed to send reset email');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const verifyToken = async (token: string) => {
		try {
			setLoading(true);
			setError(null);
			await authApi.verifyResetToken(token);
			setSuccess(true);
		} catch (err) {
			const error = err as ApiErrorResponse;
			setError(
				error.response?.data?.detail || 'Invalid or expired reset token'
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const resetPassword = async (token: string, password: string) => {
		try {
			setLoading(true);
			setError(null);
			await authApi.resetPassword(token, password);
			setSuccess(true);
		} catch (err) {
			const error = err as ApiErrorResponse;
			setError(error.response?.data?.detail || 'Failed to reset password');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		requestReset,
		verifyToken,
		resetPassword,
	};
};
