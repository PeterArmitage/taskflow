// api/comments.ts

import { api } from './api';
import { Comment, CommentCreate, CommentUpdate } from '@/app/types/comments';
import { handleApiError } from './api';

export const commentApi = {
	async getComments(cardId: number): Promise<Comment[]> {
		try {
			const response = await api.get(`/cards/${cardId}/comments`);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async createComment(cardId: number, content: string): Promise<Comment> {
		try {
			// Add proper error handling and logging
			console.log('Making API request to create comment:', { cardId, content });

			const response = await api.post(`/cards/${cardId}/comments`, {
				content,
			});

			console.log('API response:', response.data);

			// Ensure the response matches our Comment type
			return response.data;
		} catch (error) {
			console.error('API error creating comment:', error);
			throw error;
		}
	},
	async updateComment(commentId: number, content: string): Promise<Comment> {
		const update: CommentUpdate = { content };
		const response = await api.put(`/comments/${commentId}`, update);
		return response.data;
	},

	async deleteComment(commentId: number): Promise<void> {
		try {
			await api.delete(`/comments/${commentId}`);
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
