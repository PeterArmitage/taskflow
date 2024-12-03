import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, Loader2, FolderKanban } from 'lucide-react';
import { Board } from '@/app/types/boards';
import { useBoard } from '@/app/hooks/use-board';
import { useToast } from '@/hooks/use-toast';

interface BoardViewProps {
	view: 'grid' | 'list';
	setView: (view: 'grid' | 'list') => void;
}

const BoardViewToggle = ({ view, setView }: BoardViewProps) => {
	return (
		<div className='flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg'>
			<button
				onClick={() => setView('grid')}
				className={`p-2 rounded ${
					view === 'grid'
						? 'bg-white dark:bg-neutral-700 shadow-sm'
						: 'hover:bg-white/50 dark:hover:bg-neutral-600'
				}`}
			>
				<LayoutGrid className='w-4 h-4' />
			</button>
			<button
				onClick={() => setView('list')}
				className={`p-2 rounded ${
					view === 'list'
						? 'bg-white dark:bg-neutral-700 shadow-sm'
						: 'hover:bg-white/50 dark:hover:bg-neutral-600'
				}`}
			>
				<List className='w-4 h-4' />
			</button>
		</div>
	);
};
export const BoardManagement = () => {
	const { boards, loading, error, loadBoards } = useBoard();
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		loadBoards().catch((err) => {
			toast({
				title: 'Error',
				description: 'Failed to load boards. Please try again.',
				variant: 'destructive',
			});
		});
	}, [loadBoards, toast]);

	const BoardGrid = () => (
		<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
			<AnimatePresence mode='popLayout'>
				{boards.map((board) => (
					<motion.div
						key={board.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						whileHover={{ scale: 1.02 }}
						className='group cursor-pointer'
					>
						<div className='bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all'>
							<h3 className='font-medium group-hover:text-blue-500 transition-colors'>
								{board.title}
							</h3>
							{board.description && (
								<p className='mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2'>
									{board.description}
								</p>
							)}
							<div className='mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400'>
								<span>
									Last updated {new Date(board.updated_at).toLocaleDateString()}
								</span>
								<span>{board.lists?.length || 0} lists</span>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);

	const BoardList = () => (
		<div className='space-y-2'>
			<AnimatePresence mode='popLayout'>
				{boards.map((board) => (
					<motion.div
						key={board.id}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className='group cursor-pointer'
					>
						<div className='bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all'>
							<div className='flex items-center justify-between'>
								<div>
									<h3 className='font-medium group-hover:text-blue-500 transition-colors'>
										{board.title}
									</h3>
									{board.description && (
										<p className='mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
											{board.description}
										</p>
									)}
								</div>
								<div className='text-sm text-neutral-500 dark:text-neutral-400'>
									{board.lists?.length || 0} lists
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);

	if (error) {
		return (
			<div className='text-center py-12'>
				<p className='text-red-500'>Failed to load boards</p>
				<Button variant='outline' onClick={() => loadBoards()} className='mt-4'>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold'>Boards</h1>
					<p className='text-neutral-500 dark:text-neutral-400'>
						Manage and organize your projects
					</p>
				</div>
				<div className='flex items-center gap-4'>
					<BoardViewToggle view={view} setView={setView} />
					<Button>
						<Plus className='w-4 h-4 mr-2' />
						Create Board
					</Button>
				</div>
			</div>

			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader2 className='w-6 h-6 animate-spin' />
				</div>
			) : boards.length === 0 ? (
				<div className='text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700'>
					<FolderKanban className='w-12 h-12 mx-auto text-neutral-400' />
					<h2 className='mt-4 text-lg font-medium'>No boards yet</h2>
					<p className='mt-2 text-neutral-500 dark:text-neutral-400'>
						Create your first board to get started
					</p>
					<Button className='mt-6'>
						<Plus className='w-4 h-4 mr-2' />
						Create Board
					</Button>
				</div>
			) : view === 'grid' ? (
				<BoardGrid />
			) : (
				<BoardList />
			)}
		</div>
	);
};
