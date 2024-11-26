// components/auth/reset-password-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const passwordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type ResetPasswordData = z.infer<typeof passwordSchema>;

interface ResetPasswordFormProps {
	onSubmit: (data: { password: string }) => Promise<void>;
	loading?: boolean;
	error?: { message: string } | null;
}

export const ResetPasswordForm = ({
	onSubmit,
	loading,
	error,
}: ResetPasswordFormProps) => {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordData>({
		resolver: zodResolver(passwordSchema),
	});

	const onFormSubmit = async (data: ResetPasswordData) => {
		try {
			await onSubmit({ password: data.password });
			setIsSubmitted(true);
		} catch (err) {
			console.error('Password reset failed:', err);
		}
	};

	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center p-6 space-y-4'
			>
				<h3 className='text-xl font-semibold'>Password Reset Successful</h3>
				<p className='text-neutral-600 dark:text-neutral-400'>
					Your password has been reset successfully. You can now sign in with
					your new password.
				</p>
			</motion.div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
			<div className='space-y-2'>
				<Input
					type='password'
					placeholder='New Password'
					{...register('password')}
					className={cn(errors.password && 'border-red-500')}
					disabled={loading}
				/>
				{errors.password && (
					<p className='text-sm text-red-500'>{errors.password.message}</p>
				)}
			</div>

			<div className='space-y-2'>
				<Input
					type='password'
					placeholder='Confirm Password'
					{...register('confirmPassword')}
					className={cn(errors.confirmPassword && 'border-red-500')}
					disabled={loading}
				/>
				{errors.confirmPassword && (
					<p className='text-sm text-red-500'>
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			{error && (
				<div className='p-3 rounded bg-red-50 text-red-500 text-sm'>
					{error.message}
				</div>
			)}

			<Button
				variant='sketch'
				type='submit'
				className='w-full'
				disabled={loading}
			>
				{loading ? 'Resetting Password...' : 'Reset Password'}
			</Button>
		</form>
	);
};
