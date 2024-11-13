// components/landing/hero.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

// Dynamic imports with no SSR
const TypewriterEffect = dynamic(
	() => import('../ui/typewriter-effect').then((mod) => mod.TypewriterEffect),
	{
		ssr: false,
	}
);

export const Hero = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const words = [
		{ text: 'Organize' },
		{ text: 'collaborate,' },
		{ text: 'and' },
		{ text: 'succeed' },
		{ text: 'with' },
		{ text: 'TaskFlow.', className: 'text-blue-500 dark:text-blue-500' },
	];

	// Return loading state or null while client-side code is hydrating
	if (!isMounted) {
		return null;
	}

	return (
		<div className='relative min-h-screen'>
			<div className='relative flex flex-col items-center justify-center min-h-screen'>
				<div className='relative px-4 pt-20 pb-8 mx-auto max-w-7xl text-center z-10'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<TypewriterEffect words={words} />
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className='mt-6 text-lg md:text-xl text-black/80 max-w-2xl mx-auto'
						>
							Bring your team&apos;s work together in one place. From big
							projects to personal tasks, TaskFlow helps teams move work
							forward.
						</motion.p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4'
					>
						<Button variant='sketch'>Get Started Free</Button>
						<Button variant='sketch'>Learn More</Button>
					</motion.div>
				</div>

				{/* Preview Image */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					whileHover={{ scale: 1.02 }}
					transition={{
						type: 'spring',
						stiffness: 100,
						damping: 20,
					}}
					className='w-full max-w-4xl mx-auto px-4 mt-20'
				>
					<div className='relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800'>
						<div className='absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]' />
					</div>
				</motion.div>
			</div>
		</div>
	);
};
