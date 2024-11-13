// components/landing/views.tsx
'use client';
import { motion } from 'framer-motion';
import {
	IconLayoutKanban,
	IconTimeline,
	IconCalendarStats,
	IconList,
} from '@tabler/icons-react';

export const Views = () => {
	return (
		<section className='relative py-20 min-h-screen flex items-center justify-center bg-white'>
			<div className='max-w-7xl mx-auto px-4 w-full'>
				<div className='relative h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md'>
					<div className='absolute inset-0 w-full h-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] opacity-40' />

					<div className='relative z-20 flex flex-col items-center justify-center space-y-10 px-4'>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}
							className='text-center space-y-4'
						>
							<h2 className='text-4xl md:text-6xl font-bold text-black dark:text-white'>
								Work Your Way
							</h2>
							<p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
								Multiple views to match your team&apos;s needs. Switch between
								views while keeping your work in sync.
							</p>
						</motion.div>

						<div className='grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-5xl'>
							{views.map((view, index) => (
								<motion.div
									key={view.name}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.2 }}
									className='flex flex-col items-center p-6 rounded-lg backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1'
								>
									<view.icon className='h-8 w-8 mb-4 text-blue-500' />
									<h3 className='font-semibold mb-2 text-gray-900'>
										{view.name}
									</h3>
									<p className='text-sm text-center text-gray-600'>
										{view.description}
									</p>
								</motion.div>
							))}
						</div>
					</div>

					{/* Lamp effect */}
					<div className='absolute inset-0 pointer-events-none'>
						<div className='absolute inset-0 h-full w-full bg-gradient-to-b from-blue-500/30 via-transparent to-transparent [mask-image:radial-gradient(350px_200px_at_top,white,transparent)]' />
						<div className='absolute inset-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(255,255,255,0.1),transparent)]' />
					</div>
				</div>
			</div>
		</section>
	);
};

const views = [
	{
		name: 'Kanban Board',
		description: 'Visualize work progress with customizable boards and lists',
		icon: IconLayoutKanban,
	},
	{
		name: 'Timeline',
		description: 'Plan and track projects on a powerful timeline view',
		icon: IconTimeline,
	},
	{
		name: 'Calendar',
		description: 'Manage deadlines and events in a familiar calendar layout',
		icon: IconCalendarStats,
	},
	{
		name: 'List View',
		description: 'Organize tasks in a simple, prioritized list format',
		icon: IconList,
	},
];
