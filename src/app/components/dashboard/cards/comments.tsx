import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/app/components/ui/avatar';
import {
	IconLoader2,
	IconTrash,
	IconEdit,
	IconCheck,
	IconX,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Comment, OptimisticComment } from '@/app/types/comments';
import { useAuth } from '@/app/hooks/useAuth';
import { commentApi } from '@/app/api/comments';
import { useToast } from '@/hooks/use-toast';
import { CommentUser } from '@/app/types/user';

interface CommentsProps {
	cardId: number;
	comments: Comment[];
	onUpdate: (comments: Comment[]) => void;
}

interface CommentItemProps {
	comment: Comment | OptimisticComment;
	onDelete: (id: number | string) => Promise<void>;
	onUpdate: (id: number | string, content: string) => Promise<void>;
	isOptimistic?: boolean;
}

const CommentItem = ({
	comment,
	onDelete,
	onUpdate,
	isOptimistic,
}: CommentItemProps) => {
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(comment.content);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleUpdate = async () => {
		if (!content.trim() || content === comment.content) {
			setIsEditing(false);
			return;
		}

		try {
			setIsLoading(true);
			await onUpdate(comment.id, content.trim());
			setIsEditing(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update comment. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true);
			await onDelete(comment.id);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete comment. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`flex gap-3 group ${isOptimistic ? 'opacity-70' : ''}`}
		>
			<Avatar
				src={comment.user.avatar_url}
				fallback={comment.user.username[0].toUpperCase()}
				className='w-8 h-8 flex-shrink-0'
			/>

			<div className='flex-1'>
				<div className='bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3'>
					<div className='flex items-center justify-between mb-1'>
						<span className='font-medium text-sm'>{comment.user.username}</span>
						<span className='text-xs text-neutral-500'>
							{formatDistanceToNow(new Date(comment.created_at), {
								addSuffix: true,
							})}
						</span>
					</div>

					{isEditing ? (
						<div className='space-y-2'>
							<textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								className='w-full p-2 text-sm rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
								rows={2}
								disabled={isLoading}
							/>
							<div className='flex justify-end gap-2'>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => {
										setIsEditing(false);
										setContent(comment.content);
									}}
									disabled={isLoading}
								>
									<IconX className='w-4 h-4' />
								</Button>
								<Button
									variant='ghost'
									size='sm'
									onClick={handleUpdate}
									disabled={
										isLoading || !content.trim() || content === comment.content
									}
								>
									{isLoading ? (
										<IconLoader2 className='w-4 h-4 animate-spin' />
									) : (
										<IconCheck className='w-4 h-4' />
									)}
								</Button>
							</div>
						</div>
					) : (
						<p className='text-sm whitespace-pre-wrap'>{comment.content}</p>
					)}
				</div>

				{user?.id === comment.user_id && !isEditing && !isOptimistic && (
					<div className='flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsEditing(true)}
							className='h-6 p-1'
						>
							<IconEdit className='w-3 h-3' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={handleDelete}
							className='h-6 p-1 text-red-500 hover:text-red-600'
						>
							<IconTrash className='w-3 h-3' />
						</Button>
					</div>
				)}
			</div>
		</motion.div>
	);
};

interface CommentsProps {
	cardId: number;
	comments: Comment[];
	onUpdate: (comments: Comment[]) => void;
}

export function Comments({ cardId, comments, onUpdate }: CommentsProps) {
	const { user } = useAuth();
	const [newComment, setNewComment] = useState('');
	const [optimisticComments, setOptimisticComments] = useState<
		OptimisticComment[]
	>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	// Enhanced addOptimisticComment with proper type conversion
	const addOptimisticComment = useCallback(
		(content: string) => {
			if (!user) return;

			// Create a properly typed comment user
			const commentUser: CommentUser = {
				id: user.id,
				username: user.username,
				email: user.email,
				avatar_url: user.avatar_url,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			const optimisticComment: OptimisticComment = {
				id: `temp-${Date.now()}`,
				content: content.trim(),
				card_id: cardId,
				user_id: user.id,
				user: commentUser,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				optimistic: true,
			};

			setOptimisticComments((prev) => [...prev, optimisticComment]);
		},
		[user, cardId]
	);
	const removeOptimisticComment = useCallback((id: string) => {
		setOptimisticComments((prev) =>
			prev.filter((comment) => comment.id !== id)
		);
	}, []);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !user) return;

		const content = newComment.trim();
		const tempId = `temp-${Date.now()}`;
		addOptimisticComment(content);
		setNewComment('');

		try {
			setIsSubmitting(true);
			const apiComment = await commentApi.createComment(cardId, content);
			console.log('Received API comment:', apiComment);

			// Create a proper comment object with the required user data
			const fullComment: Comment = {
				...apiComment,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					avatar_url: user.avatar_url,
					created_at: apiComment.created_at,
					updated_at: apiComment.created_at, // Use created_at as initial updated_at
				},
				updated_at: apiComment.created_at, // Use created_at as initial updated_at
			};

			// Update with the new comment
			onUpdate([...comments, fullComment]);
			removeOptimisticComment(tempId);
		} catch (error) {
			console.error('Failed to create comment:', error);
			toast({
				title: 'Error',
				description: 'Failed to add comment. Please try again.',
				variant: 'destructive',
			});
			removeOptimisticComment(tempId);
			setNewComment(content);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdate = async (commentId: number | string, content: string) => {
		if (typeof commentId === 'string') return;

		try {
			const updatedComment = await commentApi.updateComment(commentId, content);
			onUpdate(comments.map((c) => (c.id === commentId ? updatedComment : c)));
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update comment. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleDelete = async (commentId: number | string) => {
		try {
			if (typeof commentId === 'string') {
				removeOptimisticComment(commentId);
				return;
			}

			await commentApi.deleteComment(commentId);
			onUpdate(comments.filter((c) => c.id !== commentId));
			toast({
				title: 'Success',
				description: 'Comment deleted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete comment. Please try again.',
				variant: 'destructive',
			});
		}
	};

	useEffect(() => {
		console.log('Current comments:', comments);
		console.log('Optimistic comments:', optimisticComments);
	}, [comments, optimisticComments]);
	return (
		<div className='space-y-4'>
			<AnimatePresence mode='popLayout'>
				{[...comments, ...optimisticComments].map((comment) => (
					<CommentItem
						key={comment.id}
						comment={comment}
						onDelete={handleDelete}
						onUpdate={handleUpdate}
						isOptimistic={'optimistic' in comment}
					/>
				))}
			</AnimatePresence>

			<form onSubmit={handleSubmit} className='space-y-2'>
				<textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder='Write a comment...'
					className='w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500'
					rows={2}
				/>
				<div className='flex justify-end'>
					<Button type='submit' disabled={isSubmitting || !newComment.trim()}>
						{isSubmitting ? (
							<>
								<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
								Posting...
							</>
						) : (
							'Post Comment'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
