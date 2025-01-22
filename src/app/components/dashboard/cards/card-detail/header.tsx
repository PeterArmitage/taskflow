// components/dashboard/cards/card-detail/header.tsx
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
	IconClock,
	IconCalendar,
	IconEdit,
	IconTrash,
} from '@tabler/icons-react';
import { Card } from '@/app/types/boards';
import { DateHelper } from '@/app/types/helpers';

interface CardDetailHeaderProps {
	title: string;
	isEditing: boolean;
	setTitle: (title: string) => void;
	card: Card;
	dueDate: string | null;
	onEdit: () => void;
	onDelete: () => void;
}

export const CardDetailHeader = memo(function CardDetailHeader({
	title,
	isEditing,
	setTitle,
	card,
	dueDate,
	onEdit,
	onDelete,
}: CardDetailHeaderProps) {
	return (
		<div className='p-6 border-b dark:border-neutral-800'>
			<div className='flex items-start justify-between'>
				<div className='flex-1'>
					{isEditing ? (
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className='text-2xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full'
							autoFocus
						/>
					) : (
						<h2 className='text-2xl font-semibold px-2'>{title}</h2>
					)}
					<div className='flex items-center gap-4 mt-2 text-neutral-500'>
						<div className='flex items-center gap-2 text-sm'>
							<IconClock className='w-4 h-4' />
							Created {DateHelper.toDate(card.created_at)?.toLocaleDateString()}
						</div>
						{dueDate && (
							<div className='flex items-center gap-2 text-sm'>
								<IconCalendar className='w-4 h-4' />
								Due {DateHelper.toDate(dueDate)?.toLocaleDateString()}
							</div>
						)}
					</div>
				</div>
				<div className='flex gap-2'>
					<Button variant='ghost' size='sm' onClick={onEdit}>
						<IconEdit className='w-4 h-4' />
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={onDelete}
						className='text-red-500 hover:text-red-600'
					>
						<IconTrash className='w-4 h-4' />
					</Button>
				</div>
			</div>
		</div>
	);
});
