// components/dashboard/presence/presence-indicator.tsx
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { Avatar } from '@/app/components/ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { UserPresence } from '@/app/types/presence';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { WebSocketPresenceData } from '@/app/types/websocket';

interface PresenceIndicatorProps {
	cardId: number;
	className?: string;
}

export function PresenceIndicator({
	cardId,
	className,
}: PresenceIndicatorProps) {
	const [activeUsers, setActiveUsers] = useState<Map<number, UserPresence>>(
		new Map()
	);
	const { user } = useAuth();
	const { sendMessage } = useWebSocket({
		boardId: cardId,
		cardId,
		onMessage: (message) => {
			if (message.type === 'presence') {
				updatePresence(message.data as WebSocketPresenceData);
			}
		},
	});

	const updatePresence = useCallback(
		(presenceData: WebSocketPresenceData) => {
			setActiveUsers((prev) => {
				const newMap = new Map(prev);
				if (presenceData.action === 'join') {
					newMap.set(presenceData.user.id, {
						user: presenceData.user,
						status: 'active',
						lastActive: presenceData.timestamp,
						currentCard: cardId,
					});
				} else {
					newMap.delete(presenceData.user.id);
				}
				return newMap;
			});
		},
		[cardId]
	);

	useEffect(() => {
		if (!user) return;

		const presenceData: WebSocketPresenceData = {
			user,
			action: 'join',
			timestamp: new Date().toISOString(),
			userId: user.id,
			cardId,
		};

		sendMessage({
			type: 'presence',
			action: 'join',
			cardId,
			data: presenceData,
		});

		return () => {
			sendMessage({
				type: 'presence',
				action: 'leave',
				cardId,
				data: { ...presenceData, action: 'leave' },
			});
		};
	}, [cardId, user, sendMessage]);

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<AnimatePresence mode='popLayout'>
				{Array.from(activeUsers.values()).map((presence) => (
					<motion.div
						key={presence.user.id}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
					>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Avatar
										src={presence.user.avatar_url}
										fallback={presence.user.username[0].toUpperCase()}
										className={cn(
											'ring-2 transition-colors',
											presence.status === 'active'
												? 'ring-green-500'
												: 'ring-yellow-500'
										)}
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p className='font-medium'>{presence.user.username}</p>
									<p className='text-xs text-neutral-400'>
										Active{' '}
										{formatDistanceToNow(new Date(presence.lastActive), {
											addSuffix: true,
										})}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
