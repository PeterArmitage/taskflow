// app/(dashboard)/settings/layout.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IconUser, IconMail, IconLock } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsTabs = [
	{
		title: 'Profile',
		href: '/settings/profile',
		icon: IconUser,
		description: 'Manage your personal information',
	},
	{
		title: 'Email Preferences',
		href: '/settings/email',
		icon: IconMail,
		description: 'Control how you receive email notifications',
	},
	{
		title: 'Security',
		href: '/settings/security',
		icon: IconLock,
		description: 'Update your password and security settings',
	},
];

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<div className='flex gap-8'>
				{/* Sidebar */}
				<div className='w-64 flex-shrink-0'>
					<h2 className='text-lg font-semibold mb-4'>Settings</h2>
					<nav className='space-y-1'>
						{settingsTabs.map((tab) => {
							const isActive = pathname === tab.href;
							return (
								<Link
									key={tab.href}
									href={tab.href}
									className={cn(
										'block w-full p-3 rounded-lg transition-colors relative',
										isActive
											? 'text-blue-500'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
									)}
								>
									{isActive && (
										<motion.div
											layoutId='activeSettingsTab'
											className='absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-lg'
											initial={false}
											transition={{
												type: 'spring',
												stiffness: 500,
												damping: 30,
											}}
										/>
									)}
									<div className='relative flex items-center gap-3'>
										<tab.icon className='w-5 h-5' />
										<div>
											<div className='font-medium'>{tab.title}</div>
											<div className='text-xs text-gray-500 dark:text-gray-400'>
												{tab.description}
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</nav>
				</div>

				{/* Content */}
				<div className='flex-1'>
					<div className='bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6'>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
