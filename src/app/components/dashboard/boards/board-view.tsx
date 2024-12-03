'use client';

import { useState, useCallback } from 'react';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	useSensor,
	useSensors,
	PointerSensor,
	MouseSensor,
	TouchSensor,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Board, Card, List } from '@/app/types/boards';
import { BoardList } from './board-list';
import { CardDetail } from '../cards/card-detail';
import { CreateListForm } from './create-list-form';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cardApi } from '@/app/api/card';

interface BoardViewProps {
	board: Board;
	onUpdate: () => void;
}

export function BoardView({ board, onUpdate }: BoardViewProps) {
	// State for managing lists, cards, and UI state
	const [lists, setLists] = useState<List[]>(board.lists || []);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [showCreateList, setShowCreateList] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);
	const { toast } = useToast();

	// Configure sensors for drag and drop
	const sensors = useSensors(
		// Pointer sensor with a small activation constraint to prevent accidental drags
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		// Mouse sensor for better desktop support
		useSensor(MouseSensor, {
			activationConstraint: { distance: 8 },
		}),
		// Touch sensor for mobile support
		useSensor(TouchSensor, {
			activationConstraint: { delay: 100, tolerance: 5 },
		})
	);

	// Handle drag start event
	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setActiveId(active.id as string);
	};

	// Handle drag over event for moving cards between lists
	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		// Get the dragged card and its data
		const activeCard = active.data.current as {
			type: string;
			card: Card;
			listId: number;
		};
		const overId = over.id;

		if (!activeCard || activeCard.type !== 'card') return;

		// Find the source and target lists
		const sourceList = lists.find((list) => list.id === activeCard.listId);
		const targetList = lists.find(
			(list) =>
				list.id ===
				(over.data.current?.type === 'list'
					? overId
					: over.data.current?.listId)
		);

		if (!sourceList || !targetList) return;

		// Update lists with the moved card
		setLists((currentLists) => {
			return currentLists.map((list) => {
				// Remove card from source list
				if (list.id === sourceList.id) {
					return {
						...list,
						cards: list.cards?.filter((card) => card.id !== activeCard.card.id),
					};
				}
				// Add card to target list
				if (list.id === targetList.id) {
					return {
						...list,
						cards: [
							...(list.cards || []),
							{ ...activeCard.card, list_id: targetList.id },
						],
					};
				}
				return list;
			});
		});
	};

	// Handle drag end event
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		try {
			// Handle list reordering
			if (
				active.data.current?.type === 'list' &&
				over.data.current?.type === 'list'
			) {
				const oldIndex = lists.findIndex((list) => list.id === active.id);
				const newIndex = lists.findIndex((list) => list.id === over.id);

				if (oldIndex !== newIndex) {
					const newLists = arrayMove(lists, oldIndex, newIndex);
					setLists(newLists);
					// TODO: Update list order in backend
				}
			}

			// Handle card movement between lists
			if (active.data.current?.type === 'card') {
				const cardData = active.data.current as { card: Card; listId: number };
				const targetListId =
					over.data.current?.type === 'list'
						? over.id
						: over.data.current?.listId;

				if (cardData.listId !== targetListId) {
					// Update card's list assignment in backend
					await cardApi.moveCard(cardData.card.id, Number(targetListId));
					onUpdate();
				}
			}
		} catch (error) {
			console.error('Failed to update card position:', error);
			toast({
				title: 'Error',
				description: 'Failed to update card position. Please try again.',
				variant: 'destructive',
			});
			// Revert to original lists state on error
			setLists(board.lists || []);
		} finally {
			setActiveId(null);
		}
	};

	// Rest of the component remains the same
	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className='h-full flex flex-col'>
				{/* Board header content */}
				<div className='flex items-center justify-between mb-6'>
					<div>
						<h1 className='text-2xl font-bold'>{board.title}</h1>
						{board.description && (
							<p className='text-gray-600 dark:text-gray-400 mt-1'>
								{board.description}
							</p>
						)}
					</div>
					<Button variant='outline' onClick={() => setShowCreateList(true)}>
						<IconPlus className='w-4 h-4 mr-2' />
						Add List
					</Button>
				</div>

				{/* Lists container */}
				<div className='flex-1 overflow-x-auto'>
					<div className='flex gap-4 h-full pb-4'>
						<SortableContext items={lists.map((list) => list.id.toString())}>
							{lists.map((list) => (
								<BoardList
									key={list.id}
									list={list}
									onUpdate={onUpdate}
									onCardSelect={setSelectedCard}
									isActive={activeId === list.id.toString()}
								/>
							))}
						</SortableContext>

						{showCreateList && (
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
						)}
					</div>
				</div>

				{/* Card detail modal */}
				{selectedCard && (
					<CardDetail
						card={selectedCard}
						isOpen={true}
						onClose={() => setSelectedCard(null)}
						onUpdate={async (updatedCard) => {
							// Update card in UI immediately for better UX
							setLists((currentLists) =>
								currentLists.map((list) => ({
									...list,
									cards: list.cards?.map((card) =>
										card.id === updatedCard.id ? updatedCard : card
									),
								}))
							);
							onUpdate();
							setSelectedCard(null);
						}}
						onDelete={async () => {
							await cardApi.deleteCard(selectedCard.id);
							onUpdate();
							setSelectedCard(null);
						}}
					/>
				)}
			</div>
		</DndContext>
	);
}
