// components/lists/list.tsx
'use client';

import { useState } from 'react';
import { Card, List as ListType } from '@/app/types/boards';
import { CardComponent } from '../cards/card';
import { CreateCardForm } from '../boards/create-card-form';
import { IconPlus, IconGripVertical } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface ListProps {
	list: ListType;
	onCardCreate: (
		listId: number,
		data: { title: string; description?: string }
	) => Promise<void>;
	onCardUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
	onCardDelete: (cardId: number) => Promise<void>;
	onCardSelect?: (card: Card) => void;
	isActive?: boolean;
	isSelected?: boolean;
	className?: string;
	selectedCardId?: string | null;
}

export function List({
	list,
	onCardCreate,
	onCardUpdate,
	onCardDelete,
	onCardSelect,
	isActive,
	isSelected,
	className,
	selectedCardId,
}: ListProps) {
	const [showAddCard, setShowAddCard] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
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
			className={cn(
				'w-80 flex-shrink-0 flex flex-col',
				'bg-neutral-50 dark:bg-neutral-800/50',
				'rounded-lg border border-neutral-200 dark:border-neutral-700',
				isActive && 'ring-2 ring-blue-500',
				isSelected && 'ring-2 ring-purple-500',
				isDragging && 'opacity-50',
				className
			)}
		>
			<div
				className='p-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700'
				{...attributes}
				{...listeners}
			>
				<h3 className='font-medium text-neutral-900 dark:text-neutral-100'>
					{list.title}
				</h3>
				<IconGripVertical className='w-5 h-5 text-neutral-400 cursor-grab' />
			</div>

			<div className='flex-1 overflow-y-auto p-3 space-y-2'>
				{list.cards?.map((card) => (
					<CardComponent
						key={card.id}
						card={card}
						onUpdate={onCardUpdate}
						onDelete={onCardDelete}
						onClick={() => onCardSelect?.(card)}
						isSelected={card.id.toString() === selectedCardId}
					/>
				))}

				{showAddCard ? (
					<CreateCardForm
						listId={list.id}
						onCancel={() => setShowAddCard(false)}
						onSuccess={() => {
							setShowAddCard(false);
						}}
						onCreate={async (data) => {
							await onCardCreate(list.id, data);
						}}
					/>
				) : (
					<button
						onClick={() => setShowAddCard(true)}
						className='flex items-center gap-2 w-full p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors'
					>
						<IconPlus className='w-5 h-5' />
						Add a card
					</button>
				)}
			</div>
		</div>
	);
}
