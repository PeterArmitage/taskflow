import { useState, useCallback } from 'react';
import {
	DragStartEvent,
	DragEndEvent,
	DragOverEvent,
	useSensor,
	useSensors,
	PointerSensor,
	MouseSensor,
	TouchSensor,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useToast } from '@/hooks/use-toast';
import { Board, Card, List } from '@/app/types/boards';
import { cardApi } from '@/app/api/card';

interface DragDropState {
	activeId: string | null;
	lists: List[];
	draggedItemType: 'card' | 'list' | null;
	dragSource: { listId: number } | null;
}

interface UseDragDropOptions {
	board: Board;
	onUpdate: () => void;
}

export function useDragDrop({ board, onUpdate }: UseDragDropOptions) {
	const [state, setState] = useState<DragDropState>({
		activeId: null,
		lists: board.lists || [],
		draggedItemType: null,
		dragSource: null,
	});

	const { toast } = useToast();

	// Configure sensors with optimized settings
	const sensors = useSensors(
		useSensor(PointerSensor, {
			// Small activation distance to prevent accidental drags
			activationConstraint: { distance: 8 },
		}),
		useSensor(MouseSensor, {
			// Consistent experience across devices
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			// Better mobile experience with slight delay
			activationConstraint: { delay: 100, tolerance: 5 },
		})
	);

	// Track drag start with item type identification
	const handleDragStart = useCallback((event: DragStartEvent) => {
		const { active } = event;
		const itemType = active.data.current?.type as 'card' | 'list';
		const sourceListId = active.data.current?.listId;

		setState((prev) => ({
			...prev,
			activeId: active.id as string,
			draggedItemType: itemType,
			dragSource: sourceListId ? { listId: sourceListId } : null,
		}));
	}, []);

	// Handle drag over for live updates and animations
	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over || !state.draggedItemType) return;

			if (state.draggedItemType === 'card') {
				const activeCard = active.data.current as {
					type: 'card';
					card: Card;
					listId: number;
				};
				const overListId =
					over.data.current?.type === 'list'
						? over.id
						: over.data.current?.listId;

				if (
					!activeCard ||
					activeCard.type !== 'card' ||
					activeCard.listId === overListId
				)
					return;

				setState((prev) => ({
					...prev,
					lists: prev.lists.map((list) => {
						// Remove from source list
						if (list.id === activeCard.listId) {
							return {
								...list,
								cards: list.cards?.filter(
									(card) => card.id !== activeCard.card.id
								),
							};
						}
						// Add to target list
						if (list.id === Number(overListId)) {
							return {
								...list,
								cards: [
									...(list.cards || []),
									{ ...activeCard.card, list_id: Number(overListId) },
								],
							};
						}
						return list;
					}),
				}));
			}
		},
		[state.draggedItemType]
	);

	// Handle drag end with optimistic updates and error handling
	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			if (!over) return;

			try {
				if (state.draggedItemType === 'list') {
					// Handle list reordering
					const oldIndex = state.lists.findIndex(
						(list) => list.id === active.id
					);
					const newIndex = state.lists.findIndex((list) => list.id === over.id);

					if (oldIndex !== newIndex) {
						const newLists = arrayMove(state.lists, oldIndex, newIndex);
						setState((prev) => ({ ...prev, lists: newLists }));
						// TODO: Implement backend list order update
					}
				} else if (state.draggedItemType === 'card') {
					// Handle card movement
					const cardData = active.data.current as {
						card: Card;
						listId: number;
					};
					const targetListId =
						over.data.current?.type === 'list'
							? over.id
							: over.data.current?.listId;

					if (cardData.listId !== targetListId) {
						await cardApi.moveCard(cardData.card.id, Number(targetListId));
						onUpdate();
					}
				}
			} catch (error) {
				console.error('Drag operation failed:', error);
				toast({
					title: 'Error',
					description: 'Failed to update position. Changes have been reverted.',
					variant: 'destructive',
				});

				// Revert to original state on error
				setState((prev) => ({
					...prev,
					lists: board.lists || [],
				}));
			} finally {
				// Reset drag state
				setState((prev) => ({
					...prev,
					activeId: null,
					draggedItemType: null,
					dragSource: null,
				}));
			}
		},
		[state.draggedItemType, state.lists, board.lists, onUpdate, toast]
	);

	return {
		sensors,
		activeId: state.activeId,
		lists: state.lists,
		draggedItemType: state.draggedItemType,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
