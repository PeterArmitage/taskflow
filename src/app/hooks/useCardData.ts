// hooks/use-card-data.ts
import { useState, useEffect, useCallback } from 'react';
import { Card, Label as CardLabel } from '@/app/types/boards';
import { AnyComment, BoardComment } from '@/app/types/comments';
import { labelApi } from '@/app/api/label';
import { commentApi } from '@/app/api/comment';
import { useToast } from '@/hooks/use-toast';

interface UseCardDataReturn {
	labels: CardLabel[];
	comments: AnyComment[];
	isLoading: boolean;
	setLabels: (labels: CardLabel[]) => void;
	setComments: (comments: AnyComment[]) => void;
	refetch: () => Promise<
		{ labels: CardLabel[]; comments: AnyComment[] } | undefined
	>;
}

export function useCardData(card: Card, isOpen: boolean): UseCardDataReturn {
	const [labels, setLabels] = useState<CardLabel[]>(card.labels || []);
	const [comments, setComments] = useState<AnyComment[]>(card.comments || []);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const fetchData = useCallback(async () => {
		if (!isOpen) return;

		try {
			setIsLoading(true);
			const [fetchedLabels, fetchedComments] = await Promise.all([
				labelApi.getLabels(card.id),
				commentApi.getComments(card.id),
			]);

			const boardComments = fetchedComments.map((comment) => ({
				...comment,
				type: 'board' as const,
				user: {
					...comment.user,
					avatar_url: comment.user?.avatar_url || undefined,
					created_at: comment.created_at,
					updated_at: comment.updated_at,
				},
			})) as BoardComment[];

			setLabels(fetchedLabels);
			setComments(boardComments);

			return { labels: fetchedLabels, comments: boardComments };
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

	useEffect(() => {
		let mounted = true;

		if (isOpen && mounted) {
			fetchData();
		}

		return () => {
			mounted = false;
		};
	}, [fetchData, isOpen]);

	return {
		labels,
		comments,
		isLoading,
		setLabels,
		setComments,
		refetch: fetchData,
	};
}
