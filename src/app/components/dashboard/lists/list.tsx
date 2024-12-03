// components/lists/list.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/app/types/card';
import { CardComponent } from '../cards/card';
import { CreateCardForm } from '../boards/create-card-form';
import { IconPlus, IconGripVertical } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ListProps {
	list: {
		id: number;
		title: string;
		cards: Card[];
	};
	onCardCreate: (listId: number, data: { title: string }) => Promise<void>;
	onCardUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
	onCardDelete: (cardId: number) => Promise<void>;
}

export function List({
	list,
	onCardCreate,
	onCardUpdate,
	onCardDelete,
}: ListProps) {
	const [showAddCard, setShowAddCard] = useState(false);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: list.id,
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
			className='w-80 flex-shrink-0 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3'
		>
			<div className='flex items-center justify-between mb-3'>
				<h3 className='font-medium'>{list.title}</h3>
				<button
					className='p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded'
					{...attributes}
					{...listeners}
				>
					<IconGripVertical className='w-5 h-5' />
				</button>
			</div>

			<div className='space-y-2'>
				{list.cards.map((card) => (
					<CardComponent
						key={card.id}
						card={card}
						onUpdate={onCardUpdate}
						onDelete={onCardDelete}
					/>
				))}
			</div>

			{showAddCard ? (
				<CreateCardForm
					listId={list.id}
					onCancel={() => setShowAddCard(false)}
					onSuccess={() => {
						setShowAddCard(false);
						// Optionally refresh the list here
					}}
					onCreate={async (data) => {
						await onCardCreate(list.id, data);
					}}
				/>
			) : (
				<button
					onClick={() => setShowAddCard(true)}
					className='flex items-center gap-2 w-full mt-2 p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors'
				>
					<IconPlus className='w-5 h-5' />
					Add a card
				</button>
			)}
		</div>
	);
}
