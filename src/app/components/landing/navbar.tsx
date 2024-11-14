// components/landing/navbar.tsx
'use client';
import Link from 'next/link';
import { Menu, MenuItem } from '../ui/navbar-menu';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
	IconLayoutKanban,
	IconUsers,
	IconListCheck,
	IconReportAnalytics,
	IconCreditCard,
	IconBuilding,
	IconBuildingSkyscraper,
	IconBriefcase,
} from '@tabler/icons-react';
import { NavItem } from '@/app/types/navigation';
import { AuroraBackground } from '../ui/aurora-background';
import { useRouter } from 'next/navigation';

const navigation: NavItem[] = [
	{
		title: 'Features',
		type: 'section',
		href: '#features',
		items: [
			{
				title: 'Views & Boards',
				description: 'Visualize your work in different ways',
				icon: <IconLayoutKanban className='w-4 h-4' />,
				href: '/features/views',
				type: 'page',
			},
			{
				title: 'Team Collaboration',
				description: 'Work together seamlessly',
				icon: <IconUsers className='w-4 h-4' />,
				href: '/features/collaboration',
				type: 'page',
			},
			{
				title: 'Task Management',
				description: 'Organize and track your tasks',
				icon: <IconListCheck className='w-4 h-4' />,
				href: '/features/tasks',
				type: 'page',
			},
			{
				title: 'Analytics',
				description: 'Track progress and performance',
				icon: <IconReportAnalytics className='w-4 h-4' />,
				href: '/features/analytics',
				type: 'page',
			},
		],
	},
	{
		title: 'Solutions',
		type: 'section',
		href: '#solutions',
		items: [
			{
				title: 'Enterprise',
				description: 'For large organizations',
				icon: <IconBuildingSkyscraper className='w-4 h-4' />,
				href: '/features/solutions/enterprise',
				type: 'page',
			},
			{
				title: 'Small Business',
				description: 'For growing teams',
				icon: <IconBriefcase className='w-4 h-4' />,
				href: '/features/solutions/small-business',
				type: 'page',
			},
		],
	},
	{
		title: 'Pricing',
		type: 'section',
		href: '#pricing',
		items: [
			{
				title: 'Free',
				description: 'For individuals and small teams',
				icon: <IconUsers className='w-4 h-4' />,
				href: '#pricing',
				type: 'section',
			},
			{
				title: 'Professional',
				description: 'For growing teams and organizations',
				icon: <IconCreditCard className='w-4 h-4' />,
				href: '#pricing',
				type: 'section',
			},
			{
				title: 'Enterprise',
				description: 'For large organizations',
				icon: <IconBuilding className='w-4 h-4' />,
				href: '#pricing',
				type: 'section',
			},
		],
	},
];
const PriceTag = ({ price }: { price: string }) => (
	<span className='inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:text-blue-400 dark:bg-blue-900/50'>
		{price}
	</span>
);
export const LandingNavbar = () => {
	const [, setActiveItem] = useState<string | null>(null);
	const pathname = usePathname();
	const router = useRouter();
	const isHomePage = pathname === '/';

	const handleNavigation = (href: string, type: 'section' | 'page') => {
		console.log('handleNavigation called with:', { href, type });

		if (href.includes('pricing')) {
			const pricingSection = document.querySelector('#pricing');
			if (pricingSection) {
				pricingSection.scrollIntoView({ behavior: 'smooth' });
			}
			return;
		}

		if (isHomePage && type === 'section') {
			const element = document.querySelector(href);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			router.push(href);
		}
	};
	const handleMenuClick = (
		item: NavItem | NonNullable<NavItem['items']>[number]
	) => {
		console.log('Navigating to:', item.href, 'Type:', item.type);
		const type = item.type;
		const href = item.href;
		handleNavigation(href, type);
	};
	return (
		<div className='relative'>
			<AuroraBackground className='absolute top-0 h-[100vh] w-full opacity-40' />

			<nav className='fixed top-0 w-full h-16 px-4 border-b flex items-center z-50'>
				<div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
					{/* Left side with logo and nav items */}
					<div className='flex items-center gap-x-8'>
						<Link href='/'>
							<h1 className='font-mono text-xl md:text-3xl font-bold'>
								TaskFlow
							</h1>
						</Link>

						{/* Desktop Navigation */}
						<div className='hidden md:flex items-center'>
							<Menu setActive={setActiveItem}>
								{navigation.map((item) => (
									<MenuItem
										key={item.title}
										item={item.title}
										onClick={() => handleMenuClick(item)}
									>
										{item.items && (
											<div className='flex flex-col space-y-4 text-sm'>
												{item.items.map((subItem) => (
													<div
														key={subItem.title}
														onClick={(e) => {
															e.stopPropagation();
															handleMenuClick(subItem);
														}}
														className='flex items-center p-2 -m-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer'
													>
														{subItem.icon}
														<div className='ml-3 flex-1'>
															<div className='flex items-center justify-between'>
																<p className='font-medium text-sm'>
																	{subItem.title}
																</p>
																{subItem.title === 'Free' && (
																	<PriceTag price='$0' />
																)}
																{subItem.title === 'Professional' && (
																	<PriceTag price='$12/mo' />
																)}
																{subItem.title === 'Enterprise' && (
																	<PriceTag price='$29/mo' />
																)}
															</div>
															<p className='text-xs text-neutral-500'>
																{subItem.description}
															</p>
														</div>
													</div>
												))}
											</div>
										)}
									</MenuItem>
								))}
							</Menu>
						</div>
					</div>

					{/* Right side auth buttons */}
					<div className='flex items-center gap-x-4'>
						<button className='px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'>
							Login
						</button>
						<button className='px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'>
							Get TaskFlow for free
						</button>
					</div>
				</div>
			</nav>
		</div>
	);
};
