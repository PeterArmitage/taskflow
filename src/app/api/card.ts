// api/card.ts
import { Card } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';
import {
	CardResponse,
	CardsResponse,
	CardUpdateResponse,
	CardMoveResponse,
	BatchOperationResponse,
} from '@/app/types/api-responses';
import { Nullable } from '@/app/types/helpers';
import { Label } from '@/app/types/boards';
import {
	Checklist,
	CreateChecklistData,
	ChecklistItem,
} from '@/app/types/checklist';

interface CardCreateData {
	title: string;
	list_id: number;
	description?: string;
	due_date?: Nullable<string>;
}

interface CardUpdateData {
	title?: string;
	description?: Nullable<string>;
	due_date?: Nullable<string>;
	position?: number;
	labels?: Label[];
	checklists?: Checklist[];
}

export const cardApi = {
	// Create a new card
	async createCard(data: CardCreateData): Promise<Card> {
		try {
			const response = await api.post<CardResponse>(
				withTrailingSlash('cards'),
				data
			);
			return response.data.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
	async getCard(cardId: number): Promise<Card> {
		try {
			const response = await api.get(withTrailingSlash(`cards/${cardId}`));
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
	// Update an existing card
	async updateCard(cardId: number, data: CardUpdateData): Promise<Card> {
		try {
			console.log('Updating card:', cardId, 'with data:', data);
			// Update the card
			const response = await api.put(
				withTrailingSlash(`cards/${cardId}`),
				data
			);

			// After updating, fetch the fresh card data to ensure we have all relationships
			const updatedCard = await api.get(withTrailingSlash(`cards/${cardId}`));
			console.log('Updated card data:', updatedCard.data);

			return updatedCard.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	// Checklist operations
	async createChecklist(
		cardId: number,
		data: CreateChecklistData
	): Promise<Checklist> {
		try {
			const response = await api.post(
				withTrailingSlash(`cards/${cardId}/checklists`),
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateChecklist(
		checklistId: number,
		data: Partial<Checklist>
	): Promise<Checklist> {
		try {
			const response = await api.put(
				withTrailingSlash(`checklists/${checklistId}`),
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteChecklist(checklistId: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`checklists/${checklistId}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async createChecklistItem(
		checklistId: number,
		content: string
	): Promise<ChecklistItem> {
		try {
			const response = await api.post(
				withTrailingSlash(`checklists/${checklistId}/items`),
				{ content }
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateChecklistItem(
		itemId: number,
		data: Partial<ChecklistItem>
	): Promise<ChecklistItem> {
		try {
			const response = await api.put(
				withTrailingSlash(`checklist-items/${itemId}`),
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteChecklistItem(itemId: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`checklist-items/${itemId}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	// Move a card to a different list
	async moveCard(
		cardId: number,
		targetListId: number,
		position?: number
	): Promise<CardMoveResponse['data']> {
		try {
			const response = await api.put<CardMoveResponse>(
				withTrailingSlash(`cards/${cardId}/move`),
				{ list_id: targetListId, position }
			);
			return response.data.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	// Delete a card
	async deleteCard(cardId: number): Promise<void> {
		try {
			console.log('Deleting card:', cardId);
			await api.delete(withTrailingSlash(`cards/${cardId}`));
		} catch (error) {
			console.error('Failed to delete card:', error);
			throw handleApiError(error as Error);
		}
	},

	// Get all cards for a board
	async getBoardCards(
		boardId: number,
		page = 1,
		perPage = 20
	): Promise<CardsResponse['data']> {
		try {
			const response = await api.get<CardsResponse>(
				withTrailingSlash(`boards/${boardId}/cards`),
				{ params: { page, per_page: perPage } }
			);
			return response.data.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	// Comment operations
	updateComment: async (
		commentId: number,
		content: string
	): Promise<Comment> => {
		try {
			const response = await api.put(`/comments/${commentId}`, { content });
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	deleteComment: async (commentId: number): Promise<void> => {
		try {
			await api.delete(`/comments/${commentId}`);
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
	async updateCardTitle(cardId: number, title: string): Promise<Card> {
		try {
			console.log('Updating card title:', { cardId, title });
			const response = await api.put(withTrailingSlash(`cards/${cardId}`), {
				title,
			});
			return response.data;
		} catch (error) {
			console.error('Failed to update card title:', error);
			throw handleApiError(error as Error);
		}
	},
};
