// components/landing/features.tsx
'use client';
import { motion } from 'framer-motion';
import { ContainerScroll } from '../ui/container-scroll';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import {
	KanbanSquare,
	Users2,
	Zap,
	Lock,
	BarChart2,
	Workflow,
} from 'lucide-react';
import { SlideIn } from '../ui/animations';
import { cn } from '@/lib/utils';

export const Features = () => {
	return (
		<section id='features' className='py-10 bg-gray-50 dark:bg-neutral-900'>
			<ContainerScroll
				titleComponent={
					<>
						<h1 className='text-4xl font-semibold text-black dark:text-white'>
							TaskFlow helps teams <br />
							<span className='text-4xl md:text-[6rem] font-bold mt-1 leading-none'>
								move work forward
							</span>
						</h1>
					</>
				}
			>
				<motion.div className='flex flex-col gap-8 py-4'>
					<BentoGrid className='max-w-4xl mx-auto md:p-4'>
						{bentoItems.map((item, i) => (
							<BentoGridItem
								key={i}
								title={item.title}
								description={item.description}
								header={
									<div className='flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800'>
										<item.icon className='h-8 w-8 text-blue-500' />
									</div>
								}
								className={cn('md:col-span-1', item.className)}
							/>
						))}
					</BentoGrid>
				</motion.div>
			</ContainerScroll>

			<div className='max-w-7xl mx-auto px-4 mt-10'>
				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
						<SlideIn
							key={feature.title}
							direction='up'
							delay={index * 0.1}
							className='group'
						>
							<motion.div
								whileHover={{ y: -5 }}
								className='bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all'
							>
								<div className='mb-4'>
									<feature.icon className='h-8 w-8 text-blue-500' />
								</div>
								<h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
								<p className='text-gray-600 dark:text-gray-300'>
									{feature.description}
								</p>
							</motion.div>
						</SlideIn>
					))}
				</div>

				<div className='mt-16'>
					<div className='relative w-full aspect-[16/9] rounded-lg overflow-hidden'>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							whileInView={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.6 }}
							className='absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800'
						>
							{/* Placeholder for board preview */}
							<div className='absolute inset-0 flex items-center justify-center'>
								<KanbanSquare className='h-24 w-24 text-white/20' />
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
};

// Bento grid items for the header section
const bentoItems = [
	{
		title: 'Visual Project Management',
		description:
			'Organize and visualize your workflow with powerful Kanban boards.',
		icon: KanbanSquare,
		className: 'md:col-span-2',
	},
	{
		title: 'Real-time Collaboration',
		description: 'Work together seamlessly with instant updates.',
		icon: Users2,
	},
	{
		title: 'Smart Automation',
		description: 'Automate repetitive tasks and streamline workflows.',
		icon: Workflow,
	},
];

// Original features for the grid section
const features = [
	{
		title: 'Boards',
		description:
			"Create boards to organize everything you're working on, add tasks, and visualize your workflow.",
		icon: KanbanSquare,
	},
	{
		title: 'Team Collaboration',
		description:
			'Invite team members to boards and lists. Collaboration has never been easier.',
		icon: Users2,
	},
	{
		title: 'Power-Ups',
		description:
			'Power-up your workflow with integrations, custom fields, and advanced checklists.',
		icon: Zap,
	},
	{
		title: 'Security',
		description:
			'Enterprise-grade security and administration controls keep your data safe.',
		icon: Lock,
	},
	{
		title: 'Analytics',
		description:
			'Track team productivity and project progress with built-in analytics.',
		icon: BarChart2,
	},
	{
		title: 'Automation',
		description:
			'Automate repetitive tasks and workflows with Butler automation.',
		icon: Workflow,
	},
];
