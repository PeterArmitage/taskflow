// components/dashboard/boards/board-view.tsx
import { useState, useCallback } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Board, Card } from '@/app/types/boards';
import { BoardList } from './board-list';
import { CardDetail } from '@/app/components/dashboard/cards/card-detail/card-detail';
import { CreateListForm } from './create-list-form';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useDragDrop } from '@/app/hooks/use-drag-drop';
import { useKeyboardNavigation } from '@/app/hooks/use-keyboard-navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { cardApi } from '@/app/api/card';
import { listApi } from '@/app/api/list';
import { IntegratedCard } from '../cards/integrated-card';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { BoardRealTimeUpdate } from '@/app/types/real-time-updates';
import { WebSocketMessage } from '@/app/types/websocket';

interface BoardViewProps {
	board: Board;
	onUpdate: () => void;
	onListEdit: (listId: number, newTitle: string) => Promise<void>;
	onListDelete: (listId: number) => Promise<void>;
	activeId: string | null;
}

export function BoardView({
	board,
	onUpdate,
	onListEdit,
	onListDelete,
}: BoardViewProps) {
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [showCreateList, setShowCreateList] = useState(false);
	const { toast } = useToast();

	const {
		sensors,
		activeId,
		lists,
		draggedItemType,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	} = useDragDrop({ board, onUpdate });

	const handleCardMove = useCallback(
		async (cardId: number, sourceListId: number, targetListId: number) => {
			try {
				await cardApi.moveCard(cardId, targetListId);
				onUpdate();
				toast({
					title: 'Success',
					description: 'Card moved successfully',
				});
			} catch (error) {
				console.error('Failed to move card:', error);
				toast({
					title: 'Error',
					description: 'Failed to move card',
					variant: 'destructive',
				});
			}
		},
		[onUpdate, toast]
	);

	const handleListMove = useCallback(
		async (listId: number, direction: 'left' | 'right') => {
			try {
				await listApi.reorderList(listId, direction);
				onUpdate();
			} catch (error) {
				console.error('Failed to move list:', error);
				toast({
					title: 'Error',
					description: 'Failed to move list',
					variant: 'destructive',
				});
			}
		},
		[onUpdate, toast]
	);

	// List deletion handler
	const handleListDelete = async (listId: number) => {
		try {
			await listApi.deleteList(listId);
			// Force a refresh of the board data
			onUpdate();
			toast({
				title: 'Success',
				description: 'List deleted successfully',
			});
		} catch (error) {
			console.error('Failed to delete list:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete list',
				variant: 'destructive',
			});
		}
	};

	// List edit handler
	const handleListEdit = async (listId: number, newTitle: string) => {
		try {
			console.log('BoardView - Updating list:', { listId, newTitle });
			await listApi.updateList(listId, { title: newTitle });
			console.log('BoardView - List updated, refreshing...');

			await onUpdate();
			toast({
				title: 'Success',
				description: 'List updated successfully',
			});
		} catch (error) {
			console.error('BoardView - Update failed:', error);
			toast({
				title: 'Error',
				description: 'Failed to update list',
				variant: 'destructive',
			});
		}
	};

	const { sendMessage } = useWebSocket({
		boardId: board.id,
		cardId: 0,
		onMessage: (message: WebSocketMessage | BoardRealTimeUpdate) => {
			if ('type' in message && message.type === 'board') {
				onUpdate();
			}
		},
	});

	const renderCard = (card: Card) => (
		<IntegratedCard
			key={card.id}
			card={card}
			onUpdate={async (cardId, data) => {
				try {
					await cardApi.updateCard(cardId, data);
					onUpdate();
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Failed to update card',
						variant: 'destructive',
					});
				}
			}}
			onDelete={async (cardId) => {
				try {
					await cardApi.deleteCard(cardId);
					onUpdate();
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Failed to delete card',
						variant: 'destructive',
					});
				}
			}}
			onMove={async (cardId, sourceListId, targetListId, position) => {
				try {
					await cardApi.moveCard(cardId, targetListId, position);
					onUpdate();
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Failed to move card',
						variant: 'destructive',
					});
				}
			}}
		/>
	);

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
										onListDelete={onListDelete}
										onListEdit={onListEdit}
										isActive={activeId === list.id.toString()}
										isSelected={selectedListId === list.id.toString()}
										selectedCardId={selectedCardId}
										onCardFocus={setKeyboardSelectedCard}
										onListFocus={setKeyboardSelectedList}
										className={draggedItemType === 'card' ? 'drop-target' : ''}
										renderCard={renderCard}
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
