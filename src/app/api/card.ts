// api/card.ts
import { Card } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

export const cardApi = {
	async createCard(data: {
		title: string;
		list_id: number;
		description?: string;
		due_date?: string;
	}): Promise<Card> {
		try {
			const response = await api.post(withTrailingSlash('cards'), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateCard(
		id: number,
		data: {
			title?: string;
			description?: string;
			list_id?: number;
			due_date?: string;
		}
	): Promise<Card> {
		try {
			const response = await api.put(withTrailingSlash(`cards/${id}`), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteCard(id: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`cards/${id}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
