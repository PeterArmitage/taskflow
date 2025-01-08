import { Activity } from './activity';
import { Comment } from './comments';

export interface WebSocketMessage {
	type: 'comment' | 'activity';
	action: 'created' | 'updated' | 'deleted';
	cardId: number;
	data: Comment | Activity;
}
