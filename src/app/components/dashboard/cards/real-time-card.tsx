// components/dashboard/cards/real-time-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/types/boards';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { CardDetail } from './card-detail/card-detail';
import {
	IconCalendar,
	IconPaperclip,
	IconMessageCircle,
	IconUser,
} from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
	WebSocketMessage,
	isCardData,
	isPresenceData,
	createWebSocketMessage,
	WebSocketPresenceData,
} from '@/app/types/websocket';
import { BoardRealTimeUpdate } from '@/app/types/real-time-updates';
import { DragEndEvent } from '@dnd-kit/core';

interface RealTimeCardProps {
	card: Card;
	onUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
	onDelete: (cardId: number) => Promise<void>;
	isSelected?: boolean;
	className?: string;
	onDragStart?: () => void;
	onDragEnd?: (event: DragEndEvent) => void;
}

export function RealTimeCard({
	card,
	onUpdate,
	onDelete,
	isSelected,
	className,
}: RealTimeCardProps) {
	// State management with proper typing
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeUsers, setActiveUsers] = useState<Set<number>>(new Set());
	const { toast } = useToast();

	// DnD setup
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: card.id,
		data: {
			type: 'card',
			card,
		},
	});

	// WebSocket handler with type-safe message handling
	const { sendMessage } = useWebSocket({
		boardId: card.board_id,
		cardId: card.id,
		onMessage: (message: WebSocketMessage | BoardRealTimeUpdate) => {
			const { data } = message;

			if (isCardData(data)) {
				// Handle card updates with type safety
				if (data.user_id !== card.user_id) {
					onUpdate(card.id, {
						...data,
						// Ensure we don't override crucial properties
						id: card.id,
						list_id: data.list_id || card.list_id,
					});
				}
			} else if (isPresenceData(data)) {
				// Handle presence updates with proper typing
				setActiveUsers((prev) => {
					const newSet = new Set(prev);
					if (data.action === 'join') {
						newSet.add(data.user.id);
					} else {
						newSet.delete(data.user.id);
					}
					return newSet;
				});
			}
		},
	});

	// Presence notification effect
	useEffect(() => {
		if (!isModalOpen) return;

		// Helper function to create presence data
		const createPresenceData = (
			action: 'join' | 'leave'
		): WebSocketPresenceData => ({
			user: {
				id: card.user_id,
				username: '', // You might want to get this from your auth context
				email: '', // You might want to get this from your auth context
				created_at: new Date().toISOString(),
			},
			action,
			timestamp: new Date().toISOString(),
		});

		// Send join message
		sendMessage(
			createWebSocketMessage(
				'presence',
				'join',
				card.id,
				createPresenceData('join')
			)
		);

		// Cleanup: send leave message
		return () => {
			sendMessage(
				createWebSocketMessage(
					'presence',
					'leave',
					card.id,
					createPresenceData('leave')
				)
			);
		};
	}, [isModalOpen, card.id, card.user_id, sendMessage]);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<>
			<motion.div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				layout
				onClick={() => setIsModalOpen(true)}
				className={cn(
					'bg-white dark:bg-neutral-900 p-3 rounded-lg',
					'shadow-sm cursor-pointer hover:shadow-md transition-shadow',
					isSelected && 'ring-2 ring-blue-500',
					isDragging && 'opacity-50',
					className
				)}
			>
				{/* Labels section */}
				{card.labels && card.labels.length > 0 && (
					<div className='flex flex-wrap gap-1 mb-2'>
						{card.labels.map((label) => (
							<div
								key={label.id}
								className='h-2 w-8 rounded-full'
								style={{ backgroundColor: label.color }}
							/>
						))}
					</div>
				)}

				<h3 className='text-sm font-medium mb-2'>{card.title}</h3>

				{/* Card badges */}
				<div className='flex items-center gap-3 text-neutral-500'>
					{/* Due date badge */}
					{card.due_date && (
						<div className='flex items-center gap-1 text-xs'>
							<IconCalendar className='w-4 h-4' />
							{new Date(card.due_date).toLocaleDateString()}
						</div>
					)}

					{/* Attachments badge */}
					{card.attachments && card.attachments.length > 0 && (
						<div className='flex items-center gap-1 text-xs'>
							<IconPaperclip className='w-4 h-4' />
							{card.attachments.length}
						</div>
					)}

					{/* Comments badge */}
					{card.comments && card.comments.length > 0 && (
						<div className='flex items-center gap-1 text-xs'>
							<IconMessageCircle className='w-4 h-4' />
							{card.comments.length}
						</div>
					)}

					{/* Active users badge */}
					{activeUsers.size > 0 && (
						<div className='flex items-center gap-1 text-xs ml-auto'>
							<IconUser className='w-4 h-4' />
							{activeUsers.size}
						</div>
					)}
				</div>
			</motion.div>

			{/* Card Detail Modal */}
			{isModalOpen && (
				<CardDetail
					card={card}
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onUpdate={async (data) => {
						try {
							await onUpdate(card.id, data);
							// Broadcast update with type safety
							sendMessage(
								createWebSocketMessage('card', 'updated', card.id, {
									...card,
									...data,
									user_id: card.user_id,
								})
							);
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
							await onDelete(card.id);
							// Broadcast deletion with type safety
							sendMessage(
								createWebSocketMessage('card', 'deleted', card.id, {
									id: card.id,
									user_id: card.user_id,
								})
							);
						} catch (error) {
							toast({
								title: 'Error',
								description: 'Failed to delete card',
								variant: 'destructive',
							});
						}
					}}
					activeUsers={Array.from(activeUsers)}
				/>
			)}
		</>
	);
}
