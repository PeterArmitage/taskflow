import { User } from './auth';

export interface BaseComment {
	id: number | string;
	content: string;
	card_id: number;
	user_id: number;
	user: User;
	created_at: string;
	updated_at: string;
}

export interface Comment extends BaseComment {
	id: number;
	type: 'standard';
}

export interface BoardComment extends BaseComment {
	id: number;
	type: 'board';
	user: User & { avatar_url?: string | undefined };
}

export interface OptimisticComment extends BaseComment {
	id: string;
	type: 'optimistic';
	optimistic: true;
}

export type AnyComment = Comment | BoardComment | OptimisticComment;

// Type guards
export function isOptimisticComment(
	comment: AnyComment
): comment is OptimisticComment {
	return comment.type === 'optimistic';
}

export function isBoardComment(comment: AnyComment): comment is BoardComment {
	return comment.type === 'board';
}

export function isStandardComment(comment: AnyComment): comment is Comment {
	return comment.type === 'standard';
}

// API Interface types
export interface CommentCreateData {
	content: string;
}

export interface CommentUpdateData {
	content: string;
}
