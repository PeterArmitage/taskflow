// components/landing/integrations.tsx
'use client';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import {
	IconBrandGithub,
	IconBrandSlack,
	IconBrandTrello,
	IconBrandAsana,
	IconBrandNotion,
	IconBrandDiscord,
} from '@tabler/icons-react';

export const Integrations = () => {
	return (
		<section className='relative w-full py-20 bg-dot-pattern'>
			<div
				className='absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900'
				style={{
					maskImage: 'radial-gradient(circle at center, white, transparent)',
				}}
			/>

			<div className='max-w-7xl mx-auto px-4 relative z-10'>
				<div className='text-center max-w-3xl mx-auto mb-20'>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-4xl md:text-5xl font-bold mb-6'
					>
						Connects with your favorite tools
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-xl text-gray-600 dark:text-gray-400'
					>
						TaskFlow integrates seamlessly with your existing workflow. Connect
						with over 200+ apps and services you use every day.
					</motion.p>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-3 gap-8 mb-16'>
					{integrations.map((integration, index) => (
						<motion.div
							key={integration.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							whileHover={{ scale: 1.05 }}
							className='relative group'
						>
							<div className='relative p-8 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-xl'>
								{/* Gradient border on hover */}
								<div
									className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
									style={{ padding: '1px' }}
								>
									<div className='h-full w-full bg-white dark:bg-neutral-800 rounded-xl' />
								</div>

								<div className='relative z-10'>
									<div className='flex items-center justify-between mb-4'>
										<integration.icon className='h-8 w-8 text-gray-700 dark:text-gray-300' />
										<span className='text-sm text-gray-500 dark:text-gray-400'>
											Popular
										</span>
									</div>
									<h3 className='text-xl font-semibold mb-2'>
										{integration.name}
									</h3>
									<p className='text-gray-600 dark:text-gray-400 mb-4'>
										{integration.description}
									</p>
									<Button variant='sketch' className='w-full'>
										Connect {integration.name}
									</Button>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className='text-center'
				>
					<Button variant='sketch' className='px-8'>
						View all integrations
					</Button>
				</motion.div>
			</div>
		</section>
	);
};

const integrations = [
	{
		name: 'GitHub',
		description: 'Link commits and pull requests directly to your tasks',
		icon: IconBrandGithub,
	},
	{
		name: 'Slack',
		description: 'Get notifications and updates right in your channels',
		icon: IconBrandSlack,
	},
	{
		name: 'Discord',
		description: 'Collaborate with your team in real-time',
		icon: IconBrandDiscord,
	},
	{
		name: 'Notion',
		description: 'Connect your documentation and wikis seamlessly',
		icon: IconBrandNotion,
	},
	{
		name: 'Trello',
		description: 'Import your existing boards and workflows',
		icon: IconBrandTrello,
	},
	{
		name: 'Asana',
		description: 'Sync tasks and projects between platforms',
		icon: IconBrandAsana,
	},
];
