// components/dashboard/boards/card-item.tsx
'use client';

import { Card } from '@/app/types/boards';
import { motion } from 'framer-motion';
import {
	IconCalendar,
	IconMessageCircle,
	IconPaperclip,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export interface CardItemProps {
	card: Card;
	listId: number;
	onClick?: () => void; // Made onClick optional
	isDragging?: boolean;
}

export function CardItem({
	card,
	listId,
	onClick,
	isDragging = false,
}: CardItemProps) {
	return (
		<motion.div
			layoutId={`card-${card.id}`}
			whileHover={{ scale: 1.02 }}
			onClick={onClick} // Will be undefined if not provided
			className={cn(
				'bg-white dark:bg-neutral-900 p-3 rounded shadow-sm cursor-pointer',
				isDragging && 'opacity-50',
				'hover:ring-2 hover:ring-blue-500/50 transition-all'
			)}
		>
			<h4 className='text-sm font-medium mb-2'>{card.title}</h4>

			{/* Card Footer with Metadata */}
			<div className='flex items-center gap-3 text-gray-500 dark:text-gray-400'>
				{card.due_date && (
					<div className='flex items-center gap-1 text-xs'>
						<IconCalendar className='w-4 h-4' />
						{new Date(card.due_date).toLocaleDateString()}
					</div>
				)}

				{(card.comments?.length ?? 0) > 0 && (
					<div className='flex items-center gap-1 text-xs'>
						<IconMessageCircle className='w-4 h-4' />
						{card.comments?.length}
					</div>
				)}

				{(card.attachments_count ?? 0) > 0 && (
					<div className='flex items-center gap-1 text-xs'>
						<IconPaperclip className='w-4 h-4' />
						{card.attachments_count}
					</div>
				)}
			</div>
		</motion.div>
	);
}
