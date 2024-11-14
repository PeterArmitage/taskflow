'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconBriefcase,
	IconCash,
	IconChartBar,
	IconUsers,
	IconRocket,
	IconTools,
} from '@tabler/icons-react';
import { ContainerScroll } from '@/app/components/ui/container-scroll';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { WobbleCard } from '@/app/components/ui/wobble-card';

interface BusinessFeature {
	title: string;
	description: string;
	icon: typeof IconBriefcase;
}

const businessFeatures: BusinessFeature[] = [
	{
		title: 'Affordable Plans',
		description: 'Flexible pricing that grows with your business needs.',
		icon: IconCash,
	},
	{
		title: 'Quick Setup',
		description: 'Get started in minutes with our intuitive onboarding.',
		icon: IconRocket,
	},
	{
		title: 'Core Features',
		description: 'All essential tools for effective team collaboration.',
		icon: IconTools,
	},
	{
		title: 'Team Management',
		description: 'Easily manage small to medium-sized teams.',
		icon: IconUsers,
	},
	{
		title: 'Basic Analytics',
		description: 'Track progress with simple, actionable metrics.',
		icon: IconChartBar,
	},
	{
		title: 'Business Templates',
		description: 'Pre-built templates for common business needs.',
		icon: IconBriefcase,
	},
];

const BusinessDemo = () => {
	return (
		<WobbleCard className='w-full p-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]'>
				{/* Quick Start Guide */}
				<div className='bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Quick Start Guide</h3>
					<div className='space-y-4'>
						{[
							{ step: '1. Create Account', status: 'Complete' },
							{ step: '2. Import Data', status: 'In Progress' },
							{ step: '3. Invite Team', status: 'Pending' },
							{ step: '4. Set Goals', status: 'Pending' },
						].map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.1 }}
								className='flex items-center justify-between p-3 rounded bg-white/5'
							>
								<span>{item.step}</span>
								<span
									className={`text-sm ${
										item.status === 'Complete'
											? 'text-green-400'
											: item.status === 'In Progress'
												? 'text-blue-400'
												: 'text-neutral-400'
									}`}
								>
									{item.status}
								</span>
							</motion.div>
						))}
					</div>
				</div>

				{/* Business Growth */}
				<div className='bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Business Growth</h3>
					<div className='space-y-6'>
						<div className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span>Team Productivity</span>
								<span>78%</span>
							</div>
							<motion.div
								className='h-2 bg-white/10 rounded-full overflow-hidden'
								initial={{ width: 0 }}
								animate={{ width: '100%' }}
							>
								<motion.div
									className='h-full bg-blue-500'
									initial={{ width: 0 }}
									animate={{ width: '78%' }}
									transition={{ delay: 0.5 }}
								/>
							</motion.div>
						</div>

						<div className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span>Projects Completed</span>
								<span>12/15</span>
							</div>
							<motion.div
								className='h-2 bg-white/10 rounded-full overflow-hidden'
								initial={{ width: 0 }}
								animate={{ width: '100%' }}
							>
								<motion.div
									className='h-full bg-green-500'
									initial={{ width: 0 }}
									animate={{ width: '80%' }}
									transition={{ delay: 0.7 }}
								/>
							</motion.div>
						</div>

						<div className='mt-4 p-3 rounded bg-white/5'>
							<h4 className='text-sm font-medium mb-2'>Monthly Summary</h4>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-2xl font-bold'>15</p>
									<p className='text-xs text-neutral-400'>Active Projects</p>
								</div>
								<div>
									<p className='text-2xl font-bold'>8</p>
									<p className='text-xs text-neutral-400'>Team Members</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</WobbleCard>
	);
};

const SmallBusinessPage = () => {
	return (
		<div className='relative min-h-screen'>
			<AuroraBackground className='absolute top-0 h-full w-full opacity-40' />
			<div className='relative z-10 max-w-7xl mx-auto px-4 py-20'>
				<section className='text-center mb-20'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-bold mb-6'
					>
						Built for Growing Teams
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Affordable, scalable solutions designed for small and growing
						businesses.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='flex gap-4 justify-center'
					>
						<Button variant='sketch' size='lg'>
							Start Free Trial
						</Button>
						<Button variant='sketch' size='lg'>
							View Pricing
						</Button>
					</motion.div>
				</section>

				<ContainerScroll
					titleComponent={
						<h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>
							Everything you need to succeed
						</h2>
					}
				>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
						{businessFeatures.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className='relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/10 backdrop-blur-sm'
							>
								<div className='flex items-center gap-4 mb-4'>
									<feature.icon className='h-8 w-8 text-blue-500' />
									<h3 className='text-xl font-bold'>{feature.title}</h3>
								</div>
								<p className='text-neutral-600 dark:text-neutral-300'>
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</ContainerScroll>

				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-center mb-10'>
						Getting Started is Easy
					</h2>
					<BusinessDemo />
				</section>

				<section className='text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Ready to grow your business?
					</h2>
					<p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8'>
						Join thousands of small businesses already using TaskFlow
					</p>
					<Button variant='sketch' size='lg'>
						Start Free Trial
					</Button>
				</section>
			</div>
		</div>
	);
};

export default SmallBusinessPage;
