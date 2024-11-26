// components/dashboard/boards/board-view.tsx
'use client';

import { useState } from 'react';
import { Board, List } from '@/app/types/boards';
import { BoardList } from './board-list';
import { CreateListForm } from './create-list-form';
import { IconPlus } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface BoardViewProps {
	board: Board;
	onUpdate: () => void;
}

export function BoardView({ board, onUpdate }: BoardViewProps) {
	const [showCreateList, setShowCreateList] = useState(false);

	return (
		<div className='h-full flex flex-col'>
			{/* Board Header */}
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className='text-2xl font-bold'>{board.title}</h1>
					{board.description && (
						<p className='text-gray-600 dark:text-gray-400 mt-1'>
							{board.description}
						</p>
					)}
				</div>
				<button
					onClick={() => setShowCreateList(true)}
					className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
				>
					<IconPlus className='w-5 h-5' />
					Add List
				</button>
			</div>

			{/* Lists Container */}
			<div className='flex-1 overflow-x-auto'>
				<div className='flex gap-4 h-full pb-4'>
					{/* Lists */}
					{board.lists?.map((list) => (
						<BoardList key={list.id} list={list} onUpdate={onUpdate} />
					))}

					{/* Create List Form */}
					{showCreateList ? (
						<div className='w-80 flex-shrink-0'>
							<CreateListForm
								boardId={board.id}
								onCancel={() => setShowCreateList(false)}
								onSuccess={() => {
									setShowCreateList(false);
									onUpdate();
								}}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
