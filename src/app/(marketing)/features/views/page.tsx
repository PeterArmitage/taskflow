// app/(marketing)/features/views/page.tsx
'use client'; // Add this since we're using client-side components

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconLayoutKanban,
	IconTimeline,
	IconCalendar,
	IconList,
} from '@tabler/icons-react';

const viewTypes = [
	{
		title: 'Kanban Board',
		description:
			'Visualize work progress with customizable boards and lists. Perfect for agile workflows.',
		icon: IconLayoutKanban,
	},
	{
		title: 'Timeline View',
		description:
			'Plan and track projects with a powerful timeline view. Great for project scheduling.',
		icon: IconTimeline,
	},
	{
		title: 'Calendar View',
		description:
			'Manage deadlines and events in a familiar calendar layout. Stay on top of due dates.',
		icon: IconCalendar,
	},
	{
		title: 'List View',
		description:
			'Organize tasks in a simple, prioritized list format. Ideal for quick task management.',
		icon: IconList,
	},
] as const; // Add type assertion

const ViewsPage = () => {
	// Changed to arrow function
	return (
		<div className='max-w-7xl mx-auto px-4 py-20'>
			{/* Hero Section */}
			<section className='text-center mb-20'>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-4xl md:text-6xl font-bold mb-6'
				>
					Visualize Work Your Way
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
				>
					Switch between multiple views to manage your projects effectively.
					From boards to timelines, find the perfect view for your team.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Button variant='sketch' size='lg'>
						Try Views & Boards Free
					</Button>
				</motion.div>
			</section>

			{/* Features Grid */}
			<section className='grid md:grid-cols-2 gap-12 mb-20'>
				{viewTypes.map((view, index) => (
					<motion.div
						key={view.title}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className='relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800'
					>
						<div className='flex items-center gap-4 mb-4'>
							{view.icon && <view.icon className='h-8 w-8 text-blue-500' />}
							<h3 className='text-xl font-bold'>{view.title}</h3>
						</div>
						<p className='text-neutral-600 dark:text-neutral-300'>
							{view.description}
						</p>
					</motion.div>
				))}
			</section>

			{/* Preview Section */}
			<section className='relative rounded-2xl overflow-hidden mb-20'>
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					className='aspect-video bg-neutral-900 rounded-2xl'
				>
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='text-neutral-500'>Board Preview</span>
					</div>
				</motion.div>
			</section>
		</div>
	);
};

export default ViewsPage; // Changed to default export
