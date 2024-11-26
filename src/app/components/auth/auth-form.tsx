// components/auth/auth-form.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { AuthFormData, AuthError } from '@/app/types/auth';
import { Checkbox } from '@/components/ui/checkbox';

interface AuthFormProps {
	onSubmit: (data: AuthFormData) => void;
	isRegister?: boolean;
	loading?: boolean;
	error?: AuthError | null;
}

export function AuthForm({
	onSubmit,
	isRegister = false,
	loading = false,
	error = null,
}: AuthFormProps) {
	const [formData, setFormData] = useState<AuthFormData>({
		email: '',
		password: '',
		username: isRegister ? '' : undefined,
		rememberMe: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const inputClasses =
		'w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors';

	return (
		<motion.form
			onSubmit={handleSubmit}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className='space-y-4'
		>
			{isRegister && (
				<div>
					<input
						type='text'
						placeholder='Username'
						value={formData.username || ''}
						onChange={(e) =>
							setFormData({ ...formData, username: e.target.value })
						}
						className={inputClasses}
						required
					/>
				</div>
			)}
			{!isRegister && (
				<div className='flex items-center space-x-2'>
					<Checkbox
						id='remember'
						checked={formData.rememberMe}
						onCheckedChange={(checked) =>
							setFormData({ ...formData, rememberMe: checked as boolean })
						}
					/>
					<label
						htmlFor='remember'
						className='text-sm text-neutral-600 dark:text-neutral-400'
					>
						Remember me
					</label>
				</div>
			)}
			<div>
				<input
					type='email'
					placeholder='Email'
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					className={inputClasses}
					required
				/>
			</div>

			<div>
				<input
					type='password'
					placeholder='Password'
					value={formData.password}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
					className={inputClasses}
					required
				/>
			</div>

			{error && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-red-500 text-sm mt-2'
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
					<div className='flex items-center justify-center'>
						<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
					</div>
				) : isRegister ? (
					'Sign Up'
				) : (
					'Sign In'
				)}
			</Button>
		</motion.form>
	);
}
