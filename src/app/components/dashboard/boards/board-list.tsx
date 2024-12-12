import { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext } from '@dnd-kit/sortable';
import { List, Card } from '@/app/types/boards';
import { CardItem } from './card-item';
import { CreateCardForm } from './create-card-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconPlus,
	IconDotsVertical,
	IconPencil,
	IconTrash,
} from '@tabler/icons-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BoardListProps {
	list: List;
	onUpdate: () => void;
	onCardSelect?: (card: Card) => void;
	onListDelete?: (listId: number) => void;
	onListEdit?: (listId: number) => void;
	isActive?: boolean;
	className?: string;
	isSelected?: boolean;
	selectedCardId?: string | null;
	onCardFocus?: (cardId: string | null) => void;
	onListFocus?: (listId: string | null) => void;
}

export function BoardList({
	list,
	onUpdate,
	onCardSelect,
	onListDelete,
	onListEdit,
	isActive = false,
	className,
}: BoardListProps) {
	const [showCreateCard, setShowCreateCard] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	// Set up sortable functionality for the list
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
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

	const handleCardClick = useCallback(
		(card: Card) => {
			if (typeof onCardSelect === 'function') {
				onCardSelect(card);
			}
		},
		[onCardSelect]
	);
	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -50 }}
			className={cn(
				'w-80 flex-shrink-0 flex flex-col',
				'bg-neutral-50 dark:bg-neutral-800/50',
				'rounded-lg border border-neutral-200 dark:border-neutral-700',
				isActive && 'ring-2 ring-blue-500',
				isDragging && 'opacity-50',
				className
			)}
			{...attributes}
		>
			{/* List Header */}
			<div
				className='p-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700'
				{...listeners}
			>
				<h3 className='font-medium text-neutral-900 dark:text-neutral-100'>
					{list.title}
				</h3>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
							<IconDotsVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={() => onListEdit?.(list.id)}>
							<IconPencil className='h-4 w-4 mr-2' />
							Edit List
						</DropdownMenuItem>
						<DropdownMenuItem
							className='text-red-600 dark:text-red-400'
							onClick={() => onListDelete?.(list.id)}
						>
							<IconTrash className='h-4 w-4 mr-2' />
							Delete List
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Cards Container */}
			<div className='flex-1 overflow-y-auto p-3 space-y-2'>
				<SortableContext
					items={list.cards?.map((card) => card.id.toString()) || []}
				>
					<AnimatePresence mode='popLayout'>
						{list.cards?.map((card) => (
							<CardItem
								key={card.id}
								card={card}
								listId={list.id}
								onClick={() => handleCardClick(card)}
								isDragging={isDragging}
								labels={card.labels}
							/>
						))}
					</AnimatePresence>
				</SortableContext>

				{/* Add Card Section */}
				<AnimatePresence mode='wait'>
					{showCreateCard ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
						>
							<CreateCardForm
								listId={list.id}
								onCancel={() => setShowCreateCard(false)}
								onSuccess={() => {
									setShowCreateCard(false);
									onUpdate();
								}}
							/>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<Button
								variant='ghost'
								size='sm'
								className='w-full justify-start text-neutral-600 dark:text-neutral-400'
								onClick={() => setShowCreateCard(true)}
							>
								<IconPlus className='h-4 w-4 mr-2' />
								Add a card
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* List Footer - Optional Card Count */}
			<div className='p-2 border-t border-neutral-200 dark:border-neutral-700'>
				<p className='text-xs text-neutral-500 dark:text-neutral-400 text-center'>
					{list.cards?.length || 0} cards
				</p>
			</div>
		</motion.div>
	);
}
