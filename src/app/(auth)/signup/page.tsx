// app/(auth)/signup/page.tsx
'use client';

import AuthLayout from '../layout';
import { AuthForm } from '@/app/components/auth/auth-form';
import { useAuth } from '@/app/hooks/useAuth';
import { AuthFormData, AuthError } from '@/app/types/auth';

export default function SignUp() {
	const { signup, loading, error } = useAuth();

	const handleSubmit = async (data: AuthFormData) => {
		await signup(data);
	};

	// Convert the error to match AuthError type
	const formError: AuthError | null = error ? { message: error } : null;

	return (
		<AuthLayout
			title='Create an account'
			description='Start your journey with TaskFlow'
			showSignInLink
		>
			<AuthForm
				onSubmit={handleSubmit}
				loading={loading}
				error={formError}
				isRegister
			/>
		</AuthLayout>
	);
}
