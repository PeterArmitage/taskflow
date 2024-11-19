'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthLayout from '../../layout';
import { ResetPasswordForm } from '@/app/components/auth/reset-password-form';
import { authApi } from '@/app/api/auth';
import { ApiError } from '@/app/types/error';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';

interface ResetPasswordData {
	password: string;
	confirmPassword: string;
}

export default function ResetPassword() {
	const params = useParams();
	const router = useRouter();
	const token = params.token as string;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string } | null>(null);
	const [tokenValid, setTokenValid] = useState(true);
	const [success, setSuccess] = useState(false);

	// Verify token on mount
	useEffect(() => {
		const verifyToken = async () => {
			try {
				setLoading(true);
				await authApi.verifyResetToken(token);
				setTokenValid(true);
			} catch (err) {
				const error = err as ApiError;
				setTokenValid(false);
				setError({
					message:
						error.response?.data?.detail || 'Invalid or expired reset link',
				});
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			verifyToken();
		}
	}, [token]);

	const handleSubmit = async ({
		password,
		confirmPassword,
	}: ResetPasswordData) => {
		if (password !== confirmPassword) {
			setError({ message: 'Passwords do not match' });
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await authApi.resetPassword(token, password);
			setSuccess(true);
			setTimeout(() => {
				router.push('/signin');
			}, 2000);
		} catch (err) {
			const error = err as ApiError;
			setError({
				message: error.response?.data?.detail || 'Failed to reset password',
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading && !error) {
		return (
			<AuthLayout
				title='Verifying Reset Link'
				description='Please wait while we verify your reset link'
				showSignInLink={false}
			>
				<div className='flex justify-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			</AuthLayout>
		);
	}

	if (!tokenValid) {
		return (
			<AuthLayout
				title='Invalid Reset Link'
				description='This password reset link is invalid or has expired'
				showSignInLink
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-6 text-center'
				>
					<div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20'>
						<p className='text-red-700 dark:text-red-300'>
							{error?.message || 'Please request a new password reset link.'}
						</p>
					</div>
					<Button
						variant='sketch'
						className='w-full'
						onClick={() => router.push('/forgot-password')}
					>
						Request New Reset Link
					</Button>
				</motion.div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title='Reset your password'
			description='Enter your new password below'
			showSignInLink
		>
			{success ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-6 text-center'
				>
					<div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20'>
						<p className='text-green-700 dark:text-green-300'>
							Password reset successful! Redirecting to login...
						</p>
					</div>
				</motion.div>
			) : (
				<ResetPasswordForm
					onSubmit={handleSubmit}
					loading={loading}
					error={error}
				/>
			)}
		</AuthLayout>
	);
}
