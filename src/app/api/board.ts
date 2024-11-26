// api/board.ts
import { Board } from '@/app/types/boards';
import { api, withTrailingSlash, handleApiError } from './api';

export const boardApi = {
	async getBoards(): Promise<Board[]> {
		try {
			const response = await api.get(withTrailingSlash('boards'));
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async createBoard(data: {
		title: string;
		description?: string;
	}): Promise<Board> {
		try {
			const response = await api.post(withTrailingSlash('boards'), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async getBoard(id: number): Promise<Board> {
		try {
			const response = await api.get(withTrailingSlash(`boards/${id}`));
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async updateBoard(
		id: number,
		data: { title?: string; description?: string }
	): Promise<Board> {
		try {
			const response = await api.put(withTrailingSlash(`boards/${id}`), data);
			return response.data;
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},

	async deleteBoard(id: number): Promise<void> {
		try {
			await api.delete(withTrailingSlash(`boards/${id}`));
		} catch (error) {
			throw handleApiError(error as Error);
		}
	},
};
