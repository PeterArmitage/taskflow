// hooks/useCardData.ts
import { useState, useEffect, useCallback } from 'react';
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

	// Sync with card prop changes
	useEffect(() => {
		if (card) {
			setLabels(card.labels || []);
			setComments(card.comments || []);
			setChecklists(card.checklists || []);
		}
	}, [card]);

	const fetchData = useCallback(async () => {
		if (!isOpen) return;

		try {
			setIsLoading(true);

			// Get checklists through the card API instead
			const updatedCard = await cardApi.getCard(card.id);
			const [fetchedLabels, fetchedComments] = await Promise.all([
				labelApi.getLabels(card.id),
				commentApi.getComments(card.id),
			]);

			setLabels(fetchedLabels);
			setComments(fetchedComments);
			setChecklists(updatedCard.checklists || []);
		} catch (error) {
			console.error('Failed to fetch card data:', error);
			toast({
				title: 'Error',
				description: 'Failed to load card data',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}, [card.id, isOpen, toast]);

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
