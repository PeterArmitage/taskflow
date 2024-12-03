'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/app/components/ui/avatar';
import { Comment } from '@/app/types/boards';
import { useAuth } from '@/app/hooks/useAuth';
import { IconLoader2, IconTrash, IconEdit } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
	comment: Comment;
	onDelete: () => Promise<void>;
	onUpdate: (content: string) => Promise<void>;
}

// Individual comment component
const CommentItem = ({ comment, onDelete, onUpdate }: CommentItemProps) => {
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(comment.content);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async () => {
		if (!content.trim() || content === comment.content) {
			setIsEditing(false);
			return;
		}

		try {
			setIsLoading(true);
			await onUpdate(content);
			setIsEditing(false);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className='flex gap-3 group'
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
								className='w-full p-2 text-sm rounded border border-neutral-200 dark:border-neutral-700'
								rows={2}
							/>
							<div className='flex justify-end gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => {
										setIsEditing(false);
										setContent(comment.content);
									}}
								>
									Cancel
								</Button>
								<Button size='sm' onClick={handleUpdate} disabled={isLoading}>
									{isLoading ? (
										<IconLoader2 className='w-4 h-4 animate-spin' />
									) : (
										'Save'
									)}
								</Button>
							</div>
						</div>
					) : (
						<p className='text-sm whitespace-pre-wrap'>{comment.content}</p>
					)}
				</div>

				{user?.id === comment.user_id && !isEditing && (
					<div className='flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity'>
						<button
							onClick={() => setIsEditing(true)}
							className='text-xs text-neutral-500 hover:text-neutral-700'
						>
							<IconEdit className='w-4 h-4' />
						</button>
						<button
							onClick={onDelete}
							className='text-xs text-red-500 hover:text-red-700'
						>
							<IconTrash className='w-4 h-4' />
						</button>
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !user) return;

		try {
			setIsSubmitting(true);

			// Create temporary comment while waiting for API
			const tempComment: Comment = {
				id: Math.random(), // Temporary ID
				content: newComment.trim(),
				card_id: cardId,
				user_id: user.id,
				user: user,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			onUpdate([...comments, tempComment]);
			setNewComment('');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-4'>
			{/* Comment List */}
			<AnimatePresence>
				<div className='space-y-4'>
					{comments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							onDelete={async () => {
								onUpdate(comments.filter((c) => c.id !== comment.id));
							}}
							onUpdate={async (content) => {
								onUpdate(
									comments.map((c) =>
										c.id === comment.id
											? { ...c, content, updated_at: new Date().toISOString() }
											: c
									)
								);
							}}
						/>
					))}
				</div>
			</AnimatePresence>

			{/* New Comment Form */}
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
							<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
						) : (
							'Add Comment'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
