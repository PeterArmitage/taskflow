import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { motion } from 'framer-motion';

interface ForgotPasswordData {
	email: string;
}

export function ForgotPasswordForm({
	onSubmit,
	loading = false,
	error = null,
}: {
	onSubmit: (data: ForgotPasswordData) => void;
	loading?: boolean;
	error?: { message: string } | null;
}) {
	const [email, setEmail] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ email });
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
					type='email'
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
					required
				/>
			</div>

			{error && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-red-500 text-sm'
				>
					{error.message}
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
