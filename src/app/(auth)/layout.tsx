'use client';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthLayout({
	children,
	title,
	description,
	showSignInLink = false,
	showSignUpLink = false,
}: {
	children: React.ReactNode;
	title: string;
	description: string;
	showSignInLink?: boolean;
	showSignUpLink?: boolean;
}) {
	return (
		<div className='flex min-h-screen items-center justify-center relative'>
			<AuroraBackground className='absolute top-0 h-screen w-full opacity-40' />

			<div className='relative z-10 max-w-md w-full mx-4'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 bg-white/10 p-8 rounded-2xl'
				>
					<Link href='/' className='block text-center mb-6'>
						<h1 className='font-mono text-2xl font-bold'>TaskFlow</h1>
					</Link>

					<div className='text-center mb-8'>
						<h2 className='text-2xl font-bold mb-2'>{title}</h2>
						<p className='text-neutral-600 dark:text-neutral-400'>
							{description}
						</p>
					</div>

					{children}

					<div className='mt-6 text-center text-sm'>
						{showSignInLink && (
							<p>
								Already have an account?{' '}
								<Link
									href='/signin'
									className='text-blue-500 hover:text-blue-600'
								>
									Sign in
								</Link>
							</p>
						)}
						{showSignUpLink && (
							<p>
								Don&apos;t have an account?{' '}
								<Link
									href='/signup'
									className='text-blue-500 hover:text-blue-600'
								>
									Sign up
								</Link>
							</p>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
