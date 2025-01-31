// hooks/use-websocket.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { WebSocketMessage } from '@/app/types/websocket';

interface UseWebSocketProps {
	cardId: number;
	onMessage: (message: WebSocketMessage) => void;
}

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000; // 5 seconds

// Helper function to determine the correct WebSocket URL based on environment
const getWebSocketUrl = () => {
	// First check for environment variable
	const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
	if (wsUrl) return wsUrl;

	// If no environment variable, auto-detect based on current protocol
	const isSecure = window.location.protocol === 'https:';
	const host =
		window.location.hostname === 'localhost'
			? 'localhost:8000'
			: window.location.host;
	return `${isSecure ? 'wss' : 'ws'}://${host}`;
};

export function useWebSocket({ cardId, onMessage }: UseWebSocketProps) {
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const reconnectAttempts = useRef(0);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
	const { getToken } = useAuth();

	const onMessageRef = useRef(onMessage);
	onMessageRef.current = onMessage;

	const connect = useCallback(() => {
		try {
			// Prevent duplicate connections
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				console.log('WebSocket already connected');
				return;
			}

			// Check reconnection limit
			if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
				setError(
					new Error(
						'Maximum reconnection attempts reached. Please refresh the page.'
					)
				);
				return;
			}

			// Clean up existing connection if any
			if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}

			// Get and verify authentication token
			const token = getToken();
			if (!token) {
				throw new Error('No authentication token available');
			}

			// Construct WebSocket URL with proper protocol
			const baseUrl = getWebSocketUrl();
			// Remove 'Bearer ' prefix if present in token
			const cleanToken = token.replace('Bearer ', '');
			const encodedToken = encodeURIComponent(cleanToken);
			const fullUrl = `${baseUrl}/ws/cards/${cardId}?token=${encodedToken}`;

			console.log(
				`Attempting WebSocket connection (${reconnectAttempts.current + 1}/${MAX_RECONNECT_ATTEMPTS}):`,
				fullUrl
			);

			const ws = new WebSocket(fullUrl);

			ws.onopen = () => {
				console.log(`WebSocket connected successfully to card ${cardId}`);
				setIsConnected(true);
				setError(null);
				reconnectAttempts.current = 0;

				// Send initial ping to verify connection is working
				ws.send(
					JSON.stringify({
						type: 'ping',
						action: 'health_check',
						cardId,
						data: { timestamp: new Date().toISOString() },
					})
				);
			};

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					console.log('Received WebSocket message:', data);
					onMessageRef.current(data); // Use the ref here
				} catch (err) {
					console.error('Failed to parse WebSocket message:', err);
				}
			};

			ws.onerror = (event) => {
				console.error('WebSocket error:', {
					readyState: ws.readyState,
					url: fullUrl,
					error: event,
				});

				if (wsRef.current?.readyState !== WebSocket.CLOSED) {
					reconnectAttempts.current += 1;
				}

				setError(
					new Error(
						`Connection error (Attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`
					)
				);
				setIsConnected(false);
			};

			ws.onclose = (event) => {
				console.log(`WebSocket closed with code ${event.code}:`, event.reason);
				setIsConnected(false);

				// Don't reconnect on normal closure
				if (event.code === 1000 || event.code === 1001) {
					console.log('WebSocket closed normally');
					return;
				}

				// Clear existing reconnection timeout
				if (reconnectTimeoutRef.current) {
					clearTimeout(reconnectTimeoutRef.current);
				}

				// Schedule reconnection if under max attempts
				if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
					console.log(
						`Scheduling reconnection in ${RECONNECT_DELAY / 1000} seconds...`
					);
					reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
				}
			};

			wsRef.current = ws;
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error('Failed to connect to WebSocket');
			console.error('WebSocket connection failed:', error);
			setError(error);
			setIsConnected(false);

			// Attempt reconnection on connection error
			if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
				reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
			}
		}
	}, [cardId, getToken]);

	const sendMessage = useCallback((message: WebSocketMessage) => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			console.warn('WebSocket not connected. Message not sent:', message);
			return;
		}

		try {
			const messageString = JSON.stringify(message);
			console.log('Sending WebSocket message:', message);
			wsRef.current.send(messageString);
		} catch (err) {
			console.error('Failed to send message:', err);
		}
	}, []);

	useEffect(() => {
		connect();

		return () => {
			console.log('Cleaning up WebSocket connection');
			if (wsRef.current) {
				wsRef.current.close(1000, 'Component unmounting');
				wsRef.current = null;
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
		};
	}, [cardId, getToken, connect]);

	const reset = useCallback(() => {
		reconnectAttempts.current = 0;
		setError(null);
		connect();
	}, [connect]);

	return {
		isConnected,
		error,
		sendMessage,
		reset,
	};
}
