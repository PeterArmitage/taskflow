'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconUsers,
	IconMessage2,
	IconArrowsShuffle,
	IconLiveView,
	IconCheckbox,
	IconNotification,
} from '@tabler/icons-react';
import { ContainerScroll } from '@/app/components/ui/container-scroll';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { FadeIn } from '@/app/components/ui/animations';
import { WobbleCard } from '@/app/components/ui/wobble-card';

interface CollaborationFeature {
	title: string;
	description: string;
	icon: typeof IconUsers;
}

const collaborationFeatures: CollaborationFeature[] = [
	{
		title: 'Real-time Collaboration',
		description:
			'Work together in real-time with your team members. See changes as they happen.',
		icon: IconLiveView,
	},
	{
		title: 'Team Chat',
		description:
			'Built-in messaging to discuss tasks and share updates without leaving the platform.',
		icon: IconMessage2,
	},
	{
		title: 'Workflow Automation',
		description:
			'Automate routine tasks and keep everyone in sync with custom workflows.',
		icon: IconArrowsShuffle,
	},
	{
		title: 'Task Assignment',
		description:
			'Easily assign tasks to team members and track progress in real-time.',
		icon: IconCheckbox,
	},
	{
		title: 'Team Management',
		description:
			'Organize teams, set permissions, and manage access levels with ease.',
		icon: IconUsers,
	},
	{
		title: 'Smart Notifications',
		description:
			'Stay updated with intelligent notifications about important changes and mentions.',
		icon: IconNotification,
	},
];

const InteractiveDemo = () => {
	return (
		<WobbleCard className='w-full p-8'>
			<div className='grid grid-cols-3 gap-4 h-[400px]'>
				{/* Left Column - Team Members */}
				<div className='col-span-1 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Team Members</h3>
					{['John D.', 'Sarah M.', 'Mike R.'].map((member, i) => (
						<motion.div
							key={member}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.2 }}
							className='flex items-center gap-2 p-2 rounded-md hover:bg-white/5'
						>
							<div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400' />
							<span>{member}</span>
							<div className='ml-auto w-2 h-2 rounded-full bg-green-400' />
						</motion.div>
					))}
				</div>

				{/* Middle Column - Active Task */}
				<div className='col-span-1 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Current Task</h3>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='space-y-4'
					>
						<div className='p-3 rounded bg-white/5'>
							<h4 className='font-medium'>Update Homepage Design</h4>
							<p className='text-sm text-neutral-400'>In Progress</p>
						</div>
						<div className='flex gap-2'>
							<div className='w-6 h-6 rounded-full bg-purple-400 -ml-1' />
							<div className='w-6 h-6 rounded-full bg-blue-400 -ml-1' />
						</div>
					</motion.div>
				</div>

				{/* Right Column - Live Chat */}
				<div className='col-span-1 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Team Chat</h3>
					<div className='space-y-4'>
						{[
							{ user: 'Sarah M.', message: 'Added new color variations' },
							{ user: 'John D.', message: 'Looking good! Ship it 🚀' },
						].map((chat, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.3 }}
								className='p-2 rounded bg-white/5'
							>
								<p className='text-sm font-medium'>{chat.user}</p>
								<p className='text-sm text-neutral-400'>{chat.message}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</WobbleCard>
	);
};

const CollaborationPage = () => {
	return (
		<div className='relative min-h-screen'>
			<AuroraBackground className='absolute top-0 h-full w-full opacity-40' />
			<div className='relative z-10 max-w-7xl mx-auto px-4 py-20'>
				{/* Hero Section */}
				<section className='text-center mb-20'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-bold mb-6'
					>
						Better Together
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Empower your team with powerful collaboration tools. Work seamlessly
						together, no matter where you are.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Button variant='sketch' size='lg'>
							Start Collaborating Free
						</Button>
					</motion.div>
				</section>

				{/* Features Section */}
				<ContainerScroll
					titleComponent={
						<h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>
							Everything you need for seamless collaboration
						</h2>
					}
				>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
						{collaborationFeatures.map((feature, index) => (
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

				{/* Interactive Demo Section */}
				<FadeIn className='mb-20'>
					<h2 className='text-3xl font-bold text-center mb-10'>
						See collaboration in action
					</h2>
					<InteractiveDemo />
				</FadeIn>

				{/* CTA Section */}
				<section className='text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Ready to transform your team&apos;s workflow?
					</h2>
					<p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8'>
						Join thousands of teams already using TaskFlow
					</p>
					<Button variant='sketch' size='lg'>
						Get Started Free
					</Button>
				</section>
			</div>
		</div>
	);
};

export default CollaborationPage;
