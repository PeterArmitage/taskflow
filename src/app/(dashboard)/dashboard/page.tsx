// app/(dashboard)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { WobbleCard } from '@/app/components/ui/wobble-card';
import { motion } from 'framer-motion';
import { Board } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';

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
		</div>
	);
}
