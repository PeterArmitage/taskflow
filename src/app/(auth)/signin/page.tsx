// app/(auth)/signin/page.tsx
'use client';

import AuthLayout from '../layout';
import { AuthForm } from '@/app/components/auth/auth-form';
import { useAuth } from '@/app/hooks/useAuth';
import { AuthFormData, AuthError } from '@/app/types/auth';
import Link from 'next/link';

export default function SignIn() {
	const { signin, loading, error } = useAuth();

	const handleSubmit = async (data: AuthFormData) => {
		await signin(data);
	};

	// Convert the error to match AuthError type
	const formError: AuthError | null = error ? { message: error } : null;

	return (
		<AuthLayout
			title='Welcome back'
			description='Sign in to your TaskFlow account'
			showSignUpLink
		>
			<div className='space-y-6'>
				<AuthForm onSubmit={handleSubmit} loading={loading} error={formError} />

				<div className='text-center'>
					<Link
						href='/forgot-password'
						className='text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
					>
						Forgot your password?
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
}
