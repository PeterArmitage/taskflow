// app/(dashboard)/boards/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBoard } from '@/app/hooks/use-board';
import { Plus, Loader2, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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

export default function BoardsPage() {
	const router = useRouter();
	const { toast } = useToast();
	const { boards, loading, error, loadBoards, createBoard } = useBoard();
	const [view, setView] = useState<'grid' | 'list'>('grid');

	// Load boards when component mounts
	useEffect(() => {
		loadBoards().catch((err) => {
			toast({
				title: 'Error',
				description: 'Failed to load boards. Please try again.',
				variant: 'destructive',
			});
		});
	}, [loadBoards, toast]);

	// Handle board creation
	const handleCreateBoard = async (data: {
		title: string;
		description?: string;
	}) => {
		try {
			const newBoard = await createBoard(data);
			// After successful creation, either:
			// Option 1: Refresh the boards list
			await loadBoards();
			// Option 2: Navigate to the new board
			router.push(`/boards/${newBoard.id}`);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create board. Please try again.',
				variant: 'destructive',
			});
		}
	};

	// Function to render boards based on current view
	const renderBoards = () => {
		if (loading) {
			return (
				<div className='flex items-center justify-center py-12'>
					<Loader2 className='w-6 h-6 animate-spin' />
				</div>
			);
		}

		if (error) {
			return (
				<div className='text-center py-12'>
					<p className='text-red-500'>{error}</p>
					<Button
						variant='outline'
						onClick={() => loadBoards()}
						className='mt-4'
					>
						Try Again
					</Button>
				</div>
			);
		}

		return view === 'grid' ? (
			// Grid View
			<motion.div layout className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				{boards.map((board) => (
					<motion.div
						key={board.id}
						layoutId={`board-${board.id}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => router.push(`/boards/${board.id}`)}
						className='bg-white dark:bg-neutral-800 rounded-lg p-6 cursor-pointer
                       hover:shadow-lg transition-all duration-200
                       border border-neutral-200 dark:border-neutral-700'
					>
						<h3 className='font-semibold text-lg mb-2'>{board.title}</h3>
						{board.description && (
							<p className='text-neutral-600 dark:text-neutral-400 text-sm'>
								{board.description}
							</p>
						)}
					</motion.div>
				))}
			</motion.div>
		) : (
			// List View
			<motion.div layout className='space-y-2'>
				{boards.map((board) => (
					<motion.div
						key={board.id}
						layoutId={`board-${board.id}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => router.push(`/boards/${board.id}`)}
						className='bg-white dark:bg-neutral-800 rounded-lg p-4 cursor-pointer
                       hover:shadow-md transition-all duration-200
                       border border-neutral-200 dark:border-neutral-700'
					>
						<div className='flex items-center justify-between'>
							<div>
								<h3 className='font-semibold'>{board.title}</h3>
								{board.description && (
									<p className='text-neutral-600 dark:text-neutral-400 text-sm'>
										{board.description}
									</p>
								)}
							</div>
							<p className='text-sm text-neutral-500'>
								{board.lists?.length || 0} lists
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>
		);
	};

	return (
		<div className='max-w-7xl mx-auto px-4 py-8'>
			{/* Header Section */}
			<div className='flex items-center justify-between mb-8'>
				<div>
					<h1 className='text-3xl font-bold'>Boards</h1>
					<p className='text-neutral-600 dark:text-neutral-400 mt-1'>
						Manage and organize your projects
					</p>
				</div>
				<div className='flex items-center gap-4'>
					<BoardViewToggle view={view} setView={setView} />
					<Button
						onClick={() => router.push('/boards/new')}
						className='flex items-center gap-2'
					>
						<Plus className='w-4 h-4' />
						Create Board
					</Button>
				</div>
			</div>

			{/* Boards Grid/List */}
			{renderBoards()}
		</div>
	);
}
