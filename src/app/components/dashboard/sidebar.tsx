// components/dashboard/sidebar.tsx
'use client';

import { IconLayoutKanban, IconHome, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
	collapsed: boolean;
	onCollapse: (collapsed: boolean) => void;
}

const menuItems = [
	{ icon: IconHome, label: 'Dashboard', href: '/dashboard' }, // Updated path
	{ icon: IconLayoutKanban, label: 'Boards', href: '/boards' },
	{ icon: IconSettings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
	const pathname = usePathname();

	return (
		<div
			className={cn(
				'bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 p-4 transition-all duration-300',
				collapsed ? 'w-20' : 'w-64'
			)}
		>
			{/* Logo/Title that links to landing page */}
			<Link
				href='/'
				className='flex items-center h-16 px-4 hover:opacity-80 transition-opacity'
			>
				{collapsed ? (
					<span className='text-2xl font-bold'>TF</span>
				) : (
					<h1 className='text-2xl font-bold'>TaskFlow</h1>
				)}
			</Link>

			<nav className='space-y-2 mt-8'>
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors relative',
								isActive
									? 'text-blue-500 z-10'
									: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
							)}
						>
							{isActive && (
								<motion.div
									layoutId='active-nav'
									className='absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-lg'
									initial={false}
									transition={{
										type: 'spring',
										stiffness: 500,
										damping: 30,
									}}
								/>
							)}
							<Icon className='w-5 h-5' />
							{!collapsed && (
								<span className='relative z-10'>{item.label}</span>
							)}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
