// components/ui/app-preview.tsx
'use client';
import { motion } from 'framer-motion';

import Image from 'next/image';

export const AppPreview = () => {
	return (
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
				{/* Add your app screenshot or demo here */}
				<Image
					src='/path-to-your-screenshot.png' // Replace with your image path
					alt='TaskFlow App Preview'
					fill
					className='object-cover'
				/>

				{/* Optional overlay grid pattern */}
				<div className='absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]' />

				{/* Optional hover glow effect */}
				<div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20' />
			</div>
		</motion.div>
	);
};
