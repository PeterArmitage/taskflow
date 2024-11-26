// app/(auth)/reset-password/[token]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthLayout from '../../layout';
import { ResetPasswordForm } from '@/app/components/auth/reset-password-form';
import { usePasswordReset } from '@/app/hooks/usePasswordReset';

export default function ResetPassword() {
	const params = useParams();
	const router = useRouter();
	const token = params.token as string;
	const { loading, error, success, verifyToken, resetPassword } =
		usePasswordReset();

	const [tokenValid, setTokenValid] = useState(false);
	const [tokenError, setTokenError] = useState<string | null>(null);

	useEffect(() => {
		const validateToken = async () => {
			try {
				await verifyToken(token);
				setTokenValid(true);
			} catch (err) {
				setTokenValid(false);
				setTokenError('Invalid or expired reset link');
			}
		};
		validateToken();
	}, [token, verifyToken]);

	const handleSubmit = async ({ password }: { password: string }) => {
		try {
			await resetPassword(token, password);
			setTimeout(() => {
				router.push('/signin');
			}, 2000);
		} catch (err) {
			// Error is handled by the usePasswordReset hook
			console.error('Failed to reset password:', err);
		}
	};

	if (!tokenValid) {
		return (
			<AuthLayout
				title='Invalid Reset Link'
				description='This password reset link is invalid or has expired'
				showSignInLink
			>
				<div className='text-center text-red-500'>
					<p>{tokenError || 'Please request a new password reset link.'}</p>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title='Reset your password'
			description='Enter your new password below'
			showSignInLink={success}
		>
			{success ? (
				<div className='text-center text-green-500'>
					<p>Password reset successful! Redirecting to login...</p>
				</div>
			) : (
				<ResetPasswordForm
					onSubmit={handleSubmit}
					loading={loading}
					error={error ? { message: error } : null}
				/>
			)}
		</AuthLayout>
	);
}
