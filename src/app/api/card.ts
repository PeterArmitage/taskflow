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

	// Update an existing card
	async updateCard(cardId: number, data: CardUpdateData): Promise<Card> {
		try {
			const response = await api.put<CardUpdateResponse>(
				withTrailingSlash(`cards/${cardId}`),
				data
			);
			return response.data.data;
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
			await api.delete(withTrailingSlash(`cards/${cardId}`));
		} catch (error) {
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
};
