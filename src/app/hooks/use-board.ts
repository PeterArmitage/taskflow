// hooks/use-board.ts
import { useState, useCallback } from 'react';
import { Board } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';

interface UseBoardReturn {
	boards: Board[];
	selectedBoard: Board | null;
	loading: boolean;
	error: string | null;
	loadBoards: () => Promise<void>;
	selectBoard: (boardId: number) => Promise<void>;
	createBoard: (data: {
		title: string;
		description?: string;
	}) => Promise<Board>;
	updateBoard: (boardId: number, data: Partial<Board>) => Promise<void>;
	deleteBoard: (boardId: number) => Promise<void>;
	refreshBoard: () => Promise<void>;
}

export function useBoard(): UseBoardReturn {
	// State management for boards and loading states
	const [boards, setBoards] = useState<Board[]>([]);
	const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load all boards
	const loadBoards = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await boardApi.getBoards();
			setBoards(data);
		} catch (err) {
			console.error('Failed to load boards:', err);
			setError('Failed to load boards');
			throw err; // Re-throw to allow handling in components
		} finally {
			setLoading(false);
		}
	}, []);

	// Select and load a specific board
	const selectBoard = useCallback(async (boardId: number) => {
		try {
			setLoading(true);
			setError(null);
			const board = await boardApi.getBoard(boardId);
			setSelectedBoard(board);
		} catch (err) {
			console.error('Failed to load board:', err);
			setError('Failed to load board');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Create a new board
	const createBoard = useCallback(
		async (data: { title: string; description?: string }) => {
			try {
				setLoading(true);
				setError(null);
				const newBoard = await boardApi.createBoard(data);
				setBoards((prev) => [...prev, newBoard]);
				return newBoard;
			} catch (err) {
				console.error('Failed to create board:', err);
				setError('Failed to create board');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Update an existing board
	const updateBoard = useCallback(
		async (boardId: number, data: Partial<Board>) => {
			try {
				setLoading(true);
				setError(null);
				const updatedBoard = await boardApi.updateBoard(boardId, data);

				setBoards((prev) =>
					prev.map((board) => (board.id === boardId ? updatedBoard : board))
				);

				if (selectedBoard?.id === boardId) {
					setSelectedBoard(updatedBoard);
				}
			} catch (err) {
				console.error('Failed to update board:', err);
				setError('Failed to update board');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[selectedBoard]
	);

	// Delete a board
	const deleteBoard = useCallback(
		async (boardId: number) => {
			try {
				setLoading(true);
				setError(null);
				await boardApi.deleteBoard(boardId);

				setBoards((prev) => prev.filter((board) => board.id !== boardId));

				if (selectedBoard?.id === boardId) {
					setSelectedBoard(null);
				}
			} catch (err) {
				console.error('Failed to delete board:', err);
				setError('Failed to delete board');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[selectedBoard]
	);

	// Refresh current board
	const refreshBoard = useCallback(async () => {
		if (!selectedBoard) return;

		try {
			setLoading(true);
			const refreshedBoard = await boardApi.getBoard(selectedBoard.id);
			setSelectedBoard(refreshedBoard);

			// Also update the board in the boards list
			setBoards((prev) =>
				prev.map((board) =>
					board.id === refreshedBoard.id ? refreshedBoard : board
				)
			);
		} catch (err) {
			console.error('Failed to refresh board:', err);
			setError('Failed to refresh board');
			throw err;
		} finally {
			setLoading(false);
		}
	}, [selectedBoard]);

	return {
		boards,
		selectedBoard,
		loading,
		error,
		loadBoards,
		selectBoard,
		createBoard,
		updateBoard,
		deleteBoard,
		refreshBoard,
	};
}
