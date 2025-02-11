// components/dashboard/boards/board-list.tsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext } from '@dnd-kit/sortable';
import { List, Card } from '@/app/types/boards';
import { CardItem } from './card-item';
import { CreateCardForm } from './create-card-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconPlus,
	IconDotsVertical,
	IconPencil,
	IconTrash,
} from '@tabler/icons-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	AlertDialogHeader,
	AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogDescription,
} from '@radix-ui/react-alert-dialog';
import { Input } from '@/components/ui/input';

interface BoardListProps {
	list: List;
	onUpdate: () => void;
	onCardSelect?: (card: Card) => void;
	onListDelete?: (listId: number) => void;
	onListEdit?: (listId: number, newTitle: string) => void;
	isActive?: boolean;
	className?: string;
	isSelected?: boolean;
	selectedCardId?: string | null;
	onCardFocus?: (cardId: string | null) => void;
	onListFocus?: (listId: string | null) => void;
	renderCard: (card: Card) => React.ReactNode;
}

interface EditTitleDialogProps {
	isOpen: boolean;
	title: string;
	onClose: () => void;
	onConfirm: (newTitle: string) => void;
}

const EditTitleDialog = ({
	isOpen,
	title,
	onClose,
	onConfirm,
}: EditTitleDialogProps) => {
	const [newTitle, setNewTitle] = useState(title);
	const formRef = useRef<HTMLFormElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Reset state and focus when dialog opens
	useEffect(() => {
		if (isOpen) {
			setNewTitle(title);
			// Focus input after dialog opens
			requestAnimationFrame(() => {
				inputRef.current?.focus();
			});
		}
	}, [isOpen, title]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (newTitle && newTitle.trim() !== '') {
			onConfirm(newTitle.trim());
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent asChild>
				<form onSubmit={handleSubmit} ref={formRef}>
					<AlertDialogHeader>
						<AlertDialogTitle>Edit List Title</AlertDialogTitle>
						<AlertDialogDescription>
							Enter a new title for this list.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className='mt-4'>
						<Input
							ref={inputRef}
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							placeholder='Enter new title'
							className='w-full'
							aria-label='New list title'
						/>
					</div>

					<AlertDialogFooter>
						<AlertDialogCancel type='button' onClick={onClose}>
							Cancel
						</AlertDialogCancel>
						<Button type='submit' variant='default'>
							Save Changes
						</Button>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export function BoardList({
	list,
	onUpdate,
	onCardSelect,
	onListDelete,
	onListEdit,
	isActive = false,
	className,
	renderCard,
}: BoardListProps) {
	const [showCreateCard, setShowCreateCard] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const menuTriggerRef = useRef<HTMLButtonElement>(null);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: list.id.toString(),
		data: {
			type: 'list',
			list,
		},
	});

	const handleDelete = async () => {
		try {
			console.log('BoardList handleDelete - Starting delete:', list.id);
			await onListDelete?.(list.id);
			console.log('BoardList handleDelete - Delete successful');
			setShowDeleteDialog(false);
			// Force refresh
			onUpdate();
		} catch (error) {
			console.error('BoardList handleDelete - Failed:', error);
		}
	};

	const handleEdit = async (newTitle: string) => {
		try {
			console.log('BoardList handleEdit - Starting edit:', {
				listId: list.id,
				newTitle,
			});
			if (newTitle && newTitle.trim() !== '') {
				await onListEdit?.(list.id, newTitle.trim());
				console.log('BoardList handleEdit - Edit successful');
				setShowEditDialog(false);

				onUpdate();
			}
		} catch (error) {
			console.error('BoardList handleEdit - Failed:', error);
		}
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleCardClick = useCallback(
		(card: Card) => {
			if (typeof onCardSelect === 'function') {
				onCardSelect(card);
			}
		},
		[onCardSelect]
	);

	const handleCreateCard = async (data: {
		title: string;
		description?: string;
	}) => {
		try {
			onUpdate();
		} catch (error) {
			console.error('Failed to create card:', error);
		}
	};

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -50 }}
			className={cn(
				'w-80 flex-shrink-0 flex flex-col',
				'bg-neutral-50 dark:bg-neutral-800/50',
				'rounded-lg border border-neutral-200 dark:border-neutral-700',
				isActive && 'ring-2 ring-blue-500',
				isDragging && 'opacity-50',
				className
			)}
			{...attributes}
		>
			<div
				className='p-3 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700'
				{...listeners}
				tabIndex={0}
			>
				<h3 className='font-medium text-neutral-900 dark:text-neutral-100'>
					{list.title}
				</h3>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							ref={menuTriggerRef}
							variant='ghost'
							size='sm'
							aria-label='List options'
						>
							<IconDotsVertical className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side='bottom' align='end'>
						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault();
								setShowEditDialog(true);
							}}
						>
							<IconPencil className='h-4 w-4 mr-2' />
							Edit Title
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault();
								setShowDeleteDialog(true);
							}}
							className='text-red-600'
						>
							<IconTrash className='h-4 w-4 mr-2' />
							Delete List
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{/* Edit Dialog */}
			<EditTitleDialog
				isOpen={showEditDialog}
				title={list.title}
				onClose={() => {
					setShowEditDialog(false);
					menuTriggerRef.current?.focus();
				}}
				onConfirm={handleEdit}
			/>

			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={(open) => {
					setShowDeleteDialog(open);
					if (!open) menuTriggerRef.current?.focus();
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete List</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete &rdquo;{list.title}&rdquo;? All
							cards in this list will also be deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild>
							<Button variant='outline'>Cancel</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button variant='destructive' onClick={handleDelete}>
								Delete
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className='flex-1 overflow-y-auto p-3 space-y-2'>
				<SortableContext
					items={list.cards?.map((card) => card.id.toString()) || []}
				>
					<AnimatePresence mode='popLayout'>
						{list.cards?.map((card) => (
							<CardItem
								key={card.id}
								card={card}
								listId={list.id}
								onClick={() => handleCardClick(card)}
								isDragging={isDragging}
								labels={card.labels}
							/>
						))}
					</AnimatePresence>
				</SortableContext>

				<AnimatePresence mode='wait'>
					{showCreateCard ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
						>
							<CreateCardForm
								listId={list.id}
								onCancel={() => setShowCreateCard(false)}
								onSuccess={() => {
									setShowCreateCard(false);
									onUpdate();
								}}
								onCreate={handleCreateCard}
							/>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<Button
								variant='ghost'
								size='sm'
								className='w-full justify-start text-neutral-600 dark:text-neutral-400'
								onClick={() => setShowCreateCard(true)}
							>
								<IconPlus className='h-4 w-4 mr-2' />
								Add a card
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className='p-2 border-t border-neutral-200 dark:border-neutral-700'>
				<p className='text-xs text-neutral-500 dark:text-neutral-400 text-center'>
					{list.cards?.length || 0} cards
				</p>
			</div>
		</motion.div>
	);
}
