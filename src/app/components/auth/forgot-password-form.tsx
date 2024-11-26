'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
	onSubmit: (data: { email: string }) => Promise<void>;
	loading?: boolean;
	error?: { message: string } | null;
	className?: string;
}

export const ForgotPasswordForm = ({
	onSubmit,
	loading,
	error,
	className,
}: ForgotPasswordFormProps) => {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onFormSubmit = async (data: ForgotPasswordData) => {
		try {
			await onSubmit(data);
			setIsSubmitted(true);
		} catch (error) {
			console.error('Password reset request failed:', error);
		}
	};

	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center p-6 space-y-4'
			>
				<h3 className='text-xl font-semibold'>Check your email</h3>
				<p className='text-neutral-600 dark:text-neutral-400'>
					If an account exists for {register('email').name}, you will receive
					password reset instructions.
				</p>
			</motion.div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className={cn('space-y-4', className)}
		>
			<div className='space-y-2'>
				<Input
					type='email'
					placeholder='Enter your email'
					{...register('email')}
					className={cn(
						'w-full px-3 py-2 border rounded-md',
						errors.email && 'border-red-500'
					)}
					disabled={loading}
				/>
				{errors.email && (
					<p className='text-sm text-red-500'>{errors.email.message}</p>
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
				{loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
			</Button>
		</form>
	);
};
