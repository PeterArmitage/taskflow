// hooks/useCardData.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Label as CardLabel } from '@/app/types/boards';
import { AnyComment } from '@/app/types/comments';
import { Checklist } from '@/app/types/checklist';
import { labelApi } from '@/app/api/label';
import { commentApi } from '@/app/api/comment';
import { cardApi } from '@/app/api/card';
import { useToast } from '@/hooks/use-toast';

interface UseCardDataReturn {
	labels: CardLabel[];
	comments: AnyComment[];
	checklists: Checklist[];
	isLoading: boolean;
	setLabels: (labels: CardLabel[]) => void;
	setComments: (comments: AnyComment[]) => void;
	setChecklists: (checklists: Checklist[]) => void;
	refetch: () => Promise<void>;
}

export function useCardData(card: Card, isOpen: boolean): UseCardDataReturn {
	const [labels, setLabels] = useState<CardLabel[]>(card.labels || []);
	const [comments, setComments] = useState<AnyComment[]>(card.comments || []);
	const [checklists, setChecklists] = useState<Checklist[]>(
		card.checklists || []
	);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	useEffect(() => {
		console.log('[useCardData] Card data received:', card);
		console.log('[useCardData] Card checklists:', card.checklists);
	}, [card]);

	useEffect(() => {
		console.log('[useCardData] Checklists state updated:', checklists);
	}, [checklists]);
	// Memoize the card data to prevent unnecessary re-renders
	const memoizedCard = useMemo(
		() => ({
			...card,
			checklists: card.checklists || [],
			labels: card.labels || [],
			comments: card.comments || [],
		}),
		[card]
	);

	// Update effect with memoized card
	useEffect(() => {
		if (memoizedCard) {
			setLabels(memoizedCard.labels);
			setComments(memoizedCard.comments);
			setChecklists(memoizedCard.checklists);
		}
	}, [memoizedCard]);

	// Memoize the fetch function
	const fetchData = useCallback(async () => {
		if (!isOpen) return;

		try {
			setIsLoading(true);
			console.log('[useCardData] Fetching fresh data for card:', card.id);
			// Fetch fresh card data
			const updatedCard = await cardApi.getCard(card.id);
			console.log('[useCardData] Received updated card:', updatedCard);
			// Fetch other related data
			const [fetchedLabels, fetchedComments] = await Promise.all([
				labelApi.getLabels(card.id),
				commentApi.getComments(card.id),
			]);

			if (updatedCard.checklists) {
				console.log(
					'[useCardData] Setting checklists:',
					updatedCard.checklists
				);
				setChecklists(updatedCard.checklists);
			}
			setLabels(fetchedLabels);
			setComments(fetchedComments);
			setChecklists(updatedCard.checklists || []);
		} catch (error) {
			console.error('[useCardData] Failed to fetch card data:', error);
			toast({
				title: 'Error',
				description: 'Failed to load card data',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}, [card.id, isOpen, toast]);

	// Add debug logging
	useEffect(() => {
		console.log('Current checklists state:', checklists);
	}, [checklists]);

	return {
		labels,
		comments,
		checklists,
		isLoading,
		setLabels,
		setComments,
		setChecklists,
		refetch: fetchData,
	};
}
