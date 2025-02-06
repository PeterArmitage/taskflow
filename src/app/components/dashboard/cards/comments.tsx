// components/dashboard/cards/comments.tsx
'use client';

import { useRef, useState } from 'react';
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
import { useWebSocket } from '@/app/hooks/use-websocket';
import { motion } from 'framer-motion';
import {
	DeleteData,
	isCommentData,
	isDeleteData,
	isTypingData,
} from '@/app/types/websocket';

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
	const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
	const typingTimeoutRef = useRef<NodeJS.Timeout>();

	const { sendMessage } = useWebSocket({
		cardId,
		onMessage: (message) => {
			if (message.type === 'comment') {
				switch (message.action) {
					case 'created':
						if (
							isCommentData(message.data) &&
							message.data.user_id !== user?.id
						) {
							onUpdate([...comments, message.data as AnyComment]);
						}
						break;
					case 'updated':
						if (
							isCommentData(message.data) &&
							message.data.user_id !== user?.id
						) {
							const updatedComments = comments.map((comment) =>
								comment.id === (message.data as AnyComment).id
									? (message.data as AnyComment)
									: comment
							);
							onUpdate(updatedComments);
						}
						break;
					case 'deleted':
						if (
							isDeleteData(message.data) &&
							message.data.user_id !== user?.id
						) {
							const filteredComments = comments.filter(
								(comment) => comment.id !== (message.data as DeleteData).id
							);
							onUpdate(filteredComments);
						}
						break;
					case 'typing':
						if (
							isTypingData(message.data) &&
							message.data.user_id !== user?.id
						) {
							setTypingUsers((prev) => {
								const newSet = new Set(prev);
								newSet.add(message.data.user_id);
								return newSet;
							});
						}
						break;
					case 'typing_stop':
						if (isTypingData(message.data)) {
							setTypingUsers((prev) => {
								const newSet = new Set(prev);
								newSet.delete(message.data.user_id);
								return newSet;
							});
						}
						break;
				}
			}
		},
	});

	const handleTyping = () => {
		if (!user) return;

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		sendMessage({
			type: 'comment',
			action: 'typing',
			cardId,
			data: { user_id: user.id, username: user.username },
		});

		typingTimeoutRef.current = setTimeout(() => {
			sendMessage({
				type: 'comment',
				action: 'typing_stop',
				cardId,
				data: { user_id: user.id },
			});
		}, 2000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || isSubmitting) return;

		setIsSubmitting(true);
		const optimisticId = `temp-${Date.now()}`;
		const optimisticComment: OptimisticComment = {
			id: optimisticId,
			content: newComment,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			type: 'optimistic',
			optimistic: true,
			card_id: cardId,
			user_id: user?.id || 0,
			user: user || {
				id: 0,
				username: 'Unknown User',
				email: '',
				created_at: new Date().toISOString(),
				avatar_url: undefined,
			},
		};

		try {
			// Add optimistic comment
			const updatedComments = [...comments, optimisticComment];
			onUpdate(updatedComments);

			// Create actual comment
			const createdComment = await commentApi.createComment(cardId, newComment);

			// Notify other users
			sendMessage({
				type: 'comment',
				action: 'created',
				cardId,
				data: createdComment,
			});
			const boardComment: BoardComment = {
				...createdComment,
				type: 'board' as const,
				user: createdComment.user
					? {
							...createdComment.user,
							avatar_url: createdComment.user.avatar_url || undefined,
							created_at: createdComment.created_at,
							updated_at: createdComment.updated_at,
						}
					: {
							id: 0,
							username: 'Unknown User',
							email: '',
							created_at: createdComment.created_at,
							avatar_url: undefined,
						},
			};

			// Replace optimistic comment with actual comment
			const finalComments = comments.map((comment) =>
				comment.id === optimisticId ? boardComment : comment
			);
			onUpdate(finalComments);

			setNewComment('');
			toast({
				title: 'Success',
				description: 'Comment added successfully',
			});
		} catch (error) {
			console.error('Failed to add comment:', error);
			// Remove optimistic comment on error
			const revertedComments = comments.filter(
				(comment) => comment.id !== optimisticId
			);
			onUpdate(revertedComments);
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
					onChange={(e) => {
						setNewComment(e.target.value);
						handleTyping();
					}}
					placeholder='Write a comment...'
					className='w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500'
					rows={2}
				/>

				{typingUsers.size > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className='text-sm text-neutral-500 italic'
					>
						{Array.from(typingUsers).join(', ')} typing...
					</motion.div>
				)}

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
