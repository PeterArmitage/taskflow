'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Board } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';
import { InfiniteMovingCards } from '@/app/components/ui/infinite-moving-cards';

export default function DashboardHome() {
	const [boards, setBoards] = useState<Board[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadBoards();
	}, []);

	const loadBoards = async () => {
		try {
			const data = await boardApi.getBoards();
			setBoards(data);
		} catch (error) {
			console.error('Failed to load boards:', error);
		} finally {
			setLoading(false);
		}
	};

	// Format your metrics data for the infinite moving cards
	const metricsItems = [
		{
			quote: '12',
			name: 'Active Tasks',
			title: 'Current tasks in progress across all boards',
		},
		{
			quote: '8',
			name: 'Completed This Week',
			title: 'Tasks completed in the last 7 days',
		},
		{
			quote: '5',
			name: 'Team Members',
			title: 'Active collaborators on your projects',
		},
		// Adding extra items to ensure smooth infinite scrolling
		{
			quote: '24',
			name: 'Total Tasks',
			title: 'Combined active and completed tasks',
		},
		{
			quote: '3',
			name: 'Active Boards',
			title: 'Current project boards in use',
		},
		{
			quote: '92%',
			name: 'On-Time Completion',
			title: 'Tasks completed within deadline',
		},
	];

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

			{/* Metrics Section with Infinite Moving Cards */}
			<div className='relative min-h-[12rem] w-full overflow-hidden bg-slate-950'>
				<InfiniteMovingCards
					items={metricsItems}
					direction='left'
					speed='slow'
					pauseOnHover={true}
					className='py-4'
				/>
			</div>

			{/* Recent Activity Section */}
			<div className='bg-white dark:bg-neutral-900 rounded-lg p-6'>
				<h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
				<div className='space-y-4'>{/* Add your activity items here */}</div>
			</div>

			{/* Quick Actions Section */}
			<div className='bg-white dark:bg-neutral-900 rounded-lg p-6'>
				<h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{/* Add your quick action buttons here */}
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Other dashboard widgets */}
			</div>
		</div>
	);
}
