'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Board } from '@/app/types/card';
import { boardApi } from '@/app/api/board';

interface BoardContextType {
	boards: Board[];
	selectedBoard: Board | null;
	loading: boolean;
	error: string | null;
	loadBoards: () => Promise<void>;
	selectBoard: (boardId: number) => Promise<void>;
	refreshBoard: () => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
	const [boards, setBoards] = useState<Board[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadBoards = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await boardApi.getBoards();
			setBoards(
				data.map((board) => ({
					...board,
					lists: board.lists.map((list) => ({
						...list,
						cards: list.cards.map((card) => ({
							...card,
							labels: card.labels || [],
						})),
					})),
				}))
			);
		} catch (err) {
			setError('Failed to load boards');
			console.error('Failed to load boards:', err);
		} finally {
			setLoading(false);
		}
	};

	const selectBoard = async (boardId: number) => {
		try {
			setLoading(true);
			setError(null);
			const board = await boardApi.getBoard(boardId);
			setSelectedBoard({
				...board,
				lists: board.lists.map((list) => ({
					...list,
					cards: list.cards.map((card) => ({
						...card,
						labels: card.labels || [],
					})),
				})),
			});
		} catch (err) {
			setError('Failed to load board');
			console.error('Failed to load board:', err);
		} finally {
			setLoading(false);
		}
	};

	const refreshBoard = async () => {
		if (!selectedBoard) return;

		try {
			setLoading(true);
			const refreshedBoard = await boardApi.getBoard(selectedBoard.id);
			setSelectedBoard({
				...refreshedBoard,
				lists: refreshedBoard.lists.map((list) => ({
					...list,
					cards: list.cards.map((card) => ({
						...card,
						labels: card.labels || [],
					})),
				})),
			});
		} catch (err) {
			console.error('Failed to refresh board:', err);
			setError('Failed to refresh board');
		} finally {
			setLoading(false);
		}
	};

	const value = {
		boards,
		selectedBoard,
		loading,
		error,
		loadBoards,
		selectBoard,
		refreshBoard,
	};

	return (
		<BoardContext.Provider value={value}>{children}</BoardContext.Provider>
	);
}

export function useBoard() {
	const context = useContext(BoardContext);
	if (context === undefined) {
		throw new Error('useBoard must be used within a BoardProvider');
	}
	return context;
}
