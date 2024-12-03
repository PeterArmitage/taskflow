// components/dashboard/boards/board-list.tsx
'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, Card } from '@/app/types/boards';
import { CardItem } from './card-item';
import { CreateCardForm } from './create-card-form';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BoardListProps {
	list: List;
	onUpdate: () => void;
	onCardSelect: (card: Card) => void;
	isActive?: boolean; // Added isActive prop
	className?: string;
}

export function BoardList({
	list,
	onUpdate,
	onCardSelect,
	isActive = false, // Provide default value
	className,
}: BoardListProps) {
	const [showCreateCard, setShowCreateCard] = useState(false);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: list.id.toString(),
			data: {
				type: 'list',
				list,
			},
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={cn(
				'w-80 flex-shrink-0 bg-gray-100 dark:bg-neutral-800 rounded-lg p-3',
				isActive && 'ring-2 ring-blue-500', // Add visual feedback for active state
				className
			)}
		>
			{/* List Header */}
			<div className='flex items-center justify-between mb-3'>
				<h3 className='font-medium'>{list.title}</h3>
				<Button variant='ghost' size='sm' className='p-1'>
					<IconDotsVertical className='w-5 h-5' />
				</Button>
			</div>

			{/* Cards Container */}
			<div className='space-y-2'>
				{list.cards?.map((card) => (
					<CardItem
						key={card.id}
						card={card}
						listId={list.id}
						onClick={() => onCardSelect(card)}
					/>
				))}

				{/* Add Card UI */}
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
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setShowCreateCard(true)}
						className='flex items-center gap-2 w-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
					>
						<IconPlus className='w-4 h-4' />
						Add a card
					</Button>
				)}
			</div>
		</div>
	);
}
