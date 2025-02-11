// types/activity.ts
import { AuthUser } from './user';
import { Comment } from './comments';
import { User } from './auth';

// Base type for all activities
export interface BaseActivity {
	id: number;
	userId: number;
	cardId: number;
	boardId: number;
	timestamp: string;
	user: User;
	title: string; // Common field for display purposes
	details?: string;
	metadata?: Record<string, unknown>;
}

// Activity types enumeration
export type ActivityType =
	| 'card_created'
	| 'card_updated'
	| 'card_moved'
	| 'comment_added'
	| 'label_added'
	| 'label_removed'
	| 'due_date_updated'
	| 'attachment_added'
	| 'comment_created'
	| 'comment_updated'
	| 'comment_deleted'
	| 'list_created'
	| 'list_updated'
	| 'list_archived'
	| 'member_added'
	| 'member_removed'
	| 'permission_updated';

// Specific activity types
export interface CommentActivity extends BaseActivity {
	type: 'comment_created' | 'comment_updated' | 'comment_deleted';
	commentId: number;
	content: string;
	cardTitle: string;
}

export interface CardActivity extends BaseActivity {
	type: 'card_created' | 'card_moved' | 'card_updated' | 'card_archived';
	fromList?: string;
	toList?: string;
	changes?: {
		field: string;
		oldValue: string;
		newValue: string;
	}[];
	cardTitle: string;
}

export interface ListActivity extends BaseActivity {
	type: 'list_created' | 'list_updated' | 'list_archived';
}

export interface MemberActivity extends BaseActivity {
	type: 'member_added' | 'member_removed' | 'permission_updated';
	targetUserId: number;
	targetUser: User;
	permission?: string;
}

// Timeline types
export interface TimelineItem {
	id: number | string;
	type: 'activity' | 'comment';
	content: Activity | Comment;
	timestamp: string;
}

// Union type for all activities
export type Activity =
	| CommentActivity
	| CardActivity
	| ListActivity
	| MemberActivity;
