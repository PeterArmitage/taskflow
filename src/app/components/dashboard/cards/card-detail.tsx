// components/dashboard/cards/card-detail.tsx
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Label as CardLabel } from '@/app/types/boards';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { Label } from '@/components/ui/label';
import { cardApi } from '@/app/api/card';
import { useToast } from '@/hooks/use-toast';
import { LabelManager } from './label-manager';
import { Comments } from './comments';
import {
	AnyComment,
	BoardComment,
	OptimisticComment,
	isOptimisticComment,
} from '@/app/types/comments';
import { Nullable, toNullable, DateHelper } from '@/app/types/helpers';
import { cn } from '@/lib/utils';
import { commentApi } from '@/app/api/comment';

// Interface for handling card updates
interface CardUpdate {
	title?: string;
	description?: string;
	due_date?: Nullable<string>;
	labels?: CardLabel[];
	comments?: AnyComment[];
}

// Props interface with refined typing
interface CardDetailProps {
	card: Card & { comments: AnyComment[] };
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
	// Add debug logging
	console.log('Card data:', card);
	console.log('Card comments:', card.comments);

	// Local state management
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');
	const [dueDate, setDueDate] = useState<Nullable<string>>(() =>
		toNullable(card.due_date)
	);
	const [isSaving, setIsSaving] = useState(false);
	const { toast } = useToast();

	// Add state for comments
	const [comments, setComments] = useState<AnyComment[]>(card.comments || []);

	// Fetch comments when card is opened
	useEffect(() => {
		if (isOpen) {
			const fetchComments = async () => {
				try {
					const fetchedComments = await commentApi.getComments(card.id);
					const boardComments = fetchedComments.map((comment) => ({
						...comment,
						type: 'board' as const,
						user: comment.user
							? {
									...comment.user,
									avatar_url: comment.user.avatar_url || undefined,
									created_at: comment.created_at,
									updated_at: comment.updated_at,
								}
							: {
									id: 0,
									username: 'Unknown User',
									email: '',
									created_at: comment.created_at,
									avatar_url: undefined,
								},
					})) as BoardComment[];
					setComments(boardComments);
				} catch (error) {
					console.error('Failed to fetch comments:', error);
					toast({
						title: 'Error',
						description: 'Failed to load comments. Please try again.',
						variant: 'destructive',
					});
				}
			};
			fetchComments();
		}
	}, [card.id, isOpen, toast]);

	// Combine board comments for display
	const allComments: AnyComment[] = comments;

	// Helper function to update card while preserving types
	const updateCard = useCallback(
		(updates: Partial<CardUpdate>): Card => {
			const updatedCard = {
				...card,
				...updates,
				due_date:
					updates.due_date === undefined ? card.due_date : updates.due_date,
				labels: updates.labels === undefined ? card.labels : updates.labels,
				comments: updates.comments === undefined ? comments : updates.comments,
			};

			// Ensure all comments have the correct type
			if (updatedCard.comments) {
				updatedCard.comments = updatedCard.comments.map((comment) => {
					if (isOptimisticComment(comment)) return comment;
					return {
						...comment,
						type: 'board' as const,
						user: {
							...comment.user,
							avatar_url: comment.user.avatar_url || undefined,
						},
					} as BoardComment;
				});
			}

			return updatedCard;
		},
		[card, comments]
	);

	const handleCommentAdd = async (comment: AnyComment) => {
		try {
			setComments((prevComments) => [...prevComments, comment]);
			onUpdate(updateCard({ comments: [...comments, comment] }));
		} catch (error) {
			console.error('Failed to add comment:', error);
			toast({
				title: 'Error',
				description: 'Failed to add comment. Please try again.',
				variant: 'destructive',
			});
		}
	};

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

	// Card update handler
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
			const updatedCard = await cardApi.updateCard(card.id, {
				title: title.trim(),
				description: description.trim() || undefined,
				due_date: dueDate,
			});
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

	// Comment handlers
	const handleCommentUpdate = async (
		commentId: number | string,
		content: string
	) => {
		try {
			const numericId =
				typeof commentId === 'string' ? parseInt(commentId) : commentId;
			const updatedComment = await commentApi.updateComment(numericId, content);

			setComments((prevComments) =>
				prevComments.map((comment) =>
					comment.id === commentId
						? {
								...updatedComment,
								type: 'board' as const,
								user: {
									...updatedComment.user,
									avatar_url: updatedComment.user.avatar_url || undefined,
								},
							}
						: comment
				)
			);

			toast({
				title: 'Success',
				description: 'Comment updated successfully',
			});
		} catch (error) {
			console.error('Failed to update comment:', error);
			toast({
				title: 'Error',
				description: 'Failed to update comment. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleCommentDelete = async (commentId: number | string) => {
		try {
			const numericId =
				typeof commentId === 'string' ? parseInt(commentId) : commentId;
			await commentApi.deleteComment(numericId);

			setComments((prevComments) =>
				prevComments.filter((comment) => comment.id !== commentId)
			);

			toast({
				title: 'Success',
				description: 'Comment deleted successfully',
			});
		} catch (error) {
			console.error('Failed to delete comment:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete comment. Please try again.',
				variant: 'destructive',
			});
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={cn('max-w-4xl p-0', className)}>
				<DialogHeader>
					<DialogTitle className='sr-only'>{card.title}</DialogTitle>
				</DialogHeader>

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
										<CustomDatePicker
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
												onUpdate(updateCard({ labels }));
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
											Comments ({allComments.length})
										</Label>
										<Comments
											cardId={card.id}
											comments={allComments}
											onUpdate={(updatedComments) => {
												onUpdate(updateCard({ comments: updatedComments }));
											}}
											onUpdateComment={handleCommentUpdate}
											onDeleteComment={handleCommentDelete}
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
