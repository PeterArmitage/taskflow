import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/types/card';
import { CardDetail } from '@/app/components/cards/card-detail-modal';
import {
	IconCalendar,
	IconPaperclip,
	IconMessageCircle,
} from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
	card: Card;
	onUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
	onDelete: (cardId: number) => Promise<void>;
}

export function CardComponent({ card, onUpdate, onDelete }: CardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: card.id,
			data: {
				type: 'card',
				card,
			},
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<>
			<motion.div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				layout
				onClick={() => setIsModalOpen(true)}
				className='bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow'
			>
				{/* Labels */}
				{card.labels.length > 0 && (
					<div className='flex flex-wrap gap-1 mb-2'>
						{card.labels.map((label) => (
							<div
								key={label.id}
								className='h-2 w-8 rounded-full'
								style={{ backgroundColor: label.color }}
							/>
						))}
					</div>
				)}

				<h3 className='text-sm font-medium mb-2'>{card.title}</h3>

				{/* Card badges */}
				<div className='flex items-center gap-3 text-neutral-500'>
					{card.due_date && (
						<div className='flex items-center gap-1 text-xs'>
							<IconCalendar className='w-4 h-4' />
							{new Date(card.due_date).toLocaleDateString()}
						</div>
					)}

					{card.attachments.length > 0 && (
						<div className='flex items-center gap-1 text-xs'>
							<IconPaperclip className='w-4 h-4' />
							{card.attachments.length}
						</div>
					)}

					{card.comments.length > 0 && (
						<div className='flex items-center gap-1 text-xs'>
							<IconMessageCircle className='w-4 h-4' />
							{card.comments.length}
						</div>
					)}
				</div>
			</motion.div>

			{isModalOpen && (
				<CardDetail
					card={card}
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onUpdate={async (data) => {
						await onUpdate(card.id, data);
					}}
					onDelete={async () => {
						await onDelete(card.id);
					}}
				/>
			)}
		</>
	);
}
