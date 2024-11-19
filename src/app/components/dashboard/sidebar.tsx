// components/dashboard/sidebar.tsx
import { useAuth } from '@/app/providers/auth-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	IconLayoutDashboard,
	IconUsers,
	IconSettings,
	IconLogout,
	IconChevronLeft,
	IconChevronRight,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface NavItem {
	icon: typeof IconLayoutDashboard;
	label: string;
	href: string;
}

const navItems: NavItem[] = [
	{
		icon: IconLayoutDashboard,
		label: 'Dashboard',
		href: '/dashboard',
	},
	{
		icon: IconUsers,
		label: 'Team',
		href: '/dashboard/team',
	},
	{
		icon: IconSettings,
		label: 'Settings',
		href: '/dashboard/settings',
	},
];

export function Sidebar({
	collapsed,
	setCollapsed,
}: {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
}) {
	const { user, signout } = useAuth();
	const pathname = usePathname();

	return (
		<div
			className={`fixed inset-y-0 left-0 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transition-all duration-200 ${
				collapsed ? 'w-20' : 'w-64'
			}`}
		>
			<div className='flex flex-col h-full'>
				{/* Header */}
				<div className='flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-neutral-700'>
					<Link href='/dashboard' className='flex items-center'>
						{!collapsed && (
							<span className='text-xl font-semibold'>TaskFlow</span>
						)}
					</Link>
					<button
						onClick={() => setCollapsed(!collapsed)}
						className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700'
					>
						{collapsed ? (
							<IconChevronRight className='w-5 h-5' />
						) : (
							<IconChevronLeft className='w-5 h-5' />
						)}
					</button>
				</div>

				{/* Navigation */}
				<nav className='flex-1 overflow-y-auto py-4'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center px-4 py-2 my-1 mx-2 rounded-lg transition-colors relative ${
									isActive
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
								}`}
							>
								{isActive && (
									<motion.div
										layoutId='activeNav'
										className='absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg'
									/>
								)}
								<item.icon
									className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`}
								/>
								{!collapsed && <span>{item.label}</span>}
							</Link>
						);
					})}
				</nav>

				{/* Footer */}
				<div className='border-t border-gray-200 dark:border-neutral-700 p-4'>
					<div className='flex items-center'>
						<div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700' />
						{!collapsed && (
							<div className='ml-3'>
								<p className='text-sm font-medium'>{user?.username}</p>
								<p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
									{user?.email}
								</p>
							</div>
						)}
					</div>
					<button
						onClick={signout}
						className={`mt-4 flex items-center text-red-600 hover:text-red-700 ${
							collapsed ? 'justify-center w-full' : ''
						}`}
					>
						<IconLogout className='w-5 h-5' />
						{!collapsed && <span className='ml-2'>Sign out</span>}
					</button>
				</div>
			</div>
		</div>
	);
}
