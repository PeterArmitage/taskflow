// components/ui/floating-nav.tsx
'use client';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export const FloatingNav = () => {
	const { scrollY } = useScroll();
	const [hidden, setHidden] = useState(true);

	useMotionValueEvent(scrollY, 'change', (latest) => {
		if (latest > 150) {
			setHidden(false);
		} else {
			setHidden(true);
		}
	});

	return (
		<motion.div
			variants={{
				visible: { y: 0, opacity: 1 },
				hidden: { y: 100, opacity: 0 },
			}}
			animate={hidden ? 'hidden' : 'visible'}
			transition={{ duration: 0.35, ease: 'easeInOut' }}
			className='fixed bottom-10 inset-x-0 max-w-fit mx-auto z-50'
		>
			<nav className='flex items-center gap-4 px-8 py-3 rounded-full border border-black/[0.2] dark:border-white/[0.2] bg-white/50 dark:bg-black/50 backdrop-blur-md'>
				<Link
					href='#features'
					className='text-sm font-medium text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors'
				>
					Features
				</Link>
				<Link
					href='#about'
					className='text-sm font-medium text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors'
				>
					About
				</Link>
				<Link
					href='#pricing'
					className='text-sm font-medium text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors'
				>
					Pricing
				</Link>
			</nav>
		</motion.div>
	);
};
