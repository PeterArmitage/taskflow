import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Trash, Edit } from 'lucide-react';
import { Avatar } from '@/app/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/hooks/useAuth';
import { AnyComment } from '@/app/types/comments';
import { cn } from '@/lib/utils';
import { useWebSocket } from '@/app/hooks/use-websocket';

interface CommentItemProps {
	comment: AnyComment;
	onUpdate: (commentId: number | string, content: string) => Promise<void>;
	onDelete: (commentId: number | string) => Promise<void>;
	isOptimistic?: boolean;
}

export function CommentItem({
	comment,
	onUpdate,
	onDelete,
	isOptimistic,
}: CommentItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { user } = useAuth();

	const { sendMessage } = useWebSocket({
		cardId: comment.card_id,
		onMessage: () => {},
	});

	// Safely handle potentially missing user data
	const commentUser = comment.user || {
		username: 'Unknown User',
		email: '',
		avatar_url: undefined,
	};

	const handleUpdate = async () => {
		if (!editedContent.trim() || editedContent === comment.content) {
			setIsEditing(false);
			return;
		}

		try {
			setIsSubmitting(true);
			await onUpdate(comment.id, editedContent.trim());

			sendMessage({
				type: 'comment',
				action: 'updated',
				cardId: comment.card_id,
				data: {
					...comment,
					content: editedContent.trim(),
					updated_at: new Date().toISOString(),
				},
			});
			setIsEditing(false);
		} catch (error) {
			console.error('Failed to update comment:', error);
			setEditedContent(comment.content);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsSubmitting(true);
			await onDelete(comment.id);

			sendMessage({
				type: 'comment',
				action: 'deleted',
				cardId: comment.card_id,
				data: { id: comment.id, user_id: comment.user_id },
			});
		} catch (error) {
			console.error('Failed to delete comment:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={cn('flex gap-4 group', isOptimistic && 'opacity-70')}
		>
			<Avatar
				src={commentUser.avatar_url}
				fallback={(commentUser.username?.[0] || '?').toUpperCase()}
				className='w-8 h-8 flex-shrink-0'
			/>

			<div className='flex-1 space-y-1'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<span className='font-medium text-sm'>{commentUser.username}</span>
						<span className='text-xs text-neutral-500'>
							{formatDistanceToNow(new Date(comment.created_at), {
								addSuffix: true,
							})}
						</span>
					</div>

					{user?.id === comment.user_id && !isEditing && !isOptimistic && (
						<div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setIsEditing(true)}
								disabled={isSubmitting}
								className='h-6 p-1'
							>
								<Edit className='w-3 h-3' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleDelete}
								disabled={isSubmitting}
								className='h-6 p-1 text-red-500 hover:text-red-600'
							>
								<Trash className='w-3 h-3' />
							</Button>
						</div>
					)}
				</div>

				{isEditing ? (
					<div className='space-y-2'>
						<textarea
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							className='w-full p-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500'
							rows={3}
							disabled={isSubmitting}
						/>
						<div className='flex justify-end gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => {
									setIsEditing(false);
									setEditedContent(comment.content);
								}}
								disabled={isSubmitting}
							>
								<X className='w-4 h-4' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleUpdate}
								disabled={
									isSubmitting ||
									!editedContent.trim() ||
									editedContent === comment.content
								}
							>
								<Check className='w-4 h-4' />
							</Button>
						</div>
					</div>
				) : (
					<div className='bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3'>
						<p className='text-sm whitespace-pre-wrap'>{comment.content}</p>
					</div>
				)}
			</div>
		</motion.div>
	);
}
