import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Label } from '@/app/types/boards';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconCalendar,
	IconMessageCircle,
	IconPaperclip,
	IconGripVertical,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface CardItemProps {
	card: Card;
	listId: number;
	onClick?: () => void;
	isDragging?: boolean;
	labels?: Label[];
}

export function CardItem({
	card,
	listId,
	onClick,
	isDragging = false,
	labels = [],
}: CardItemProps) {
	// Set up sortable functionality
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isSortableDragging,
	} = useSortable({
		id: card.id.toString(),
		data: {
			type: 'card',
			card,
			listId,
		},
	});

	// Combine drag styles with animation transforms
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging || isSortableDragging ? 0.5 : 1,
	};

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			layoutId={`card-${card.id}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ scale: 1.02 }}
			className={cn(
				'group bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm',
				'hover:shadow-md dark:hover:shadow-neutral-800/50',
				'border border-transparent hover:border-blue-500/20',
				'transition-all duration-200'
			)}
			onClick={onClick}
			{...attributes}
		>
			{/* Drag Handle */}
			<div
				{...listeners}
				className='opacity-0 group-hover:opacity-100 transition-opacity absolute -left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800'
			>
				<IconGripVertical className='w-4 h-4 text-neutral-400' />
			</div>

			{/* Labels Section */}
			{labels.length > 0 && (
				<div className='flex flex-wrap gap-1 mb-2'>
					<AnimatePresence mode='popLayout'>
						{labels.map((label) => (
							<motion.span
								key={label.id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
								style={{ backgroundColor: label.color }}
								className='px-2 py-0.5 rounded-full text-white text-xs'
							>
								{label.name}
							</motion.span>
						))}
					</AnimatePresence>
				</div>
			)}

			{/* Card Title */}
			<h4 className='text-sm font-medium mb-2 line-clamp-2'>{card.title}</h4>

			{/* Card Metadata */}
			<div className='flex items-center gap-3 text-neutral-500 dark:text-neutral-400'>
				{card.due_date && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='flex items-center gap-1 text-xs'
					>
						<IconCalendar className='w-4 h-4' />
						{new Date(card.due_date).toLocaleDateString()}
					</motion.div>
				)}

				{(card.comments_count ?? 0) > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='flex items-center gap-1 text-xs'
					>
						<IconMessageCircle className='w-4 h-4' />
						{card.comments_count}
					</motion.div>
				)}

				{(card.attachments_count ?? 0) > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='flex items-center gap-1 text-xs'
					>
						<IconPaperclip className='w-4 h-4' />
						{card.attachments_count}
					</motion.div>
				)}
			</div>

			{/* Progress Indicator */}
			{card.checklist_total > 0 && (
				<div className='mt-2'>
					<div className='flex justify-between text-xs text-neutral-500 mb-1'>
						<span>Progress</span>
						<span>
							{Math.round(
								(card.checklist_completed / card.checklist_total) * 100
							)}
							%
						</span>
					</div>
					<div className='h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden'>
						<motion.div
							initial={{ width: 0 }}
							animate={{
								width: `${(card.checklist_completed / card.checklist_total) * 100}%`,
							}}
							className='h-full bg-blue-500'
						/>
					</div>
				</div>
			)}
		</motion.div>
	);
}
