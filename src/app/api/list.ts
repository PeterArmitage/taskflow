// api/list.ts
import { List } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

export const listApi = {
	async createList(data: { title: string; board_id: number }): Promise<List> {
		try {
			const response = await api.post(withTrailingSlash('lists'), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateList(id: number, data: { title: string }): Promise<List> {
		try {
			const response = await api.put(withTrailingSlash(`lists/${id}`), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteList(id: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`lists/${id}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
