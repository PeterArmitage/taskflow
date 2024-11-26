// components/dashboard/navbar.tsx
'use client';

import { useState } from 'react';
import { IconSearch, IconBell, IconUser } from '@tabler/icons-react';
import { ThemeToggle } from '@/app/components/ui/theme-toggle';
import { User } from '@/app/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/app/components/ui/avatar';
import { UserMenu } from './user-menu';

interface NavbarProps {
	user: User;
}

interface Notification {
	id: string;
	title: string;
	message: string;
	time: string;
	read: boolean;
}

// Mock notifications - in real app, this would come from an API
const mockNotifications: Notification[] = [
	{
		id: '1',
		title: 'New Comment',
		message: 'John commented on your task',
		time: '5m ago',
		read: false,
	},
	{
		id: '2',
		title: 'Task Updated',
		message: 'Design task was updated',
		time: '1h ago',
		read: false,
	},
	{
		id: '3',
		title: 'Deadline Reminder',
		message: 'Project deadline in 2 days',
		time: '2h ago',
		read: true,
	},
];

export function Navbar({ user }: NavbarProps) {
	const [showNotifications, setShowNotifications] = useState(false);
	const [notifications, setNotifications] = useState(mockNotifications);
	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	return (
		<div className='h-16 border-b border-gray-200 dark:border-neutral-700 px-6 flex items-center justify-between bg-white dark:bg-neutral-900'>
			{/* Search */}
			<div className='relative flex-1 max-w-md'>
				<input
					type='text'
					placeholder='Search...'
					className='w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 transition-colors'
				/>
				<IconSearch className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
			</div>

			{/* Right section */}
			<div className='flex items-center gap-4'>
				{/* Notifications */}
				<div className='relative'>
					<button
						className='relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800'
						onClick={() => setShowNotifications(!showNotifications)}
					>
						<IconBell className='h-5 w-5' />
						{unreadCount > 0 && (
							<span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full' />
						)}
					</button>

					<AnimatePresence>
						{showNotifications && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className='absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 z-50'
							>
								<div className='p-4 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center'>
									<h3 className='font-medium'>Notifications</h3>
									{unreadCount > 0 && (
										<button
											onClick={markAllAsRead}
											className='text-sm text-blue-500 hover:text-blue-600'
										>
											Mark all as read
										</button>
									)}
								</div>
								<div className='max-h-[400px] overflow-y-auto'>
									{notifications.length > 0 ? (
										notifications.map((notification) => (
											<div
												key={notification.id}
												className={`p-4 border-b border-gray-200 dark:border-neutral-700 last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer ${
													!notification.read
														? 'bg-blue-50 dark:bg-blue-900/20'
														: ''
												}`}
												onClick={() => markAsRead(notification.id)}
											>
												<div className='flex justify-between'>
													<h4 className='font-medium text-sm'>
														{notification.title}
													</h4>
													<span className='text-xs text-gray-500'>
														{notification.time}
													</span>
												</div>
												<p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
													{notification.message}
												</p>
											</div>
										))
									) : (
										<div className='p-4 text-center text-gray-500'>
											No notifications
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<ThemeToggle />

				{/* User Menu */}
				<UserMenu user={user} />
			</div>
		</div>
	);
}
