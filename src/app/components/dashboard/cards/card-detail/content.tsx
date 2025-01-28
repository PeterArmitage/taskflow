// components/dashboard/cards/card-detail/content.tsx
import { memo, useState, useCallback } from 'react';
import { Card, Label as CardLabel } from '@/app/types/boards';
import { AnyComment } from '@/app/types/comments';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Editor } from '@/app/components/dashboard/cards/editor';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { LabelManager } from '@/app/components/dashboard/labels/label-manager';
import { Checklist } from '@/app/types/checklist';
import { Checklist as ChecklistComponent } from '@/app/components/dashboard/checklists';
import { Comments } from '@/app/components/dashboard/cards/comments';
import {
	IconCalendar,
	IconTag,
	IconMessageCircle,
	IconPaperclip,
	IconChecklist,
	IconPlus,
	IconTrash,
} from '@tabler/icons-react';
import { checklistApi } from '@/app/api/checklist';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@radix-ui/react-checkbox';
import { cardApi } from '@/app/api/card';

interface CardDetailContentProps {
	card: Card;
	labels: CardLabel[];
	comments: AnyComment[];
	description: string;
	checklists?: Checklist[];
	setDescription: (description: string) => void;
	dueDate: string | null;
	setDueDate: (date: string | null) => void;
	isEditing: boolean;
	onLabelUpdate: (labels: CardLabel[]) => Promise<void>;
	onCommentUpdate: (
		commentId: number | string,
		content: string
	) => Promise<void>;
	onCommentDelete: (commentId: number | string) => Promise<void>;
	onCommentsUpdate: (comments: AnyComment[]) => void;
	onChecklistUpdate: (checklist: Checklist) => Promise<void>;
	onChecklistDelete: (checklistId: number) => Promise<void>;
}

export const CardDetailContent = memo(function CardDetailContent({
	card,
	labels,
	comments,
	description,
	checklists,
	setDescription,
	dueDate,
	setDueDate,
	isEditing,
	onLabelUpdate,
	onCommentUpdate,
	onCommentDelete,
	onCommentsUpdate,
	onChecklistUpdate,
	onChecklistDelete,
}: CardDetailContentProps) {
	return (
		<div className='flex-1 overflow-y-auto'>
			<Tabs defaultValue='details' className='w-full h-full'>
				<TabsList className='w-full justify-start border-b dark:border-neutral-800 rounded-none'>
					<TabsTrigger value='details'>Details</TabsTrigger>
					<TabsTrigger value='activity'>Activity</TabsTrigger>
				</TabsList>

				<TabsContent value='details' className='p-6 space-y-6'>
					<DescriptionSection
						description={description}
						setDescription={setDescription}
						isEditing={isEditing}
					/>

					<DueDateSection
						dueDate={dueDate}
						setDueDate={setDueDate}
						isEditing={isEditing}
					/>

					<LabelsSection
						cardId={card.id}
						labels={labels}
						onUpdate={onLabelUpdate}
						isEditing={isEditing}
					/>
					<ChecklistSection
						card={{ ...card, checklists }}
						isEditing={isEditing}
						onChecklistUpdate={onChecklistUpdate}
						onChecklistDelete={onChecklistDelete}
					/>
					{card.attachments_count > 0 && (
						<AttachmentsSection count={card.attachments_count} />
					)}

					<CommentsSection
						cardId={card.id}
						comments={comments}
						onUpdate={onCommentUpdate}
						onDelete={onCommentDelete}
						onCommentsUpdate={onCommentsUpdate}
					/>
				</TabsContent>

				<TabsContent value='activity' className='p-6'>
					<div className='text-neutral-500'>Activity log coming soon...</div>
				</TabsContent>
			</Tabs>
		</div>
	);
});

// Sub-components

const ChecklistSection = memo(function ChecklistSection({
	card,
	isEditing,
	onChecklistUpdate,
	onChecklistDelete,
}: {
	card: Card;
	isEditing: boolean;
	onChecklistUpdate: (checklist: Checklist) => Promise<void>;
	onChecklistDelete: (checklistId: number) => Promise<void>;
}) {
	const { toast } = useToast();
	const [isAddingChecklist, setIsAddingChecklist] = useState(false);
	const [newChecklistTitle, setNewChecklistTitle] = useState('');

	console.log('Current card checklists:', card.checklists);

	const handleAddChecklist = async () => {
		if (!newChecklistTitle.trim() || !isEditing) return;

		try {
			// Create the checklist through the card API
			const newChecklist = await cardApi.createChecklist(card.id, {
				title: newChecklistTitle.trim(),
				card_id: 0,
			});

			await onChecklistUpdate(newChecklist);
			setIsAddingChecklist(false);
			setNewChecklistTitle('');

			toast({
				title: 'Success',
				description: 'Checklist created successfully',
			});
		} catch (error) {
			console.error('Failed to create checklist:', error);
			toast({
				title: 'Error',
				description: 'Failed to create checklist. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='space-y-3'>
			<Label className='flex items-center gap-2'>
				<IconChecklist className='w-4 h-4' />
				Checklists
			</Label>
			<div className='space-y-6'>
				{card.checklists?.map((checklist) => (
					<ChecklistComponent
						key={checklist.id}
						checklist={checklist}
						onUpdate={onChecklistUpdate}
						onDelete={() => onChecklistDelete(checklist.id)}
						disabled={!isEditing}
					/>
				))}

				{isEditing && (
					<AnimatePresence mode='wait'>
						{isAddingChecklist ? (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className='space-y-2'
							>
								<Input
									value={newChecklistTitle}
									onChange={(e) => setNewChecklistTitle(e.target.value)}
									placeholder='Checklist title...'
									autoFocus
								/>
								<div className='flex gap-2'>
									<Button
										variant='default'
										onClick={handleAddChecklist}
										disabled={!newChecklistTitle.trim()}
									>
										Add Checklist
									</Button>
									<Button
										variant='outline'
										onClick={() => {
											setIsAddingChecklist(false);
											setNewChecklistTitle('');
										}}
									>
										Cancel
									</Button>
								</div>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<Button
									variant='outline'
									className='w-full'
									onClick={() => setIsAddingChecklist(true)}
								>
									<IconPlus className='w-4 h-4 mr-2' />
									Add Checklist
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
});

const DescriptionSection = memo(function DescriptionSection({
	description,
	setDescription,
	isEditing,
}: {
	description: string;
	setDescription: (description: string) => void;
	isEditing: boolean;
}) {
	return (
		<div className='space-y-3'>
			<Label>Description</Label>
			<Editor
				content={description}
				onChange={setDescription}
				placeholder='Add a more detailed description...'
				readOnly={!isEditing}
			/>
		</div>
	);
});

const DueDateSection = memo(function DueDateSection({
	dueDate,
	setDueDate,
	isEditing,
}: {
	dueDate: string | null;
	setDueDate: (date: string | null) => void;
	isEditing: boolean;
}) {
	return (
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
	);
});

const LabelsSection = memo(function LabelsSection({
	cardId,
	labels,
	onUpdate,
	isEditing,
}: {
	cardId: number;
	labels: CardLabel[];
	onUpdate: (labels: CardLabel[]) => Promise<void>;
	isEditing: boolean;
}) {
	const handleLabelUpdate = useCallback(
		async (updatedLabels: CardLabel[]) => {
			if (!isEditing) return;
			try {
				await onUpdate(updatedLabels);
			} catch (error) {
				console.error('Failed to update labels:', error);
				// Error is handled by parent component
			}
		},
		[isEditing, onUpdate]
	);

	return (
		<div className='space-y-3'>
			<Label className='flex items-center gap-2'>
				<IconTag className='w-4 h-4' />
				Labels
			</Label>
			<LabelManager
				cardId={cardId}
				labels={labels}
				onUpdate={handleLabelUpdate}
				disabled={!isEditing}
			/>
		</div>
	);
});

const AttachmentsSection = memo(function AttachmentsSection({
	count,
}: {
	count: number;
}) {
	return (
		<div className='space-y-3'>
			<Label className='flex items-center gap-2'>
				<IconPaperclip className='w-4 h-4' />
				Attachments ({count})
			</Label>
		</div>
	);
});

const CommentsSection = memo(function CommentsSection({
	cardId,
	comments,
	onUpdate,
	onDelete,
	onCommentsUpdate,
}: {
	cardId: number;
	comments: AnyComment[];
	onUpdate: (commentId: number | string, content: string) => Promise<void>;
	onDelete: (commentId: number | string) => Promise<void>;
	onCommentsUpdate: (comments: AnyComment[]) => void;
}) {
	return (
		<div className='space-y-3'>
			<Label className='flex items-center gap-2'>
				<IconMessageCircle className='w-4 h-4' />
				Comments ({comments.length})
			</Label>
			<Comments
				cardId={cardId}
				comments={comments}
				onUpdate={onCommentsUpdate}
				onUpdateComment={onUpdate}
				onDeleteComment={onDelete}
			/>
		</div>
	);
});
