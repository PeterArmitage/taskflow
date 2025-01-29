// api/checklist.ts
import {
	Checklist,
	ChecklistItem,
	CreateChecklistData,
	CreateChecklistItemData,
	UpdateChecklistItemData,
	UpdateChecklistData,
} from '@/app/types/checklist';
import { api, withTrailingSlash, handleApiError } from './api';

export const checklistApi = {
	async createChecklist(data: CreateChecklistData): Promise<Checklist> {
		try {
			console.log('[API] Creating checklist:', data);
			const response = await api.post(withTrailingSlash('checklists'), {
				...data,
				items: [],
			});
			console.log('[API] Checklist creation response:', response.data);
			return response.data;
		} catch (error) {
			console.error('[API] Create checklist error:', error);
			throw handleApiError(error as Error);
		}
	},

	async updateChecklist(
		checklistId: number,
		title: string
	): Promise<Checklist> {
		try {
			console.log('API: Updating checklist:', { checklistId, title });
			const response = await api.put(
				withTrailingSlash(`checklists/${checklistId}`),
				{ title }
			);
			console.log('API: Checklist update response:', response.data);
			return response.data;
		} catch (error) {
			console.error('API: Update checklist error:', error);
			throw handleApiError(error as Error);
		}
	},

	async updateItem(
		itemId: number,
		data: UpdateChecklistItemData
	): Promise<ChecklistItem> {
		try {
			console.log('Updating checklist item:', { itemId, data });
			const response = await api.put(
				withTrailingSlash(`checklist-items/${itemId}`),
				data
			);
			return response.data;
		} catch (error) {
			console.error('Update checklist item error:', error);
			throw handleApiError(error as Error);
		}
	},

	async createItem(data: CreateChecklistItemData): Promise<ChecklistItem> {
		try {
			console.log('Creating checklist item:', data);
			const response = await api.post(
				withTrailingSlash('checklist-items'),
				data
			);
			return response.data;
		} catch (error) {
			console.error('Create checklist item error:', error);
			throw handleApiError(error as Error);
		}
	},

	async deleteItem(itemId: number): Promise<void> {
		try {
			console.log('Deleting checklist item:', itemId);
			await api.delete(withTrailingSlash(`checklist-items/${itemId}`));
		} catch (error) {
			console.error('Delete checklist item error:', error);
			throw handleApiError(error as Error);
		}
	},

	async deleteChecklist(checklistId: number): Promise<void> {
		try {
			console.log('Deleting checklist:', checklistId);
			await api.delete(withTrailingSlash(`checklists/${checklistId}`));
		} catch (error) {
			console.error('Delete checklist error:', error);
			throw handleApiError(error as Error);
		}
	},
	async getChecklists(cardId: number): Promise<Checklist[]> {
		try {
			console.log('[API] Fetching checklists for card:', cardId);
			const response = await api.get(
				withTrailingSlash(`cards/${cardId}/checklists`)
			);
			console.log('[API] Fetched checklists:', response.data);
			return response.data;
		} catch (error) {
			console.error('[API] Get checklists error:', error);
			throw handleApiError(error as Error);
		}
	},
};
