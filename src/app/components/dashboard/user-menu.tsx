// components/dashboard/user-menu.tsx
'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconUser,
	IconSettings,
	IconMail,
	IconLock,
	IconLogout,
	IconChevronRight,
} from '@tabler/icons-react';
import { User } from '@/app/types/auth';
import { Avatar } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useState } from 'react';

interface UserMenuProps {
	user: User;
}

export function UserMenu({ user }: UserMenuProps) {
	const router = useRouter();
	const { signout } = useAuth();
	const [open, setOpen] = useState(false);

	const menuItems = [
		{
			icon: IconUser,
			label: 'Profile',
			onClick: () => {
				router.push('/settings/profile');
				setOpen(false);
			},
		},
		{
			icon: IconMail,
			label: 'Email Preferences',
			onClick: () => {
				router.push('/settings/email');
				setOpen(false);
			},
		},
		{
			icon: IconLock,
			label: 'Security',
			onClick: () => {
				router.push('/settings/security');
				setOpen(false);
			},
		},
		{
			icon: IconSettings,
			label: 'Settings',
			onClick: () => {
				router.push('/settings');
				setOpen(false);
			},
		},
		{
			icon: IconLogout,
			label: 'Sign Out',
			onClick: () => {
				signout();
				setOpen(false);
			},
			className: 'text-red-600 dark:text-red-400',
		},
	];

	return (
		<DropdownMenu.Root open={open} onOpenChange={setOpen}>
			<DropdownMenu.Trigger asChild>
				<button
					className={cn(
						'flex items-center gap-3 ml-4 outline-none rounded-full transition-colors',
						open && 'bg-gray-100 dark:bg-neutral-800'
					)}
				>
					<Avatar
						src={user.avatar_url}
						fallback={user.username?.[0]?.toUpperCase() || 'U'}
						className={cn(
							'h-8 w-8 cursor-pointer transition-all',
							open ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-500'
						)}
					/>
					<div className='hidden md:block pr-2'>
						<p className='text-sm font-medium text-left'>{user.username}</p>
						<p className='text-xs text-gray-500 dark:text-gray-400 text-left'>
							{user.email}
						</p>
					</div>
				</button>
			</DropdownMenu.Trigger>

			<AnimatePresence>
				{open && (
					<DropdownMenu.Portal forceMount>
						<DropdownMenu.Content
							align='end'
							sideOffset={5}
							className='z-50'
							asChild
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className='min-w-[240px] rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-lg p-2'
							>
								<div className='px-2 py-3 mb-2 border-b border-gray-100 dark:border-neutral-800'>
									<p className='font-medium'>{user.username}</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{user.email}
									</p>
								</div>

								{menuItems.map((item, idx) => (
									<DropdownMenu.Item
										key={idx}
										onSelect={item.onClick}
										className={cn(
											'flex items-center gap-2 px-2 py-2 text-sm rounded-lg outline-none cursor-pointer',
											'hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors',
											'focus:bg-gray-100 dark:focus:bg-neutral-800',
											item.className
										)}
									>
										<item.icon className='h-4 w-4' />
										<span className='flex-1'>{item.label}</span>
										<IconChevronRight className='h-4 w-4 text-gray-400' />
									</DropdownMenu.Item>
								))}
							</motion.div>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				)}
			</AnimatePresence>
		</DropdownMenu.Root>
	);
}
