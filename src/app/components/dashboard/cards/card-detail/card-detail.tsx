// components/dashboard/cards/card-detail/card-detail.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, Label as CardLabel } from '@/app/types/boards';
import { AnyComment } from '@/app/types/comments';
import { Nullable, toNullable } from '@/app/types/helpers';
import { cn } from '@/lib/utils';
import { useCardData } from '@/app/hooks/useCardData';
import { CardDetailHeader } from './header';
import { CardDetailContent } from './content';
import { CardDetailFooter } from './footer';
import { cardApi } from '@/app/api/card';

interface CardDetailProps {
	card: Card & { comments?: AnyComment[] };
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
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');
	const [dueDate, setDueDate] = useState<Nullable<string>>(() =>
		toNullable(card.due_date)
	);
	const [isSaving, setIsSaving] = useState(false);
	const { toast } = useToast();

	const { labels, comments, isLoading, setComments, refetch } = useCardData(
		card,
		isOpen
	);

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
				labels,
			});

			onUpdate(updatedCard);
			setIsEditing(false);
			await refetch();
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
	}, [card.id, title, description, dueDate, labels, onUpdate, refetch, toast]);

	const handleLabelUpdate = useCallback(
		async (newLabels: CardLabel[]) => {
			if (!isEditing) return;
			try {
				const updatedCard = {
					...card,
					labels: newLabels,
				};
				onUpdate(updatedCard);
			} catch (error) {
				console.error('Failed to update labels:', error);
				toast({
					title: 'Error',
					description: 'Failed to update labels. Please try again.',
					variant: 'destructive',
				});
			}
		},
		[card, isEditing, onUpdate, toast]
	);

	const handleCommentUpdate = useCallback(
		async (commentId: number | string, content: string) => {
			try {
				const numericId =
					typeof commentId === 'string' ? parseInt(commentId) : commentId;
				await cardApi.updateComment(numericId, content);
				await refetch();
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
		},
		[refetch, toast]
	);

	const handleCommentDelete = useCallback(
		async (commentId: number | string) => {
			try {
				const numericId =
					typeof commentId === 'string' ? parseInt(commentId) : commentId;
				await cardApi.deleteComment(numericId);
				await refetch();
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
		},
		[refetch, toast]
	);

	const handleCommentsUpdate = useCallback(
		(updatedComments: AnyComment[]) => {
			setComments(updatedComments);
		},
		[setComments]
	);

	return (
		<Dialog
			open={isOpen && !isLoading}
			onOpenChange={(open) => {
				if (!open && !isSaving && !isLoading) {
					onClose();
				}
			}}
		>
			<DialogContent
				className={cn('max-w-4xl p-0', className)}
				onPointerDownOutside={(e) => e.preventDefault()}
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogTitle className='sr-only'>Card Details</DialogTitle>
				<AnimatePresence mode='wait'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='flex flex-col h-[80vh]'
					>
						<CardDetailHeader
							title={title}
							isEditing={isEditing}
							setTitle={setTitle}
							card={card}
							dueDate={dueDate}
							onEdit={() => setIsEditing(!isEditing)}
							onDelete={onDelete}
						/>

						<CardDetailContent
							card={card}
							labels={labels}
							comments={comments}
							description={description}
							setDescription={setDescription}
							dueDate={dueDate}
							setDueDate={setDueDate}
							isEditing={isEditing}
							onLabelUpdate={handleLabelUpdate}
							onCommentUpdate={handleCommentUpdate}
							onCommentDelete={handleCommentDelete}
							onCommentsUpdate={handleCommentsUpdate}
						/>

						{isEditing && (
							<CardDetailFooter
								isSaving={isSaving}
								onCancel={() => setIsEditing(false)}
								onSave={handleSave}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
