// components/dashboard/boards/card-item.tsx
'use client';

import { Card } from '@/app/types/boards';
import { motion } from 'framer-motion';
import {
	IconCalendar,
	IconMessageCircle,
	IconPaperclip,
} from '@tabler/icons-react';

interface CardItemProps {
	card: Card;
	onUpdate: () => void;
}

export function CardItem({ card, onUpdate }: CardItemProps) {
	return (
		<motion.div
			layoutId={`card-${card.id}`}
			whileHover={{ scale: 1.02 }}
			className='bg-white dark:bg-neutral-900 p-3 rounded shadow-sm cursor-pointer'
		>
			<h4 className='text-sm font-medium mb-2'>{card.title}</h4>

			{/* Card Footer */}
			<div className='flex items-center gap-3 text-gray-500 dark:text-gray-400'>
				{card.due_date && (
					<div className='flex items-center gap-1 text-xs'>
						<IconCalendar className='w-4 h-4' />
						{new Date(card.due_date).toLocaleDateString()}
					</div>
				)}

				{card.comments_count > 0 && (
					<div className='flex items-center gap-1 text-xs'>
						<IconMessageCircle className='w-4 h-4' />
						{card.comments_count}
					</div>
				)}

				{card.attachments_count > 0 && (
					<div className='flex items-center gap-1 text-xs'>
						<IconPaperclip className='w-4 h-4' />
						{card.attachments_count}
					</div>
				)}
			</div>
		</motion.div>
	);
}
