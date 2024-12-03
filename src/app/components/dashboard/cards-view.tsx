// components/dashboard/cards-view.tsx
import { useState } from 'react';
import {
	IconLayoutKanban,
	IconListDetails,
	IconLoader2,
} from '@tabler/icons-react';
import { Card } from '@/app/types/card';
import { CardComponent } from './cards/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoard } from '@/app/contexts/BoardContext';
import { cardApi } from '@/app/api/card';

export function CardsView() {
	const { selectedBoard, loading, refreshBoard } = useBoard();
	const [viewType, setViewType] = useState<'board' | 'list'>('board');

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<IconLoader2 className='w-6 h-6 animate-spin' />
			</div>
		);
	}

	if (!selectedBoard) {
		return (
			<div className='text-center p-6'>
				<p>Select a board to view cards</p>
			</div>
		);
	}

	// Safely collect all cards from lists
	const cards: Card[] = selectedBoard.lists.reduce<Card[]>((acc, list) => {
		if (list.cards) {
			return [...acc, ...list.cards];
		}
		return acc;
	}, []);

	const handleCardUpdate = async (cardId: number, data: Partial<Card>) => {
		try {
			await cardApi.updateCard(cardId, data);
			// Use the refreshBoard function from context
			await refreshBoard();
		} catch (error) {
			console.error('Failed to update card:', error);
		}
	};

	const handleCardDelete = async (cardId: number) => {
		try {
			await cardApi.deleteCard(cardId);
			await refreshBoard();
		} catch (error) {
			console.error('Failed to delete card:', error);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Rest of your JSX remains the same, but now types are fixed */}
			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold'>Cards</h2>
				<Tabs
					value={viewType}
					onValueChange={(value) => setViewType(value as 'board' | 'list')}
				>
					<TabsList>
						<TabsTrigger value='board'>
							<IconLayoutKanban className='w-4 h-4 mr-2' />
							Board View
						</TabsTrigger>
						<TabsTrigger value='list'>
							<IconListDetails className='w-4 h-4 mr-2' />
							List View
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{viewType === 'board' ? (
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{cards.map((card) => (
						<CardComponent
							key={card.id}
							card={card}
							onUpdate={handleCardUpdate}
							onDelete={handleCardDelete}
						/>
					))}
				</div>
			) : (
				<div className='space-y-2'>
					{cards.map((card) => (
						<div
							key={card.id}
							className='flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg'
						>
							<div>
								<h3 className='font-medium'>{card.title}</h3>
								<p className='text-sm text-neutral-500'>
									{new Date(card.created_at).toLocaleDateString()}
								</p>
							</div>
							<Button
								variant='outline'
								onClick={() => handleCardUpdate(card.id, {})}
							>
								View Details
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
