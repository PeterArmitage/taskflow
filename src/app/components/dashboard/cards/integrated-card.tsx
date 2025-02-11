// components/dashboard/cards/integrated-card.tsx
'use client';

import { Card } from '@/app/types/boards';
import { useCardMovement } from '@/app/hooks/use-card-movement';
import { useTypingIndicator } from './typing-indicator';
import { RealTimeCard } from './real-time-card';
import { useAuth } from '@/app/hooks/useAuth';
import { DragEndEvent } from '@dnd-kit/core';

interface IntegratedCardProps {
	card: Card;
	onUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
	onDelete: (cardId: number) => Promise<void>;
	onMove: (
		cardId: number,
		sourceListId: number,
		targetListId: number,
		position: number
	) => Promise<void>;
	isSelected?: boolean;
	className?: string;
}

export function IntegratedCard({
	card,
	onUpdate,
	onDelete,
	onMove,
	isSelected,
	className,
}: IntegratedCardProps) {
	const { user } = useAuth();

	// Initialize our custom hooks
	const { handleCardMove } = useCardMovement({
		boardId: card.board_id,
		onCardMoved: onMove,
	});

	const { indicator: typingIndicator, handleTyping } = useTypingIndicator(
		card.id,
		user!
	);

	// Handle drag end with proper typing
	const handleDragEnd = (event: DragEndEvent) => {
		if (!event.over) return;

		const sourceListId = parseInt(
			event.active.data.current?.sortable?.containerId
		);
		const targetListId = parseInt(
			event.over.data.current?.sortable?.containerId
		);
		const newIndex = event.over.data.current?.sortable?.index;

		if (sourceListId && targetListId && typeof newIndex === 'number') {
			handleCardMove(card, sourceListId, targetListId, newIndex);
		}
	};

	return (
		<div className='relative'>
			<RealTimeCard
				card={card}
				onUpdate={onUpdate}
				onDelete={onDelete}
				isSelected={isSelected}
				className={className}
				onDragStart={() => {
					// Optional: Add any drag start logic here
					// For example, you might want to show a dragging state
				}}
				onDragEnd={handleDragEnd}
			/>

			{/* Typing indicator overlay */}
			<div className='absolute bottom-0 left-0 right-0 px-3 pb-2'>
				{typingIndicator}
			</div>
		</div>
	);
}
