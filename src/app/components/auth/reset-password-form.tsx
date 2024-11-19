import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'framer-motion';

interface ResetPasswordData {
	password: string;
	confirmPassword: string;
}

export function ResetPasswordForm({
	onSubmit,
	loading = false,
	error = null,
}: {
	onSubmit: (data: ResetPasswordData) => void;
	loading?: boolean;
	error?: { message: string } | null;
}) {
	const [data, setData] = useState<ResetPasswordData>({
		password: '',
		confirmPassword: '',
	});
	const [validationError, setValidationError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		if (data.password.length < 8) {
			setValidationError('Password must be at least 8 characters long');
			return;
		}

		if (data.password !== data.confirmPassword) {
			setValidationError('Passwords do not match');
			return;
		}

		onSubmit(data);
	};

	return (
		<motion.form
			onSubmit={handleSubmit}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='space-y-4'
		>
			<div>
				<input
					type='password'
					placeholder='New password'
					value={data.password}
					onChange={(e) => setData({ ...data, password: e.target.value })}
					className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
					required
				/>
			</div>

			<div>
				<input
					type='password'
					placeholder='Confirm new password'
					value={data.confirmPassword}
					onChange={(e) =>
						setData({ ...data, confirmPassword: e.target.value })
					}
					className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
					required
				/>
			</div>

			{(error || validationError) && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-red-500 text-sm'
				>
					{validationError || error?.message}
				</motion.p>
			)}

			<Button
				variant='sketch'
				className='w-full'
				type='submit'
				disabled={loading}
			>
				{loading ? (
					<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white' />
				) : (
					'Reset Password'
				)}
			</Button>
		</motion.form>
	);
}
