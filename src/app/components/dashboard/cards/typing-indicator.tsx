// components/dashboard/cards/typing-indicator.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { createWebSocketMessage, isTypingData } from '@/app/types/websocket';
import { User } from '@/app/types/auth';

interface TypingIndicatorProps {
	cardId: number;
	currentUser: User;
	boardId?: number;
}

interface TypingUser {
	id: number;
	username: string;
	timestamp: number;
}

export function TypingIndicator({
	cardId,
	currentUser,
	boardId,
}: TypingIndicatorProps) {
	const [typingUsers, setTypingUsers] = useState<Map<number, TypingUser>>(
		new Map()
	);
	const effectiveBoardId = boardId ?? currentUser.boardId ?? 0;
	const debounceTimeout = useRef<NodeJS.Timeout>();
	const TYPING_TIMEOUT = 3000; // How long before we consider someone to have stopped typing

	const { sendMessage } = useWebSocket({
		boardId: effectiveBoardId,
		cardId,
		onMessage: (message) => {
			if (
				message.type === 'comment' &&
				(message.action === 'typing' || message.action === 'typing_stop')
			) {
				if (isTypingData(message.data)) {
					const { user_id, username } = message.data;

					// Don't show typing indicator for current user
					if (user_id === currentUser.id) return;

					if (message.action === 'typing') {
						setTypingUsers((prev) => {
							const newMap = new Map(prev);
							newMap.set(user_id, {
								id: user_id,
								username,
								timestamp: Date.now(),
							});
							return newMap;
						});
					} else {
						setTypingUsers((prev) => {
							const newMap = new Map(prev);
							newMap.delete(user_id);
							return newMap;
						});
					}
				}
			}
		},
	});

	// Clean up stale typing indicators
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			setTypingUsers((prev) => {
				const newMap = new Map(prev);
				for (const [userId, userData] of newMap.entries()) {
					if (now - userData.timestamp > TYPING_TIMEOUT) {
						newMap.delete(userId);
					}
				}
				return newMap;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const handleTyping = useCallback(() => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		// Send typing start
		sendMessage(
			createWebSocketMessage('comment', 'typing', cardId, {
				user_id: currentUser.id,
				username: currentUser.username,
			})
		);

		// Set timeout to send typing stop
		debounceTimeout.current = setTimeout(() => {
			sendMessage(
				createWebSocketMessage('comment', 'typing_stop', cardId, {
					user_id: currentUser.id,
					username: currentUser.username,
				})
			);
		}, TYPING_TIMEOUT);
	}, [cardId, currentUser, sendMessage]);

	return (
		<AnimatePresence>
			{typingUsers.size > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className='text-sm text-neutral-500 italic mt-2'
				>
					{Array.from(typingUsers.values())
						.map((user) => user.username)
						.join(', ')}{' '}
					{typingUsers.size === 1 ? 'is' : 'are'} typing...
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Custom hook to manage typing state
export function useTypingIndicator(cardId: number, currentUser: User) {
	const indicator = (
		<TypingIndicator cardId={cardId} currentUser={currentUser} />
	);
	const handleTyping = useCallback(() => {
		const element = document.getElementById(`typing-indicator-${cardId}`);
		if (element) {
			element.dispatchEvent(new Event('userTyping'));
		}
	}, [cardId]);

	return {
		indicator,
		handleTyping,
	};
}
