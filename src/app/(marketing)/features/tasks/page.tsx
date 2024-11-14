'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconCheckbox,
	IconChecklist,
	IconClipboardList,
	IconTags,
	IconCalendarStats,
	IconRotateClockwise,
} from '@tabler/icons-react';
import { ContainerScroll } from '@/app/components/ui/container-scroll';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { WobbleCard } from '@/app/components/ui/wobble-card';

interface TaskFeature {
	title: string;
	description: string;
	icon: typeof IconCheckbox;
}

const taskFeatures: TaskFeature[] = [
	{
		title: 'Smart Task Creation',
		description: 'Create tasks with rich text, attachments, and custom fields.',
		icon: IconCheckbox,
	},
	{
		title: 'Task Lists & Checklists',
		description: 'Organize tasks into lists and break them down into subtasks.',
		icon: IconChecklist,
	},
	{
		title: 'Labels & Tags',
		description: 'Categorize and filter tasks with customizable labels.',
		icon: IconTags,
	},
	{
		title: 'Due Dates & Reminders',
		description: 'Set deadlines and get notified before tasks are due.',
		icon: IconCalendarStats,
	},
	{
		title: 'Task Templates',
		description: 'Create reusable templates for recurring tasks and workflows.',
		icon: IconClipboardList,
	},
	{
		title: 'Task History',
		description:
			'Track changes and maintain a complete history of task updates.',
		icon: IconRotateClockwise,
	},
];

const TaskDemo = () => {
	return (
		<WobbleCard className='w-full p-8'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]'>
				{/* Templates Section */}
				<div className='col-span-1 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Task Templates</h3>
					{['Bug Report', 'Feature Request', 'Sprint Planning'].map(
						(template, i) => (
							<motion.div
								key={template}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.2 }}
								className='p-3 mb-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer'
							>
								<p className='font-medium'>{template}</p>
								<p className='text-xs text-neutral-400'>Click to create task</p>
							</motion.div>
						)
					)}
				</div>

				{/* Active Task Section */}
				<div className='col-span-2 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Current Task</h3>
					<div className='space-y-4'>
						<div className='p-4 rounded-lg bg-white/5'>
							<div className='flex items-center justify-between mb-2'>
								<h4 className='font-medium'>Implement Dark Mode</h4>
								<span className='px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300'>
									In Progress
								</span>
							</div>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<IconCalendarStats className='w-4 h-4' />
									<span className='text-sm'>Due tomorrow</span>
								</div>
								<div className='bg-white/5 p-2 rounded'>
									<p className='text-sm'>Checklist (2/4):</p>
									{[
										{ text: 'Add theme toggle', done: true },
										{ text: 'Update color variables', done: true },
										{ text: 'Test all components', done: false },
										{ text: 'Update documentation', done: false },
									].map((item, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: i * 0.1 }}
											className='flex items-center gap-2 mt-1'
										>
											<div
												className={`w-4 h-4 rounded border ${item.done ? 'bg-green-500 border-green-600' : 'border-neutral-500'}`}
											/>
											<span
												className={`text-sm ${item.done ? 'line-through text-neutral-500' : ''}`}
											>
												{item.text}
											</span>
										</motion.div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</WobbleCard>
	);
};

const TasksPage = () => {
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
						Task Management Reimagined
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Create, organize, and track tasks with powerful features designed to
						keep your team moving forward.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Button variant='sketch' size='lg'>
							Try Task Management Free
						</Button>
					</motion.div>
				</section>

				{/* Features Section */}
				<ContainerScroll
					titleComponent={
						<h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>
							Everything you need for efficient task management
						</h2>
					}
				>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
						{taskFeatures.map((feature, index) => (
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
				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-center mb-10'>
						Task management in action
					</h2>
					<TaskDemo />
				</section>

				{/* CTA Section */}
				<section className='text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Ready to get started?
					</h2>
					<p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8'>
						Join thousands of teams managing tasks with TaskFlow
					</p>
					<Button variant='sketch' size='lg'>
						Get Started Free
					</Button>
				</section>
			</div>
		</div>
	);
};

export default TasksPage;
