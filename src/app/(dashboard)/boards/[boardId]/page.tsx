// app/(dashboard)/boards/[boardId]/page.tsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { Board } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';
import { Loading } from '@/app/components/ui/loading';
import { BoardList } from '@/app/components/dashboard/boards/board-list';

export default function BoardPage() {
	const { boardId } = useParams();
	const [board, setBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(true);

	const loadBoard = useCallback(async () => {
		try {
			const data = await boardApi.getBoard(Number(boardId));
			setBoard(data);
		} catch (error) {
			console.error('Failed to load board:', error);
		} finally {
			setLoading(false);
		}
	}, [boardId]);

	useEffect(() => {
		loadBoard();
	}, [loadBoard]);

	if (loading) return <Loading />;
	if (!board) return <div>Board not found</div>;

	return (
		<div className='flex flex-col h-full'>
			{/* Board Header */}
			<div className='p-4 border-b dark:border-neutral-800'>
				<h1 className='text-2xl font-bold'>{board?.title}</h1>
				{board?.description && (
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						{board.description}
					</p>
				)}
			</div>

			{/* Lists Container */}
			<div className='flex-1 overflow-x-auto p-4'>
				<div className='flex gap-4'>
					{board?.lists?.map((list) => (
						<BoardList key={list.id} list={list} onUpdate={loadBoard} />
					))}
				</div>
			</div>
		</div>
	);
}
