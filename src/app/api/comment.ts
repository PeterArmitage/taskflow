// api/comment.ts
import {
	Comment,
	CommentCreateData,
	CommentUpdateData,
	BoardComment,
} from '@/app/types/comments';
import { api, withTrailingSlash, handleApiError } from './api';

export const commentApi = {
	async createComment(cardId: number, content: string): Promise<BoardComment> {
		try {
			console.log('Creating comment:', { cardId, content });
			const response = await api.post(
				withTrailingSlash(`cards/${cardId}/comments`),
				{
					content,
				}
			);
			console.log('Comment created:', response.data);
			const data = response.data;

			// Ensure we have a valid user object
			const user = data.user || {};

			return {
				id: data.id,
				content: data.content,
				card_id: data.card_id,
				user_id: data.user_id,
				created_at: data.created_at,
				updated_at: data.updated_at,
				type: 'board',
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					avatar_url: user.avatar_url || undefined,
					created_at: user.created_at,
					updated_at: user.updated_at,
				},
			} as BoardComment;
		} catch (error) {
			console.error('Error creating comment:', error);
			throw handleApiError(error as Error);
		}
	},

	async updateComment(commentId: number, content: string): Promise<Comment> {
		try {
			console.log('Updating comment:', { commentId, content });
			const response = await api.put(
				withTrailingSlash(`comments/${commentId}`),
				{
					content,
				}
			);
			console.log('Comment updated:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error updating comment:', error);
			throw handleApiError(error as Error);
		}
	},

	async deleteComment(commentId: number): Promise<void> {
		try {
			console.log('Deleting comment:', commentId);
			await api.delete(withTrailingSlash(`comments/${commentId}`));
			console.log('Comment deleted successfully');
		} catch (error) {
			console.error('Error deleting comment:', error);
			throw handleApiError(error as Error);
		}
	},

	async getComments(cardId: number): Promise<Comment[]> {
		try {
			console.log('Fetching comments for card:', cardId);
			const response = await api.get(
				withTrailingSlash(`cards/${cardId}/comments`)
			);
			console.log('Comments fetched:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error fetching comments:', error);
			throw handleApiError(error as Error);
		}
	},
};
