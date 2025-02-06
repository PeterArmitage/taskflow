import { Activity } from './activity';
import { Comment, AnyComment } from './comments';

export interface WebSocketMessage {
	type: 'comment' | 'activity';
	action: WebSocketAction;
	cardId: number;
	data: WebSocketDataType;
}

export type WebSocketAction =
	| 'created'
	| 'updated'
	| 'deleted'
	| 'typing'
	| 'typing_stop';

export interface CommentMessageData {
	id: number | string;
	user_id: number;
	content: string;
	card_id: number;
	created_at: string;
	updated_at: string;
	user: {
		id: number;
		username: string;
		email: string;
		created_at: string;
		avatar_url?: string;
	};
}

export type WebSocketDataType = Comment | Activity | TypingData | DeleteData;

export type WebSocketMessageType = 'comment' | 'card_update' | 'activity';

export function isCommentData(
	data: WebSocketDataType
): data is CommentMessageData {
	return (
		'content' in data &&
		'id' in data &&
		'user_id' in data &&
		'card_id' in data &&
		'created_at' in data &&
		'updated_at' in data &&
		'user' in data
	);
}

export interface TypingData {
	user_id: number;
	username?: string;
}

export interface DeleteData {
	id: number | string;
	user_id: number;
}

export function isTypingData(data: WebSocketDataType): data is TypingData {
	return 'user_id' in data && !('id' in data);
}

export function isDeleteData(data: WebSocketDataType): data is DeleteData {
	return 'id' in data && 'user_id' in data && Object.keys(data).length === 2;
}
