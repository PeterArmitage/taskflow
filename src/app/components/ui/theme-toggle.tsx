'use client';
import { useTheme } from '@/app/providers/theme-provider';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => {
				setTheme(
					theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
				);
			}}
			className='px-3 py-2 rounded-full bg-hidden  transition-colors'
		>
			{theme === 'dark' ? (
				<Moon className='h-5 w-5 ' />
			) : (
				<Sun className='h-5 w-5 text-yellow-400' />
			)}
		</motion.button>
	);
};
