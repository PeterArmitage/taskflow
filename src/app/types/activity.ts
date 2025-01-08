// types/activity.ts
import { AuthUser } from './user';
import { Comment } from './comments';

export type ActivityType =
	| 'card_created'
	| 'card_updated'
	| 'card_moved'
	| 'comment_added'
	| 'label_added'
	| 'label_removed'
	| 'due_date_updated'
	| 'attachment_added';

export interface BaseActivity {
	id: number;
	type: ActivityType;
	card_id: number;
	user_id: number;
	user: AuthUser;
	details?: string;
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
}
export interface Activity extends BaseActivity {
	details?: string;
}
export interface TimelineItem {
	id: number | string;
	type: 'activity' | 'comment';
	content: Activity | Comment;
	timestamp: string;
}
