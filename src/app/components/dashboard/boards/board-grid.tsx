// components/dashboard/boards/board-grid.tsx
'use client';

import { useRouter } from 'next/navigation';
import { IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Board } from '@/app/types/boards';

interface BoardGridProps {
	boards: Board[];
	onCreateBoard: (data: {
		title: string;
		description?: string;
	}) => Promise<void>;
}

export function BoardGrid({ boards, onCreateBoard }: BoardGridProps) {
	const router = useRouter();

	return (
		<div className='space-y-6'>
			<motion.div
				variants={{
					hidden: { opacity: 0 },
					show: {
						opacity: 1,
						transition: {
							staggerChildren: 0.1,
						},
					},
				}}
				initial='hidden'
				animate='show'
				className='grid grid-cols-1 md:grid-cols-3 gap-6'
			>
				{boards.map((board) => (
					<motion.div
						key={board.id}
						variants={{
							hidden: { opacity: 0, y: 20 },
							show: { opacity: 1, y: 0 },
						}}
						onClick={() => router.push(`/boards/${board.id}`)}
						className='group cursor-pointer'
					>
						<div className='h-32 p-6 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors'>
							<h3 className='font-semibold group-hover:text-blue-500 transition-colors'>
								{board.title}
							</h3>
							{board.description && (
								<p className='mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
									{board.description}
								</p>
							)}
							<p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
								Last updated {new Date(board.updated_at).toLocaleDateString()}
							</p>
						</div>
					</motion.div>
				))}

				<motion.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 },
					}}
					className='flex items-center justify-center h-32 bg-gray-50 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer'
					onClick={() => router.push('/boards/new')}
				>
					<Button variant='sketch'>
						<IconPlus className='mr-2 h-4 w-4' />
						Create New Board
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
}
