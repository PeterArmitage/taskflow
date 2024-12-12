import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/app/types/boards';
import { WebSocketMessage } from '@/app/types/websocket';
import { BoardActivity } from '@/app/types/boards';
import { Comment } from '@/app/types/comments';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
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
import { useAuth } from '@/app/hooks/useAuth';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { Editor, EditorRef } from './editor';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LabelManager } from './label-manager';
import { Comments } from './comments';
import { Nullable, toNullable, DateHelper } from '@/app/types/helpers';
import { cn } from '@/lib/utils';
import { ActivityFeed } from './activity-feed';
import { cardApi } from '@/app/api/card';
import {
	adaptBoardComment,
	adaptBoardActivity,
} from '@/app/utils/type-adapters';
import { BaseActivity } from '@/app/types/activity';

interface CardUpdate {
	title?: string;
	description?: string;
	due_date?: Nullable<string>;
	labels?: Array<{
		id: number;
		name: string;
		color: string;
		card_id: number;
	}>;
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
	const [activeTab, setActiveTab] = useState('details');
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || '');
	const [dueDate, setDueDate] = useState<Nullable<string>>(() =>
		toNullable(card.due_date)
	);
	const [isSaving, setIsSaving] = useState(false);
	const { user } = useAuth();
	const { toast } = useToast();
	const editorRef = useRef<EditorRef>(null);

	const handleWebSocketMessage = useCallback(
		(message: WebSocketMessage) => {
			if (!message || !card) return;

			switch (message.type) {
				case 'comment': {
					const updatedComments =
						message.action === 'deleted'
							? (card.comments || []).filter(
									(c) => c.id !== (message.data as Comment).id
								)
							: [
									...(card.comments || []),
									adaptBoardComment(message.data as Comment),
								];

					onUpdate({
						...card,
						comments: updatedComments,
					});
					break;
				}

				case 'activity': {
					// Explicitly cast the activity data and ensure type safety
					const activityData = adaptBoardActivity(
						message.data as BoardActivity
					);
					const updatedActivities = [
						...(card.activities || []),
						activityData as BaseActivity, // Explicitly cast to the base activity type
					];

					onUpdate({
						...card,
						activities: updatedActivities,
					});
					break;
				}
			}
		},
		[card, onUpdate]
	);

	const { isConnected } = useWebSocket({
		cardId: card.id,
		token: user?.token || '',
		onMessage: handleWebSocketMessage,
	});

	// const handleCommentUpdate = useCallback(
	// 	(message: WebSocketMessage) => {
	// 		if (message.type !== 'comment') return;

	// 		onUpdate({
	// 			...card,
	// 			comments:
	// 				message.action === 'deleted'
	// 					? (card.comments || []).filter(
	// 							(c) => c.id !== (message.data as Comment).id
	// 						)
	// 					: message.action === 'updated'
	// 						? (card.comments || []).map((c) =>
	// 								c.id === (message.data as Comment).id
	// 									? adaptBoardComment(message.data as Comment)
	// 									: c
	// 							)
	// 						: [
	// 								...(card.comments || []),
	// 								adaptBoardComment(message.data as Comment),
	// 							],
	// 		});
	// 	},
	// 	[card, onUpdate]
	// );

	// const handleActivityUpdate = useCallback(
	// 	(message: WebSocketMessage) => {
	// 		if (message.type !== 'activity') return;

	// 		const activityData = adaptBoardActivity(message.data as BoardActivity);
	// 		onUpdate({
	// 			...card,
	// 			activities: [...(card.activities || []), activityData],
	// 		});
	// 	},
	// 	[card, onUpdate]
	// );

	const handleSave = async () => {
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
	};

	const handleDateChange = (newDate: Nullable<string>) => {
		setDueDate(newDate);
		onUpdate({
			...card,
			due_date: newDate,
		} as Card);
	};

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

	const handleDescriptionChange = useCallback((newDescription: string) => {
		setDescription(newDescription);
	}, []);

	// Focus management
	useEffect(() => {
		if (isOpen && isEditing && editorRef.current) {
			editorRef.current.focus();
		}
	}, [isOpen, isEditing]);

	const connectionIndicator = isConnected ? (
		<div className='absolute top-2 right-2 flex items-center gap-2'>
			<div className='w-2 h-2 rounded-full bg-green-500' />
			<span className='text-xs text-green-500'>Connected</span>
		</div>
	) : null;
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			{connectionIndicator}
			<DialogContent className={cn('max-w-4xl p-0', className)}>
				<DialogHeader>
					<DialogTitle className='sr-only'>
						{isEditing
							? `Edit Card: ${card.title}`
							: `Card Details: ${card.title}`}
					</DialogTitle>
					<DialogDescription className='sr-only'>
						Manage card details including title, description, due date, and
						other properties
					</DialogDescription>
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
											ref={editorRef}
											content={description}
											onChange={handleDescriptionChange}
											placeholder='Add a more detailed description...'
											readOnly={!isEditing}
											className='min-h-[150px] p-3 rounded-lg border border-neutral-200 
                        dark:border-neutral-700 focus:border-blue-500 
                        focus:ring-1 focus:ring-blue-500'
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
											onChange={handleDateChange}
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
											Comments ({card.comments?.length || 0})
										</Label>
										<Comments
											cardId={card.id}
											// Safely handle potentially undefined comments array
											comments={(card.comments || []).map((comment) =>
												adaptBoardComment(comment)
											)}
											onUpdate={(newComments) => {
												console.log('Updating comments:', newComments);
												onUpdate({
													...card,
													comments: newComments.map((comment) => ({
														...comment,
														updated_at:
															comment.updated_at || comment.created_at,
													})),
												});
											}}
										/>
									</div>
								</TabsContent>

								<TabsContent value='activity' className='p-6'>
									<ActivityFeed
										cardId={card.id}
										activities={card.activities?.map(adaptBoardActivity) || []}
										// Safely handle potentially undefined comments array here too
										comments={
											(card.comments || []).map(adaptBoardComment) || []
										}
									/>
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
