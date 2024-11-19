// components/ui/loading.tsx
'use client';

import { motion } from 'framer-motion';

export const Loading = () => {
	return (
		<div className='h-screen w-full flex flex-col items-center justify-center bg-dot-pattern relative'>
			{/* Background gradient overlay */}
			<div className='absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent dark:from-neutral-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />

			<div className='relative'>
				{/* Loading dots */}
				<div className='flex space-x-2'>
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							className='w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400'
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.6, 1, 0.6],
							}}
							transition={{
								duration: 1,
								repeat: Infinity,
								delay: i * 0.2,
							}}
						/>
					))}
				</div>

				{/* Loading text */}
				<motion.p
					className='mt-4 text-sm text-gray-600 dark:text-gray-400'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					Loading your workspace...
				</motion.p>
			</div>
		</div>
	);
};
