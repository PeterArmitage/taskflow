// app/(auth)/signin/page.tsx
'use client';

import AuthLayout from '../layout';
import { AuthForm } from '@/app/components/auth/auth-form';
import { useAuth } from '@/app/hooks';
import { AuthFormData, AuthError } from '@/app/types/auth';
import { ForgotPasswordDialog } from '@/app/components/auth/forgot-password-dialog';

export default function SignIn() {
	const { signin, loading, error } = useAuth();

	const handleSubmit = async (data: AuthFormData) => {
		await signin(data);
	};

	const formError: AuthError | null = error ? { message: error.message } : null;

	return (
		<AuthLayout
			title='Welcome back'
			description='Sign in to your TaskFlow account'
			showSignUpLink
		>
			<div className='space-y-6'>
				<AuthForm onSubmit={handleSubmit} loading={loading} error={formError} />
				<div className='text-center'>
					<ForgotPasswordDialog
						trigger={
							<button className='text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'>
								Forgot your password?
							</button>
						}
					/>
				</div>
			</div>
		</AuthLayout>
	);
}
