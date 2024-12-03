// components/dashboard/sidebar/index.tsx
'use client';

import { useState } from 'react';
import { IconLayoutKanban, IconHome, IconSettings } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
	Sidebar as AceSidebar,
	SidebarProvider,
	SidebarBody,
	SidebarLink,
} from '@/app/components/ui/sidebar';

// Define our menu items interface
interface MenuItem {
	icon: typeof IconHome;
	label: string;
	href: string;
}

// Menu items configuration
const menuItems: MenuItem[] = [
	{ icon: IconHome, label: 'Dashboard', href: '/dashboard' },
	{ icon: IconLayoutKanban, label: 'Boards', href: '/boards' },
	{ icon: IconSettings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
	// State for controlling sidebar collapse
	const [isOpen, setIsOpen] = useState(true);

	return (
		<AceSidebar>
			<SidebarProvider>
				<SidebarBody className='border-r border-gray-200 dark:border-neutral-800'>
					{/* Logo Section */}
					<div className='px-4 py-4'>
						<motion.div
							animate={{ width: isOpen ? 'auto' : '40px' }}
							className='overflow-hidden'
						>
							{isOpen ? (
								<h1 className='text-2xl font-bold'>TaskFlow</h1>
							) : (
								<span className='text-2xl font-bold'>TF</span>
							)}
						</motion.div>
					</div>

					{/* Navigation Links */}
					<nav className='mt-8 px-2'>
						{menuItems.map((item) => (
							<SidebarLink
								key={item.href}
								link={{
									label: item.label,
									href: item.href,
									icon: (
										<item.icon className='w-5 h-5 text-neutral-700 dark:text-neutral-200' />
									),
								}}
								className='mb-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors'
							/>
						))}
					</nav>

					{/* Collapse Control */}
					{/* <div className='mt-auto px-4 py-4'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='w-full p-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors'
						>
							{isOpen ? 'Collapse' : ''}
						</button>
					</div> */}
				</SidebarBody>
			</SidebarProvider>
		</AceSidebar>
	);
}
