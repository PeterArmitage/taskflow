// app/(dashboard)/boards/[boardId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Board, Card } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';
import { Loading } from '@/app/components/ui/loading';
import { BoardView } from '@/app/components/dashboard/boards/board-view';
import { useToast } from '@/hooks/use-toast';
import { listApi } from '@/app/api/list';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	useSensor,
	useSensors,
	PointerSensor,
	DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

export default function BoardPage() {
	const { boardId } = useParams();
	const [board, setBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeId, setActiveId] = useState<string | null>(null);
	const { toast } = useToast();

	// Configure DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	// Load board data
	const loadBoard = useCallback(async () => {
		try {
			setLoading(true);
			const data = await boardApi.getBoard(Number(boardId));
			if (data && data.id) {
				setBoard(data);
				console.log('Board state updated successfully');
			} else {
				throw new Error('Invalid board data received');
			}
		} catch (error) {
			console.error('Failed to load board:', error);
			toast({
				title: 'Error',
				description: 'Failed to load board. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	}, [boardId, toast]);

	// Handler for list operations
	const handleListOperation = useCallback(async () => {
		setLoading(true);
		await loadBoard();
		setLoading(false);
	}, [loadBoard]);

	// DnD handlers
	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id.toString());
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || !board?.lists) return;

		const activeListId = active.data.current?.listId;
		const overListId =
			over.data.current?.type === 'list' ? over.id : over.data.current?.listId;

		if (!activeListId || !overListId || activeListId === overListId) return;

		setBoard((currentBoard) => {
			if (!currentBoard?.lists) return currentBoard;

			const newLists = [...currentBoard.lists];
			const sourceList = newLists.find((list) => list.id === activeListId);
			const targetList = newLists.find((list) => list.id === overListId);

			if (!sourceList?.cards || !targetList) return currentBoard;

			const cardIndex = sourceList.cards.findIndex(
				(card) => card.id === active.id
			);
			if (cardIndex === -1) return currentBoard;

			const [movedCard] = sourceList.cards.splice(cardIndex, 1);
			if (!targetList.cards) targetList.cards = [];
			targetList.cards.push({ ...movedCard, list_id: Number(overListId) });

			return { ...currentBoard, lists: newLists };
		});
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || !board?.lists) return;

		if (
			active.data.current?.type === 'list' &&
			over.data.current?.type === 'list'
		) {
			const oldIndex = board.lists.findIndex((list) => list.id === active.id);
			const newIndex = board.lists.findIndex((list) => list.id === over.id);

			if (oldIndex !== newIndex) {
				const newLists = arrayMove(board.lists, oldIndex, newIndex);
				setBoard({ ...board, lists: newLists });
			}
		}

		setActiveId(null);
	};

	useEffect(() => {
		loadBoard();
	}, [loadBoard]);

	if (loading) return <Loading />;
	if (!board) return <div>Board not found</div>;

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<BoardView
				board={board}
				onUpdate={handleListOperation}
				onListEdit={async (listId: number, newTitle: string) => {
					try {
						await listApi.updateList(listId, { title: newTitle });
						await handleListOperation();
					} catch (error) {
						console.error('Failed to update list:', error);
						toast({
							title: 'Error',
							description: 'Failed to update list title',
							variant: 'destructive',
						});
					}
				}}
				onListDelete={async (listId: number) => {
					try {
						await listApi.deleteList(listId);
						await handleListOperation();
					} catch (error) {
						console.error('Failed to delete list:', error);
						toast({
							title: 'Error',
							description: 'Failed to delete list',
							variant: 'destructive',
						});
					}
				}}
				activeId={activeId}
			/>
		</DndContext>
	);
}
