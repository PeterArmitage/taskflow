import { Activity } from './activity';
import { Comment } from './comments';

export interface WebSocketMessage {
	type: 'comment' | 'activity';
	action: 'created' | 'updated' | 'deleted';
	cardId: number;
	data: Comment | Activity;
}
export type WebSocketMessageType = 'comment' | 'card_update' | 'activity';
export type WebSocketAction = 'created' | 'updated' | 'deleted';
