'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Board, Card } from '@/app/types/boards';
import { boardApi } from '@/app/api/board';
import { Loading } from '@/app/components/ui/loading';
import { BoardView } from '@/app/components/dashboard/boards/board-view';
import { useToast } from '@/hooks/use-toast';
import { CardDetail } from '@/app/components/dashboard/cards/card-detail';

export default function BoardPage() {
	const { boardId } = useParams();
	const [board, setBoard] = useState<Board | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const { toast } = useToast();

	// Load board data
	const loadBoard = useCallback(async () => {
		try {
			setLoading(true);
			const data = await boardApi.getBoard(Number(boardId));
			setBoard(data);
		} catch (error) {
			console.error('Failed to load board:', error);
			toast({
				title: 'Error',
				description: 'Failed to load board. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	}, [boardId, toast]);

	useEffect(() => {
		loadBoard();
	}, [loadBoard]);

	if (loading) return <Loading />;
	if (!board) return <div>Board not found</div>;

	return (
		<div className='h-full'>
			<BoardView board={board} onUpdate={loadBoard} />

			{/* Card Detail Modal */}
			{selectedCard && (
				<CardDetail
					card={selectedCard}
					isOpen={true}
					onClose={() => setSelectedCard(null)}
					onUpdate={async (updatedCard) => {
						await loadBoard();
						setSelectedCard(null);
					}}
					onDelete={async () => {
						await loadBoard();
						setSelectedCard(null);
					}}
				/>
			)}
		</div>
	);
}
