// components/test/websocket-test.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/hooks/useAuth';

interface WebSocketTestProps {
	cardId: number;
}

export function WebSocketTest({ cardId }: WebSocketTestProps) {
	const [messages, setMessages] = useState<string[]>([]);
	const { user } = useAuth();
	const { isConnected, error, sendMessage, reset } = useWebSocket({
		cardId,
		onMessage: (message) => {
			setMessages((prev) => [...prev, JSON.stringify(message, null, 2)]);
		},
	});

	useEffect(() => {
		return () => {
			if (isConnected) {
				reset();
			}
		};
	}, [isConnected, reset]);

	if (!user) {
		return (
			<Alert>
				<AlertDescription>
					Please sign in to test WebSocket functionality
				</AlertDescription>
			</Alert>
		);
	}

	const sendTestMessage = () => {
		if (!user) return;

		sendMessage({
			type: 'comment',
			action: 'created',
			cardId,
			data: {
				id: Date.now(),
				type: 'standard',
				content: `Test message ${new Date().toISOString()}`,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				card_id: cardId,
				user_id: user.id,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					created_at: user.created_at,
				},
			},
		});
	};

	return (
		<div className='space-y-6'>
			{/* Connection Status */}
			<div className='flex items-center gap-2'>
				<div
					className={cn(
						'w-3 h-3 rounded-full transition-colors',
						isConnected ? 'bg-green-500' : 'bg-red-500'
					)}
				/>
				<span className='text-sm font-medium'>
					{isConnected ? 'Connected' : 'Disconnected'}
				</span>
			</div>

			{/* User Info */}
			<div className='p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg'>
				<h3 className='font-medium mb-2'>Current User:</h3>
				<pre className='text-sm'>
					{JSON.stringify(
						{
							id: user.id,
							username: user.username,
							email: user.email,
						},
						null,
						2
					)}
				</pre>
			</div>

			{/* Error Display */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						<Alert variant='destructive'>
							<AlertDescription>{error.message}</AlertDescription>
						</Alert>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Test Controls */}
			<div className='flex gap-4'>
				<Button
					onClick={sendTestMessage}
					disabled={!isConnected}
					variant='default'
				>
					Send Test Message
				</Button>

				<Button onClick={() => setMessages([])} variant='outline'>
					Clear Messages
				</Button>

				<Button onClick={reset} variant='outline' disabled={isConnected}>
					Reconnect
				</Button>
			</div>

			{/* Messages Display */}
			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<h3 className='font-medium'>Messages:</h3>
					<span className='text-sm text-neutral-500'>
						{messages.length} messages
					</span>
				</div>
				<ScrollArea className='h-[400px] border rounded-md p-4'>
					<AnimatePresence mode='popLayout'>
						{messages.map((msg, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className='mb-2'
							>
								<div className='flex items-center gap-2 mb-1'>
									<span className='text-xs text-neutral-500'>
										Message {messages.length - i}
									</span>
									<span className='text-xs text-neutral-500'>
										{new Date().toLocaleTimeString()}
									</span>
								</div>
								<pre className='p-3 bg-neutral-50 dark:bg-neutral-900 rounded-md overflow-x-auto whitespace-pre-wrap break-words'>
									{msg}
								</pre>
							</motion.div>
						))}
					</AnimatePresence>
					{messages.length === 0 && (
						<div className='text-center text-neutral-500 py-8'>
							No messages yet. Send a test message to see it appear here.
						</div>
					)}
				</ScrollArea>
			</div>
		</div>
	);
}
