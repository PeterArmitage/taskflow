// types/websocket.ts
import { Activity } from './activity';
import { Comment } from './comments';
import { User } from './auth';
import { Card } from './boards';

interface BaseWebSocketData {
	userId: number;
}

export type WebSocketMessageType =
	| 'comment'
	| 'activity'
	| 'card'
	| 'list'
	| 'presence'
	| 'edit'
	| 'cursor'
	| 'board';

export type WebSocketAction =
	| 'created'
	| 'updated'
	| 'deleted'
	| 'moved'
	| 'typing'
	| 'typing_stop'
	| 'join'
	| 'leave'
	| 'insert'
	| 'update'
	| 'delete';

export interface WebSocketPresenceData extends BaseWebSocketData {
	user: User;
	action: 'join' | 'leave';
	timestamp: string;
	cardId?: number;
}

export interface WebSocketTypingData extends BaseWebSocketData {
	username: string;
	card_id?: number;
}

export interface WebSocketDeleteData extends BaseWebSocketData {
	id: number;
}

export interface WebSocketCommentData extends Comment, BaseWebSocketData {
	action?: string;
	timestamp: string;
}

export interface WebSocketCardData extends Card, BaseWebSocketData {
	previous_list_id?: number;
	new_list_id?: number;
}

export interface WebSocketEditData extends BaseWebSocketData, Operation {
	id: string;
	type: 'insert' | 'delete';
	position: number;
	content?: string;
	length?: number;
	timestamp: number;
}

export interface WebSocketCursorData extends BaseWebSocketData {
	user: {
		id: number;
		username: string;
		color: string;
	};
	position: {
		start: number;
		end: number;
	};
}

export type WebSocketActivityData = Activity & {
	action?: string;
};

// Updated union type to include new collaborative editing types
export type WebSocketData =
	| WebSocketPresenceData
	| WebSocketTypingData
	| WebSocketDeleteData
	| WebSocketCommentData
	| WebSocketCardData
	| WebSocketEditData
	| WebSocketCursorData
	| WebSocketActivityData
	| Activity;

export interface WebSocketMessage {
	type: WebSocketMessageType;
	action: WebSocketAction;
	cardId: number;
	data: WebSocketData;
}

// Existing type guards
export function isCardData(data: WebSocketData): data is WebSocketCardData {
	return 'title' in data && 'list_id' in data;
}

export function isPresenceData(
	data: WebSocketData
): data is WebSocketPresenceData {
	return (
		'user' in data &&
		'action' in data &&
		(data.action === 'join' || data.action === 'leave') &&
		'timestamp' in data
	);
}

export function isTypingData(data: WebSocketData): data is WebSocketTypingData {
	return (
		'user_id' in data &&
		'username' in data &&
		!('content' in data) &&
		!('title' in data)
	);
}

export function isDeleteData(data: WebSocketData): data is WebSocketDeleteData {
	return (
		'id' in data &&
		'user_id' in data &&
		!('content' in data) &&
		!('title' in data) &&
		!('username' in data)
	);
}

export function isCommentData(
	data: WebSocketData
): data is WebSocketCommentData {
	return 'content' in data && 'card_id' in data && 'user' in data;
}

// New type guards for collaborative editing
export function isEditData(data: WebSocketData): data is WebSocketEditData {
	return (
		'type' in data &&
		'position' in data &&
		'timestamp' in data &&
		'id' in data &&
		'user_id' in data &&
		(data.type === 'insert' || data.type === 'delete')
	);
}

export function isCursorData(data: WebSocketData): data is WebSocketCursorData {
	return (
		'user' in data &&
		'position' in data &&
		typeof data.position.start === 'number' &&
		typeof data.position.end === 'number'
	);
}

export function createWebSocketMessage(
	type: WebSocketMessageType,
	action: WebSocketAction,
	cardId: number,
	data: WebSocketData
): WebSocketMessage {
	return {
		type,
		action,
		cardId,
		data,
	};
}

export interface Operation extends BaseWebSocketData {
	id: string;
	type: 'insert' | 'delete';
	position: number;
	content?: string;
	length?: number;
	timestamp: number;
	userId: number;
}
