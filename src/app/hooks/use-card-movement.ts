// hooks/use-card-movement.ts
import { useCallback } from 'react';
import { Card } from '@/app/types/boards';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { createWebSocketMessage, isCardData } from '@/app/types/websocket';
import { useToast } from '@/hooks/use-toast';

interface UseCardMovementProps {
	boardId: number;
	onCardMoved: (
		cardId: number,
		sourceListId: number,
		targetListId: number,
		position: number
	) => Promise<void>;
}

export function useCardMovement({
	boardId,
	onCardMoved,
}: UseCardMovementProps) {
	const { toast } = useToast();
	const { sendMessage } = useWebSocket({
		boardId,
		cardId: 0,
		onMessage: (message) => {
			if (
				isCardData(message.data) &&
				message.type === 'card' &&
				message.action === 'moved'
			) {
				const {
					id: cardId,
					list_id: sourceListId,
					previous_list_id: targetListId,
					position,
				} = message.data;
				if (cardId && sourceListId && targetListId && position !== undefined) {
					onCardMoved(cardId, sourceListId, targetListId, position);
				}
			}
		},
	});

	const handleCardMove = useCallback(
		async (
			card: Card,
			sourceListId: number,
			targetListId: number,
			position: number
		) => {
			try {
				// First, update locally for immediate feedback
				await onCardMoved(card.id, sourceListId, targetListId, position);

				// Then, broadcast the movement to other users
				sendMessage(
					createWebSocketMessage('card', 'moved', card.id, {
						id: card.id,
						list_id: sourceListId,
						previous_list_id: targetListId,
						position,
						user_id: card.user_id,
						timestamp: new Date().toISOString(),
					})
				);

				toast({
					title: 'Success',
					description: 'Card moved successfully',
				});
			} catch (error) {
				console.error('Failed to move card:', error);
				toast({
					title: 'Error',
					description: 'Failed to move card. The change will be reverted.',
					variant: 'destructive',
				});

				// You might want to add logic here to revert the UI to the previous state
			}
		},
		[onCardMoved, sendMessage, toast]
	);

	return {
		handleCardMove,
	};
}
