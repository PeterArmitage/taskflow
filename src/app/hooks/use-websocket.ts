// hooks/use-websocket.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketMessage } from '@/app/types/websocket';

interface UseWebSocketOptions {
	cardId: number;
	token?: string;
	onMessage: (message: WebSocketMessage) => void;
	reconnectAttempts?: number;
	reconnectInterval?: number;
}

export function useWebSocket({
	cardId,
	token,
	onMessage,
	reconnectAttempts = 3,
	reconnectInterval = 3000,
}: UseWebSocketOptions) {
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const reconnectCount = useRef(0);

	// Create WebSocket connection
	const connect = useCallback(() => {
		if (!token) return;

		const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/cards/${cardId}?token=${token}`;
		const ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			console.log('WebSocket connected');
			setIsConnected(true);
			setError(null);
			reconnectCount.current = 0;
		};

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data) as WebSocketMessage;
				console.log('WebSocket message received:', message);
				onMessage(message);
			} catch (err) {
				console.error('Failed to parse WebSocket message:', err);
				setError(new Error('Failed to parse WebSocket message'));
			}
		};

		ws.onerror = (event) => {
			console.error('WebSocket error:', event);
			setError(new Error('WebSocket error occurred'));
			setIsConnected(false);
		};

		ws.onclose = (event) => {
			console.log('WebSocket closed:', event);
			setIsConnected(false);

			// Attempt to reconnect
			if (reconnectCount.current < reconnectAttempts) {
				reconnectCount.current++;
				setTimeout(connect, reconnectInterval);
			}
		};

		socketRef.current = ws;
	}, [cardId, token, onMessage, reconnectAttempts, reconnectInterval]);

	// Initialize connection
	useEffect(() => {
		connect();
		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [connect]);

	// Send message function
	const sendMessage = useCallback((message: WebSocketMessage) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(message));
		} else {
			setError(new Error('WebSocket is not connected'));
		}
	}, []);

	return {
		isConnected,
		error,
		sendMessage,
	};
}
