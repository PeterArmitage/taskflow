// api/list.ts
import { List } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

interface ListReorderParams {
	listId: number;
	direction: 'left' | 'right';
}

export const listApi = {
	// Existing methods
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

	// New reorderList method
	async reorderList(
		listId: number,
		direction: 'left' | 'right'
	): Promise<List> {
		try {
			const response = await api.patch(
				withTrailingSlash(`lists/${listId}/reorder`),
				{
					direction,
				}
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	// Additional method for batch reordering if needed
	async reorderLists(boardId: number, listIds: number[]): Promise<List[]> {
		try {
			const response = await api.patch(
				withTrailingSlash(`boards/${boardId}/lists/reorder`),
				{
					list_ids: listIds,
				}
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
