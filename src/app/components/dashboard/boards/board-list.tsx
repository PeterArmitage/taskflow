// components/dashboard/boards/board-list.tsx
'use client';

import { List, Card } from '@/app/types/boards';
import { CardItem } from './card-item';
import { CreateCardForm } from './create-card-form';
import { useState } from 'react';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface BoardListProps {
	list: List;
	onUpdate: () => void;
}

export function BoardList({ list, onUpdate }: BoardListProps) {
	const [showCreateCard, setShowCreateCard] = useState(false);
	if (!list) {
		return null;
	}
	return (
		<div className='w-80 flex-shrink-0 bg-gray-100 dark:bg-neutral-800 rounded-lg p-3'>
			{/* List Header */}
			<div className='flex items-center justify-between mb-3'>
				<h3 className='font-medium'>{list.title}</h3>
				<button className='p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded'>
					<IconDotsVertical className='w-5 h-5' />
				</button>
			</div>

			{/* Cards */}
			<div className='space-y-2'>
				{list.cards?.map((card) => (
					<CardItem key={card.id} card={card} onUpdate={onUpdate} />
				))}

				{/* Add Card Button or Form */}
				{showCreateCard ? (
					<CreateCardForm
						listId={list.id}
						onCancel={() => setShowCreateCard(false)}
						onSuccess={() => {
							setShowCreateCard(false);
							onUpdate();
						}}
					/>
				) : (
					<button
						onClick={() => setShowCreateCard(true)}
						className='flex items-center gap-2 w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded transition-colors'
					>
						<IconPlus className='w-5 h-5' />
						Add a card
					</button>
				)}
			</div>
		</div>
	);
}
