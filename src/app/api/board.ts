import axios from 'axios';
import { Board, BoardWithLists } from '@/app/types/boards';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const boardApi = {
	async createBoard(data: {
		title: string;
		description?: string;
	}): Promise<Board> {
		const response = await axios.post(`${API_URL}/boards/`, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data;
	},

	async getBoards(): Promise<Board[]> {
		const response = await axios.get(`${API_URL}/boards/`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data;
	},

	async getBoard(id: string): Promise<BoardWithLists> {
		const response = await axios.get(`${API_URL}/boards/${id}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		return response.data;
	},
};
