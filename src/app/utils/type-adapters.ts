// utils/type-adapters.ts
import { AuthUser, BoardUser, CommentUser } from '@/app/types/user';
import { Comment as BoardComment, BoardActivity } from '@/app/types/boards';
import { Comment as ComponentComment } from '@/app/types/comments';
import { Activity } from '@/app/types/activity';

interface RawApiComment {
	id: number;
	content: string;
	card_id: number;
	user_id: number;
	created_at: string;
	updated_at: string | null;
}
// Function to convert any user type to AuthUser
export function adaptToAuthUser(user: Partial<BoardUser | AuthUser>): AuthUser {
	return {
		id: user.id ?? 0,
		username: user.username ?? '',
		email: user.email ?? '',
		avatar_url: user.avatar_url ?? undefined,
		created_at: user.created_at ?? new Date().toISOString(),
		updated_at: user.updated_at ?? new Date().toISOString(),
	};
}

// Function to convert any user type to BoardUser
export function adaptToBoardUser(
	user: Partial<BoardUser | AuthUser>
): BoardUser {
	return {
		id: user.id ?? 0,
		username: user.username ?? '',
		email: user.email ?? '',
		avatar_url: user.avatar_url,
		created_at: user.created_at,
		updated_at: user.updated_at,
	};
}

export function adaptToCommentUser(
	user: Partial<BoardUser | AuthUser>
): CommentUser {
	return {
		id: user.id ?? 0,
		username: user.username ?? '',
		email: user.email ?? '',
		avatar_url: user.avatar_url, // This will be string | undefined
		created_at: user.created_at ?? new Date().toISOString(),
		updated_at: user.updated_at ?? new Date().toISOString(),
	};
}
export function adaptBoardActivity(activity: BoardActivity): Activity {
	return {
		id: activity.id,
		type: activity.type,
		card_id: activity.card_id,
		user_id: activity.user_id,
		user: adaptToCommentUser({
			...activity.user,
			created_at: activity.created_at,
			updated_at: activity.updated_at,
		}),
		details: activity.details || '',
		created_at: activity.created_at,
		updated_at: activity.updated_at,
		metadata: activity.metadata,
	};
}

export function adaptBoardComment(comment: BoardComment): ComponentComment {
	// Make sure timestamps are always strings
	const updatedAt = comment.updated_at || comment.created_at;

	const commentUser: CommentUser = {
		id: comment.user_id,
		username: comment.user.username,
		email: comment.user.email,
		avatar_url: comment.user.avatar_url,
		created_at: comment.created_at,
		updated_at: updatedAt,
	};

	return {
		id: comment.id,
		content: comment.content,
		card_id: comment.card_id,
		user_id: comment.user_id,
		user: commentUser,
		created_at: comment.created_at,
		updated_at: updatedAt,
	};
}

export function adaptApiComment(
	apiComment: RawApiComment,
	currentUser: CommentUser
): ComponentComment {
	return {
		id: apiComment.id,
		content: apiComment.content,
		card_id: apiComment.card_id,
		user_id: apiComment.user_id,
		user: currentUser,
		created_at: apiComment.created_at,
		updated_at: apiComment.updated_at || apiComment.created_at,
	};
}
