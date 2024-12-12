// types/comments.ts

import { CommentUser } from './user';

export interface Comment {
	id: number;
	content: string;
	card_id: number;
	user_id: number;
	user: CommentUser;
	created_at: string;
	updated_at: string;
}

export interface CommentCreate {
	content: string;
	card_id: number;
}

export interface CommentUpdate {
	content: string;
}

export interface OptimisticComment extends Omit<Comment, 'id'> {
	id: number | string;
	optimistic?: boolean;
}

export interface CommentsContextValue {
	comments: Comment[];
	isLoading: boolean;
	error: Error | null;
	addComment: (comment: CommentCreate) => Promise<void>;
	updateComment: (id: number, comment: CommentUpdate) => Promise<void>;
	deleteComment: (id: number) => Promise<void>;
}
