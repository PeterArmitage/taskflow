// api/label.ts
import { Label } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

interface CreateLabelRequest {
	name: string;
	color: string;
	description?: string;
	type?: string;
}

export const labelApi = {
	async createLabel(cardId: number, data: CreateLabelRequest): Promise<Label> {
		try {
			console.log('API: Creating label with data:', data);
			// Ensure description is included in payload
			const payload = {
				name: data.name,
				color: data.color,
				description: data.description,
				...(data.type && { type: data.type }),
			};

			console.log('API: Final payload:', payload);
			const response = await api.post(
				withTrailingSlash(`cards/${cardId}/labels`),
				payload
			);
			console.log('API: Response data:', response.data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateLabel(
		labelId: number,
		data: {
			name?: string;
			color?: string;
		}
	): Promise<Label> {
		try {
			const response = await api.put(
				withTrailingSlash(`labels/${labelId}`),
				data
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteLabel(labelId: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`labels/${labelId}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async getLabels(cardId: number): Promise<Label[]> {
		try {
			const response = await api.get(
				withTrailingSlash(`cards/${cardId}/labels`)
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
