'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Board, Card } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';
import { Loading } from '@/app/components/ui/loading';
import { BoardList } from '@/app/components/dashboard/boards/board-list';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	useSensor,
	useSensors,
	PointerSensor,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { CreateListForm } from '@/app/components/dashboard/boards/create-list-form';
import { CardDetail } from '@/app/components/dashboard/cards/card-detail';
import { useToast } from '@/hooks/use-toast';

export default function BoardPage() {
	const { boardId } = useParams();
	const [board, setBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(true);
	const [showCreateList, setShowCreateList] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const { toast } = useToast();

	// Configure sensors with explicit typing
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
			console.log('Fetching board data for ID:', boardId);
			setLoading(true);
			const data = await boardApi.getBoard(Number(boardId));
			console.log('Board data received:', data);
			if (data.lists) {
				console.log('Lists in board data:', data.lists);
			}
			setBoard(data);
			console.log('Board state updated:', data);
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

	useEffect(() => {
		loadBoard();
	}, [loadBoard]);

	// Handle card moving between lists with proper type checking
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

			// Move the card between lists
			const [movedCard] = sourceList.cards.splice(cardIndex, 1);
			if (!targetList.cards) targetList.cards = [];
			targetList.cards.push({ ...movedCard, list_id: Number(overListId) });

			return { ...currentBoard, lists: newLists };
		});
	};

	// Handle drag end with type safety
	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || !board?.lists) return;

		// Handle list reordering
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

	const handleCardSelect = useCallback((card: Card) => {
		setSelectedCard(card);
	}, []);

	if (loading) return <Loading />;
	if (!board) return <div>Board not found</div>;

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<div className='flex flex-col h-full'>
				{/* Board Header */}
				<div className='flex items-center justify-between p-4 border-b dark:border-neutral-800'>
					<h1 className='text-2xl font-bold'>{board.title}</h1>
					<Button
						variant='outline'
						onClick={() => setShowCreateList(true)}
						className='flex items-center gap-2'
					>
						<IconPlus className='w-4 h-4' />
						Add List
					</Button>
				</div>

				{/* Lists Container */}
				<div className='flex-1 overflow-x-auto p-4'>
					<div className='flex gap-4'>
						<SortableContext
							items={board.lists?.map((list) => list.id.toString()) || []}
						>
							{board.lists?.map((list) => (
								<BoardList
									key={list.id}
									list={list}
									onUpdate={loadBoard}
									onCardSelect={handleCardSelect}
									isActive={activeId === list.id.toString()}
								/>
							))}
						</SortableContext>

						{/* Create List Form */}
						{showCreateList && (
							<div className='w-80 flex-shrink-0'>
								<CreateListForm
									boardId={board.id}
									onCancel={() => setShowCreateList(false)}
									onSuccess={() => {
										setShowCreateList(false);
										loadBoard();
									}}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Card Detail Modal */}
			{selectedCard && (
				<CardDetail
					card={selectedCard}
					isOpen={true}
					onClose={() => setSelectedCard(null)}
					onUpdate={async () => {
						await loadBoard();
						setSelectedCard(null);
					}}
					onDelete={async () => {
						await loadBoard();
						setSelectedCard(null);
					}}
				/>
			)}
		</DndContext>
	);
}
