// services/websocket.ts

import { Activity } from '@/app/types/activity';
import { Comment } from '@/app/types/comments';

interface WebSocketMessage {
	type: 'comment' | 'activity';
	action: 'created' | 'updated' | 'deleted';
	cardId: number;
	data: Comment | Activity;
}

export class WebSocketService {
	private socket: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout = 1000;
	private subscribers: Map<string, (message: WebSocketMessage) => void> =
		new Map();

	constructor(private baseUrl: string) {}

	connect(cardId: number, token: string) {
		if (this.socket?.readyState === WebSocket.OPEN) return;

		this.socket = new WebSocket(
			`${this.baseUrl}/ws/cards/${cardId}?token=${token}`
		);

		this.socket.onopen = () => {
			console.log('WebSocket connected');
			this.reconnectAttempts = 0;
		};

		this.socket.onmessage = (event) => {
			try {
				const message: WebSocketMessage = JSON.parse(event.data);
				this.notifySubscribers(message);
			} catch (error) {
				console.error('Failed to parse WebSocket message:', error);
			}
		};

		this.socket.onclose = () => {
			console.log('WebSocket closed');
			this.handleReconnect(cardId, token);
		};

		this.socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};
	}

	private handleReconnect(cardId: number, token: string) {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error('Max reconnection attempts reached');
			return;
		}

		setTimeout(
			() => {
				this.reconnectAttempts++;
				this.connect(cardId, token);
			},
			this.reconnectTimeout * Math.pow(2, this.reconnectAttempts)
		);
	}

	subscribe(id: string, callback: (message: WebSocketMessage) => void) {
		this.subscribers.set(id, callback);
		return () => this.subscribers.delete(id);
	}

	private notifySubscribers(message: WebSocketMessage) {
		this.subscribers.forEach((callback) => callback(message));
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
		this.subscribers.clear();
	}
}

// Create a singleton instance
export const webSocketService = new WebSocketService(
	process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
);
