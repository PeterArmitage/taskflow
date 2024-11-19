// app/(auth)/forgot-password/page.tsx
'use client';

import AuthLayout from '../layout';
import { ForgotPasswordForm } from '@/app/components/auth/forgot-password-form';
import { useState } from 'react';
import { authApi } from '@/app/api/auth';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

interface ForgotPasswordData {
	email: string;
}

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string } | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async ({ email }: ForgotPasswordData) => {
		try {
			setLoading(true);
			setError(null);
			await authApi.forgotPassword(email);
			setSuccess(true);
		} catch (err) {
			const error = err as { response?: { data?: { detail?: string } } };
			setError({
				message: error.response?.data?.detail || 'Failed to send reset email',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthLayout
			title='Reset your password'
			description='Enter your email to receive reset instructions'
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
							Check your email for password reset instructions.
						</p>
					</div>
					<Button
						variant='sketch'
						className='w-full'
						onClick={() => (window.location.href = '/signin')}
					>
						Return to Sign In
					</Button>
				</motion.div>
			) : (
				<>
					<ForgotPasswordForm
						onSubmit={handleSubmit}
						loading={loading}
						error={error}
					/>
					<div className='mt-6 text-center'>
						<Link
							href='/signin'
							className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						>
							Remember your password? Sign in
						</Link>
					</div>
				</>
			)}
		</AuthLayout>
	);
}
