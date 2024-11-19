'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { IconPlus, IconLayoutKanban } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Board } from '@/app/types/boards';

export default function BoardsPage() {
	const [boards, setBoards] = useState<Board[]>([]);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Boards</h1>
					<p className='text-gray-600 dark:text-gray-300 mt-1'>
						Manage and organize your projects
					</p>
				</div>
				<Button variant='sketch' onClick={() => router.push('/boards/new')}>
					<IconPlus className='mr-2 h-4 w-4' />
					Create Board
				</Button>
			</div>

			{loading ? (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className='h-32 rounded-lg bg-gray-200 dark:bg-neutral-800 animate-pulse'
						/>
					))}
				</div>
			) : (
				<motion.div
					variants={container}
					initial='hidden'
					animate='show'
					className='grid grid-cols-1 md:grid-cols-3 gap-6'
				>
					{boards.length === 0 ? (
						<motion.div variants={item} className='col-span-full'>
							<div className='text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-700'>
								<IconLayoutKanban className='h-12 w-12 mx-auto text-gray-400' />
								<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
									No boards
								</h3>
								<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
									Get started by creating a new board
								</p>
								<div className='mt-6'>
									<Button
										variant='sketch'
										onClick={() => router.push('/boards/new')}
									>
										<IconPlus className='mr-2 h-4 w-4' />
										Create Board
									</Button>
								</div>
							</div>
						</motion.div>
					) : (
						boards.map((board) => (
							<motion.div
								key={board.id}
								variants={item}
								onClick={() => router.push(`/boards/${board.id}`)}
								className='group cursor-pointer'
							>
								<div className='h-32 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors'>
									<h3 className='font-semibold group-hover:text-blue-500 transition-colors'>
										{board.title}
									</h3>
									<p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
										Last updated{' '}
										{new Date(board.updated_at).toLocaleDateString()}
									</p>
								</div>
							</motion.div>
						))
					)}
				</motion.div>
			)}
		</div>
	);
}
