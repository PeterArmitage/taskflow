// components/dashboard/cards/card-detail/header.tsx
import { useState } from 'react';
import { Card } from '@/app/types/boards';
import { IconX, IconTrash, IconPencil } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CardDetailHeaderProps {
	card: Card;
	title: string;
	isEditing: boolean;
	setTitle: (title: string) => void;
	onEdit: () => void;
	onDelete: () => Promise<void>;
	onClose: () => void;
	isSaving?: boolean;
}

export function CardDetailHeader({
	card,
	title,
	isEditing,
	setTitle,
	onEdit,
	onDelete,
	onClose,
	isSaving = false,
}: CardDetailHeaderProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await onDelete();
			setIsDeleteDialogOpen(false);
			onClose();
		} catch (error) {
			console.error('Failed to delete card:', error);
			setIsDeleteDialogOpen(false);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className='p-6 border-b dark:border-neutral-800'>
				<div className='flex items-center justify-between gap-4'>
					{/* Title */}
					<div className='flex-1'>
						{isEditing ? (
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className='text-lg font-semibold'
								placeholder='Card title'
								autoFocus
								disabled={isSaving}
							/>
						) : (
							<h2 className='text-lg font-semibold truncate'>{title}</h2>
						)}
					</div>

					{/* Action Buttons */}
					<div className='flex items-center gap-2'>
						<Button
							variant='ghost'
							size='sm'
							onClick={onEdit}
							disabled={isSaving}
							className='text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
						>
							<IconPencil className='h-4 w-4' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsDeleteDialogOpen(true)}
							disabled={isDeleting || isSaving}
							className='text-red-500 hover:text-red-700 dark:hover:text-red-400'
						>
							<IconTrash className='h-4 w-4' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={onClose}
							disabled={isDeleting || isSaving}
							className='text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
						>
							<IconX className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Card</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete &quot;{card.title}&quot;? This
							action cannot be undone and all associated data (comments,
							checklists, etc.) will be permanently removed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className='bg-red-500 hover:bg-red-600 text-white'
						>
							{isDeleting ? 'Deleting...' : 'Delete Card'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
