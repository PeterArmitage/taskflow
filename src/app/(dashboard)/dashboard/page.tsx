'use client';

import { WobbleCard } from '@/app/components/ui/wobble-card';
import { motion } from 'framer-motion';

export default function DashboardHome() {
	return (
		<div className='space-y-8'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<h1 className='text-3xl font-bold mb-2'>Welcome to TaskFlow</h1>
				<p className='text-gray-600 dark:text-gray-300'>
					Here&apos;s what&apos;s happening in your projects
				</p>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<WobbleCard className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>Active Tasks</h3>
					<p className='text-3xl font-bold'>12</p>
				</WobbleCard>

				<WobbleCard className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>Completed This Week</h3>
					<p className='text-3xl font-bold'>8</p>
				</WobbleCard>

				<WobbleCard className='p-6'>
					<h3 className='text-lg font-semibold mb-2'>Team Members</h3>
					<p className='text-3xl font-bold'>5</p>
				</WobbleCard>
			</div>

			{/* Add more dashboard content here */}
		</div>
	);
}
