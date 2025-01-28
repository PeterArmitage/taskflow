// components/dashboard/cards/card-detail/card-detail.tsx
import { useState, useCallback, useEffect } from 'react';
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
import { checklistApi } from '@/app/api/checklist';
import { Checklist, UpdateChecklistData } from '@/app/types/checklist';

interface CardDetailProps {
	card: Card & { comments?: AnyComment[] };
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (card: Card) => void;
	onDelete: () => Promise<void>;
	loading?: boolean;
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

	const {
		labels,
		comments,
		checklists,
		isLoading,
		setLabels,
		setComments,
		setChecklists,

		refetch,
	} = useCardData(card, isOpen);
	const handleChecklistUpdate = useCallback(
		async (checklist: Checklist) => {
			try {
				setIsSaving(true);

				// Update the card with the new checklist
				const updatedCard = {
					...card,
					checklists: card.checklists
						? card.checklists.map((c) =>
								c.id === checklist.id ? checklist : c
							)
						: [checklist],
				};

				// Update parent state
				await onUpdate(updatedCard);

				// Refresh local data
				if (refetch) {
					await refetch();
				}
			} catch (error) {
				console.error('Failed to update checklist:', error);
				toast({
					title: 'Error',
					description: 'Failed to update checklist',
					variant: 'destructive',
				});
			} finally {
				setIsSaving(false);
			}
		},
		[card, onUpdate, toast, refetch]
	);

	const handleChecklistDelete = useCallback(
		async (checklistId: number) => {
			try {
				setIsSaving(true);
				await checklistApi.deleteChecklist(checklistId);

				const updatedCard = {
					...card,
					checklists:
						card.checklists?.filter(
							(checklist) => checklist.id !== checklistId
						) || [],
				};

				onUpdate(updatedCard);
				toast({
					title: 'Success',
					description: 'Checklist deleted successfully',
				});
			} catch (error) {
				console.error('Failed to delete checklist:', error);
				toast({
					title: 'Error',
					description: 'Failed to delete checklist',
					variant: 'destructive',
				});
			} finally {
				setIsSaving(false);
			}
		},
		[card, onUpdate, toast]
	);

	const handleSave = useCallback(async () => {
		if (!title.trim()) return;

		try {
			setIsSaving(true);
			const updatedCard = await cardApi.updateCard(card.id, {
				title: title.trim(),
				description: description.trim() || undefined,
				due_date: dueDate,
				labels,
				checklists,
			});

			// First update the parent
			await onUpdate(updatedCard);

			// Then refresh our local data
			await refetch();
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
	}, [
		card.id,
		title,
		description,
		dueDate,
		labels,
		checklists,
		onUpdate,
		refetch,
		toast,
	]);

	// Add this effect to keep local state in sync
	useEffect(() => {
		if (isOpen) {
			refetch();
		}
	}, [isOpen, refetch]);

	const handleLabelUpdate = useCallback(
		async (newLabels: CardLabel[]) => {
			try {
				setIsSaving(true);

				// First update card with new labels
				const updatedCard = await cardApi.updateCard(card.id, {
					...card,
					labels: newLabels,
				});

				// Update local state
				setLabels(newLabels);

				// Notify parent of update
				await onUpdate(updatedCard);

				// Refresh data to ensure everything is in sync
				await refetch();
			} catch (error) {
				console.error('Failed to update labels:', error);
				toast({
					title: 'Error',
					description: 'Failed to update labels. Please try again.',
					variant: 'destructive',
				});
			} finally {
				setIsSaving(false);
			}
		},
		[card, setLabels, onUpdate, refetch, toast]
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
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
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
							onChecklistUpdate={handleChecklistUpdate}
							onChecklistDelete={handleChecklistDelete}
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
