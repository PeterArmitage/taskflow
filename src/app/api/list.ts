// api/list.ts
import { List } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

interface ListUpdateData {
	title: string;
	position?: number;
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

	async updateList(listId: number, data: ListUpdateData): Promise<List> {
		try {
			console.log('listApi updateList - Starting request:', { listId, data });
			const response = await api.put(
				withTrailingSlash(`lists/${listId}`),
				data
			);
			console.log('listApi updateList - Response:', response.data);
			return response.data;
		} catch (error) {
			console.error('listApi updateList - Error:', error);
			throw handleApiError(error as Error);
		}
	},

	async deleteList(id: number): Promise<boolean> {
		try {
			console.log(`Attempting to delete list ${id}`);

			const response = await api.delete(withTrailingSlash(`lists/${id}`));

			console.log(`Successfully deleted list ${id}`);

			return response.status === 200;
		} catch (error) {
			console.error('Error deleting list:', {
				listId: id,
				error: error,
				status: (error as { response?: { status?: number } })?.response?.status,
				message: (error as { response?: { data?: { detail?: string } } })
					?.response?.data?.detail,
			});

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
