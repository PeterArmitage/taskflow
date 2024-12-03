import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Label as CardLabel, Comment } from '@/app/types/boards';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	IconCalendar,
	IconTag,
	IconMessageCircle,
	IconClock,
	IconTrash,
	IconLoader2,
	IconEdit,
	IconPaperclip,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Editor } from './editor';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { cardApi } from '@/app/api/card';
import { useToast } from '@/hooks/use-toast';
import { LabelManager } from './label-manager';
import { Comments } from './comments';
import { Nullable, toNullable, DateHelper } from '@/app/types/helpers';
import { cn } from '@/lib/utils';

// Type definitions for better type safety
interface CardUpdate {
	title?: string;
	description?: string;
	due_date?: Nullable<string>;
	labels?: CardLabel[];
	comments?: Comment[];
}

interface CardDetailProps {
	card: Card;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (card: Card) => void;
	onDelete: () => Promise<void>;
	className?: string;
}

export function CardDetail({
	card,
	isOpen,
	onClose,
	onUpdate,
	onDelete,
	className,
}: CardDetailProps) {
	// Enhanced state management with proper typing
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');
	const [dueDate, setDueDate] = useState<Nullable<string>>(() =>
		toNullable(card.due_date)
	);
	const [isSaving, setIsSaving] = useState(false);
	const { toast } = useToast();

	const updateCard = (card: Card, updates: Partial<CardUpdate>): Card => {
		return {
			...card,
			...updates,
			// Ensure we handle undefined values correctly
			due_date:
				updates.due_date === undefined ? card.due_date : updates.due_date,
			labels: updates.labels === undefined ? card.labels : updates.labels,
			comments:
				updates.comments === undefined ? card.comments : updates.comments,
		};
	};
	// Handlers with proper error management
	const handleSave = useCallback(async () => {
		if (!title.trim()) {
			toast({
				title: 'Error',
				description: 'Title cannot be empty',
				variant: 'destructive',
			});
			return;
		}

		try {
			setIsSaving(true);
			const updateData: CardUpdate = {
				title: title.trim(),
				description: description.trim() || undefined,
				due_date: dueDate,
			};

			const updatedCard = await cardApi.updateCard(card.id, updateData);
			onUpdate(updatedCard);

			setIsEditing(false);
			toast({
				title: 'Success',
				description: 'Card updated successfully',
			});
		} catch (error) {
			console.error('Failed to update card:', error);
			toast({
				title: 'Error',
				description: 'Failed to update card. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	}, [card.id, title, description, dueDate, onUpdate, toast]);

	const handleDeleteClick = async () => {
		if (!window.confirm('Are you sure you want to delete this card?')) return;

		try {
			setIsSaving(true);
			await onDelete();
			onClose();
			toast({
				title: 'Success',
				description: 'Card deleted successfully',
			});
		} catch (error) {
			console.error('Failed to delete card:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete card. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={cn('max-w-4xl p-0', className)}>
				<AnimatePresence mode='wait'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='flex flex-col h-[80vh]'
					>
						{/* Enhanced Card Header */}
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
											Created{' '}
											{DateHelper.toDate(card.created_at)?.toLocaleDateString()}
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
									<Button
										variant='ghost'
										size='sm'
										onClick={() => setIsEditing(!isEditing)}
									>
										<IconEdit className='w-4 h-4' />
									</Button>
									<Button
										variant='ghost'
										size='sm'
										onClick={handleDeleteClick}
										className='text-red-500 hover:text-red-600'
									>
										<IconTrash className='w-4 h-4' />
									</Button>
								</div>
							</div>
						</div>

						{/* Enhanced Tab Content */}
						<div className='flex-1 overflow-y-auto'>
							<Tabs defaultValue='details' className='w-full h-full'>
								<TabsList className='w-full justify-start border-b dark:border-neutral-800 rounded-none'>
									<TabsTrigger value='details'>Details</TabsTrigger>
									<TabsTrigger value='activity'>Activity</TabsTrigger>
								</TabsList>

								<TabsContent value='details' className='p-6 space-y-6'>
									{/* Description Section */}
									<div className='space-y-3'>
										<Label>Description</Label>
										<Editor
											content={description}
											onChange={setDescription}
											placeholder='Add a more detailed description...'
											readOnly={!isEditing}
										/>
									</div>

									{/* Due Date Section */}
									<div className='space-y-3'>
										<Label className='flex items-center gap-2'>
											<IconCalendar className='w-4 h-4' />
											Due Date
										</Label>
										<DatePicker
											value={dueDate}
											onChange={setDueDate}
											disabled={!isEditing}
											className='w-full'
										/>
									</div>

									{/* Labels Section */}
									<div className='space-y-3'>
										<Label className='flex items-center gap-2'>
											<IconTag className='w-4 h-4' />
											Labels
										</Label>
										<LabelManager
											cardId={card.id}
											labels={card.labels || []}
											onUpdate={(labels) => {
												onUpdate(updateCard(card, { labels }));
											}}
											disabled={!isEditing}
										/>
									</div>

									{/* Attachments Section */}
									{card.attachments_count > 0 && (
										<div className='space-y-3'>
											<Label className='flex items-center gap-2'>
												<IconPaperclip className='w-4 h-4' />
												Attachments ({card.attachments_count})
											</Label>
											{/* Attachment list component would go here */}
										</div>
									)}

									{/* Comments Section */}
									<div className='space-y-3'>
										<Label className='flex items-center gap-2'>
											<IconMessageCircle className='w-4 h-4' />
											Comments
										</Label>
										<Comments
											cardId={card.id}
											comments={card.comments || []}
											onUpdate={(comments) => {
												onUpdate(updateCard(card, { comments }));
											}}
										/>
									</div>
								</TabsContent>

								<TabsContent value='activity' className='p-6'>
									<div className='text-neutral-500'>
										Activity log coming soon...
									</div>
								</TabsContent>
							</Tabs>
						</div>

						{/* Footer Actions */}
						{isEditing && (
							<div className='border-t dark:border-neutral-800 p-4'>
								<div className='flex justify-end gap-2'>
									<Button variant='outline' onClick={() => setIsEditing(false)}>
										Cancel
									</Button>
									<Button
										variant='default'
										onClick={handleSave}
										disabled={isSaving}
									>
										{isSaving ? (
											<>
												<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
												Saving...
											</>
										) : (
											'Save Changes'
										)}
									</Button>
								</div>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
