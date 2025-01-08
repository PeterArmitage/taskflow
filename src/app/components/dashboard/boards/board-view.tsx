import { useState, useCallback } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Board, Card } from '@/app/types/boards';
import { BoardList } from './board-list';
import { CardDetail } from '../cards/card-detail';
import { CreateListForm } from './create-list-form';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useDragDrop } from '@/app/hooks/use-drag-drop';
import { useKeyboardNavigation } from '@/app/hooks/use-keyboard-navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cardApi } from '@/app/api/card';
import { listApi } from '@/app/api/list';

interface BoardViewProps {
	board: Board;
	onUpdate: () => void;
}

export function BoardView({ board, onUpdate }: BoardViewProps) {
	// State and hooks
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [showCreateList, setShowCreateList] = useState(false);
	const { toast } = useToast();

	// Initialize drag and drop functionality
	const {
		sensors,
		activeId,
		lists,
		draggedItemType,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useDragDrop({ board, onUpdate });

	// Handle card movement between lists
	const handleCardMove = useCallback(
		async (cardId: number, sourceListId: number, targetListId: number) => {
			try {
				await cardApi.moveCard(cardId, targetListId);
				onUpdate();
				toast({
					title: 'Card moved',
					description: 'Card has been moved successfully',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to move card',
					variant: 'destructive',
				});
			}
		},
		[onUpdate, toast]
	);

	// Handle list reordering
	const handleListMove = useCallback(
		async (listId: number, direction: 'left' | 'right') => {
			try {
				await listApi.reorderList(listId, direction);
				onUpdate();
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to move list',
					variant: 'destructive',
				});
			}
		},
		[onUpdate, toast]
	);

	// Initialize keyboard navigation
	const {
		selectedCardId,
		selectedListId,
		setSelectedCard: setKeyboardSelectedCard,
		setSelectedList: setKeyboardSelectedList,
	} = useKeyboardNavigation({
		lists,
		onCardSelect: (card) => setSelectedCard(card),
		onCardMove: handleCardMove,
		onListMove: handleListMove,
	});

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className='h-full flex flex-col'>
				{/* Board Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex items-center justify-between mb-6 p-4'
				>
					<div>
						<h1 className='text-2xl font-bold'>{board.title}</h1>
						{board.description && (
							<p className='text-gray-600 dark:text-gray-400 mt-1'>
								{board.description}
							</p>
						)}
					</div>
					<Button
						variant='outline'
						onClick={() => setShowCreateList(true)}
						className='flex items-center gap-2'
					>
						<IconPlus className='w-4 h-4' />
						Add List
					</Button>
				</motion.div>

				{/* Lists Container */}
				<div className='flex-1 overflow-x-auto'>
					<AnimatePresence mode='popLayout'>
						<motion.div className='flex gap-4 h-full pb-4 p-4'>
							<SortableContext items={lists.map((list) => list.id.toString())}>
								{lists.map((list) => (
									<BoardList
										key={list.id}
										list={list}
										onUpdate={onUpdate}
										onCardSelect={setSelectedCard}
										isActive={activeId === list.id.toString()}
										isSelected={selectedListId === list.id.toString()}
										selectedCardId={selectedCardId}
										onCardFocus={setKeyboardSelectedCard}
										onListFocus={setKeyboardSelectedList}
										className={draggedItemType === 'card' ? 'drop-target' : ''}
									/>
								))}
							</SortableContext>

							{/* Create List Form */}
							<AnimatePresence>
								{showCreateList && (
									<motion.div
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 50 }}
										className='w-80 flex-shrink-0'
									>
										<CreateListForm
											boardId={board.id}
											onCancel={() => setShowCreateList(false)}
											onSuccess={() => {
												setShowCreateList(false);
												onUpdate();
											}}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Card Detail Modal */}
				<AnimatePresence>
					{selectedCard && (
						<CardDetail
							card={selectedCard}
							isOpen={true}
							onClose={() => setSelectedCard(null)}
							onUpdate={async (updatedCard) => {
								try {
									await cardApi.updateCard(updatedCard.id, updatedCard);
									onUpdate();
									setSelectedCard(null);
								} catch (error) {
									toast({
										title: 'Error',
										description: 'Failed to update card',
										variant: 'destructive',
									});
								}
							}}
							onDelete={async () => {
								try {
									await cardApi.deleteCard(selectedCard.id);
									onUpdate();
									setSelectedCard(null);
								} catch (error) {
									toast({
										title: 'Error',
										description: 'Failed to delete card',
										variant: 'destructive',
									});
								}
							}}
						/>
					)}
				</AnimatePresence>
			</div>
		</DndContext>
	);
}
