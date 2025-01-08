// components/dashboard/cards/comments.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/hooks/useAuth';
import { IconLoader2 } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';
import { commentApi } from '@/app/api/comment';
import {
	AnyComment,
	OptimisticComment,
	isOptimisticComment,
	BoardComment,
} from '@/app/types/comments';
import { cn } from '@/lib/utils';
import { CommentItem } from './comment-item';

interface CommentsProps {
	cardId: number;
	comments: AnyComment[];
	onUpdate: (comments: AnyComment[]) => void;
	onUpdateComment: (
		commentId: number | string,
		content: string
	) => Promise<void>;
	onDeleteComment: (commentId: number | string) => Promise<void>;
}

export function Comments({
	cardId,
	comments,
	onUpdate,
	onUpdateComment,
	onDeleteComment,
}: CommentsProps) {
	const { user } = useAuth();
	const [newComment, setNewComment] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !user) return;

		const content = newComment.trim();

		// Create optimistic comment
		const optimisticComment: OptimisticComment = {
			id: `temp-${Date.now()}`,
			content,
			card_id: cardId,
			user_id: user.id,
			user,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			optimistic: true,
			type: 'optimistic',
		};

		// Add optimistic comment to parent state
		onUpdate([...comments, optimisticComment]);
		setNewComment('');

		try {
			setIsSubmitting(true);
			const apiComment = await commentApi.createComment(cardId, content);

			// Replace optimistic comment with real one
			const updatedComments = comments.filter(
				(c) => c.id !== optimisticComment.id
			);
			onUpdate([...updatedComments, apiComment] as AnyComment[]);

			toast({
				title: 'Success',
				description: 'Comment added successfully',
			});
		} catch (error) {
			console.error('Failed to create comment:', error);
			// Remove optimistic comment on error
			const updatedComments = comments.filter(
				(c) => c.id !== optimisticComment.id
			);
			onUpdate(updatedComments);
			setNewComment(content); // Restore the content

			toast({
				title: 'Error',
				description: 'Failed to add comment. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-4'>
			{/* Display all comments */}
			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					onUpdate={onUpdateComment}
					onDelete={onDeleteComment}
					isOptimistic={isOptimisticComment(comment)}
				/>
			))}

			{/* Comment form */}
			<form onSubmit={handleSubmit} className='space-y-2'>
				<textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder='Write a comment...'
					className='w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500'
					rows={2}
				/>
				<div className='flex justify-end'>
					<Button
						type='submit'
						disabled={isSubmitting || !newComment.trim()}
						variant='default'
					>
						{isSubmitting ? (
							<>
								<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
								Adding...
							</>
						) : (
							'Add Comment'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
