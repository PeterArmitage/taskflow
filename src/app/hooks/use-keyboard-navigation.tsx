// hooks/use-keyboard-navigation.ts
import { useEffect, useCallback, useState } from 'react';
import { Card, List } from '@/app/types/boards';

interface KeyboardNavigationState {
	selectedCardId: string | null;
	selectedListId: string | null;
	isEditing: boolean;
}

interface UseKeyboardNavigationOptions {
	lists: List[];
	onCardSelect: (card: Card) => void;
	onCardMove: (
		cardId: number,
		sourceListId: number,
		targetListId: number
	) => void;
	onListMove: (listId: number, direction: 'left' | 'right') => void;
}

/**
 * Custom hook to manage keyboard navigation in a Kanban board
 * Provides keyboard shortcuts for:
 * - Moving between cards (↑/↓)
 * - Moving between lists (←/→)
 * - Moving cards between lists (Shift + ←/→)
 * - Opening card details (Enter)
 * - Quick editing (Space)
 */
export function useKeyboardNavigation({
	lists,
	onCardSelect,
	onCardMove,
	onListMove,
}: UseKeyboardNavigationOptions) {
	// Track current selection and editing state
	const [state, setState] = useState<KeyboardNavigationState>({
		selectedCardId: null,
		selectedListId: lists[0]?.id.toString() || null,
		isEditing: false,
	});

	// Helper function to find the next/previous card in the current list
	const findAdjacentCard = useCallback(
		(direction: 'up' | 'down') => {
			if (!state.selectedListId || !state.selectedCardId) return null;

			const currentList = lists.find(
				(list) => list.id.toString() === state.selectedListId
			);
			if (!currentList?.cards) return null;

			const currentIndex = currentList.cards.findIndex(
				(card) => card.id.toString() === state.selectedCardId
			);

			const targetIndex =
				direction === 'up' ? currentIndex - 1 : currentIndex + 1;
			return currentList.cards[targetIndex]?.id.toString() || null;
		},
		[state.selectedListId, state.selectedCardId, lists]
	);

	// Helper function to find the next/previous list
	const findAdjacentList = useCallback(
		(direction: 'left' | 'right') => {
			const currentIndex = lists.findIndex(
				(list) => list.id.toString() === state.selectedListId
			);
			const targetIndex =
				direction === 'left' ? currentIndex - 1 : currentIndex + 1;
			return lists[targetIndex]?.id.toString() || null;
		},
		[state.selectedListId, lists]
	);

	// Handle keyboard events
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Don't handle keyboard shortcuts if we're editing text
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			switch (event.key) {
				case 'ArrowUp': {
					event.preventDefault();
					const nextCardId = findAdjacentCard('up');
					if (nextCardId) {
						setState((prev) => ({ ...prev, selectedCardId: nextCardId }));
					}
					break;
				}
				case 'ArrowDown': {
					event.preventDefault();
					const nextCardId = findAdjacentCard('down');
					if (nextCardId) {
						setState((prev) => ({ ...prev, selectedCardId: nextCardId }));
					}
					break;
				}
				case 'ArrowLeft': {
					event.preventDefault();
					if (event.shiftKey && state.selectedCardId) {
						// Move card to previous list
						const currentList = lists.find(
							(list) => list.id.toString() === state.selectedListId
						);
						const targetListId = findAdjacentList('left');
						if (currentList && targetListId) {
							onCardMove(
								parseInt(state.selectedCardId),
								currentList.id,
								parseInt(targetListId)
							);
						}
					} else {
						// Move focus to previous list
						const nextListId = findAdjacentList('left');
						if (nextListId) {
							setState((prev) => ({
								...prev,
								selectedListId: nextListId,
								selectedCardId: null,
							}));
							onListMove(parseInt(state.selectedListId!), 'left');
						}
					}
					break;
				}
				case 'ArrowRight': {
					event.preventDefault();
					if (event.shiftKey && state.selectedCardId) {
						// Move card to next list
						const currentList = lists.find(
							(list) => list.id.toString() === state.selectedListId
						);
						const targetListId = findAdjacentList('right');
						if (currentList && targetListId) {
							onCardMove(
								parseInt(state.selectedCardId),
								currentList.id,
								parseInt(targetListId)
							);
						}
					} else {
						// Move focus to next list
						const nextListId = findAdjacentList('right');
						if (nextListId) {
							setState((prev) => ({
								...prev,
								selectedListId: nextListId,
								selectedCardId: null,
							}));
							onListMove(parseInt(state.selectedListId!), 'right');
						}
					}
					break;
				}
				case 'Enter': {
					event.preventDefault();
					if (state.selectedCardId) {
						const currentList = lists.find(
							(list) => list.id.toString() === state.selectedListId
						);
						const selectedCard = currentList?.cards?.find(
							(card) => card.id.toString() === state.selectedCardId
						);
						if (selectedCard) {
							onCardSelect(selectedCard);
						}
					}
					break;
				}
				case 'Escape': {
					event.preventDefault();
					setState((prev) => ({
						...prev,
						selectedCardId: null,
						isEditing: false,
					}));
					break;
				}
			}
		},
		[
			state.selectedCardId,
			state.selectedListId,
			findAdjacentCard,
			findAdjacentList,
			lists,
			onCardSelect,
			onCardMove,
			onListMove,
		]
	);

	// Set up keyboard event listeners
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	return {
		selectedCardId: state.selectedCardId,
		selectedListId: state.selectedListId,
		isEditing: state.isEditing,
		setSelectedCard: (cardId: string | null) =>
			setState((prev) => ({ ...prev, selectedCardId: cardId })),
		setSelectedList: (listId: string | null) =>
			setState((prev) => ({ ...prev, selectedListId: listId })),
	};
}
