// utils/comment-adapters.ts
import { Comment as BoardComment } from '@/app/types/boards';
import { Comment as CommentType } from '@/app/types/comments';
import { User } from '@/app/types/auth';

// Adapter function to convert board comment to comment type
export function adaptBoardComment(boardComment: BoardComment): CommentType {
	// Create a type-safe user object
	const user: User = {
		id: boardComment.user.id,
		username: boardComment.user.username,
		email: boardComment.user.email,
		avatar_url: boardComment.user.avatar_url || undefined, // Convert null to undefined
		created_at: boardComment.created_at,
		updated_at: boardComment.updated_at,
	};

	return {
		id: boardComment.id,
		content: boardComment.content,
		card_id: boardComment.card_id,
		user_id: boardComment.user_id,
		user,
		created_at: boardComment.created_at,
		updated_at: boardComment.updated_at,
	};
}

// Adapter function to convert array of board comments
export function adaptBoardComments(
	boardComments: BoardComment[]
): CommentType[] {
	return boardComments.map(adaptBoardComment);
}
