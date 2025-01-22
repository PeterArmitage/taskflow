// components/dashboard/cards/card-detail/content.tsx
import { memo } from 'react';
import { Card, Label as CardLabel } from '@/app/types/boards';
import { AnyComment } from '@/app/types/comments';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Editor } from '@/app/components/dashboard/cards/editor';
import { CustomDatePicker } from '@/components/ui/custom-date-picker';
import { LabelManager } from '@/app/components/dashboard/labels/label-manager';
import { Comments } from '@/app/components/dashboard/cards/comments';
import {
	IconCalendar,
	IconTag,
	IconMessageCircle,
	IconPaperclip,
} from '@tabler/icons-react';

interface CardDetailContentProps {
	card: Card;
	labels: CardLabel[];
	comments: AnyComment[];
	description: string;
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
}

export const CardDetailContent = memo(function CardDetailContent({
	card,
	labels,
	comments,
	description,
	setDescription,
	dueDate,
	setDueDate,
	isEditing,
	onLabelUpdate,
	onCommentUpdate,
	onCommentDelete,
	onCommentsUpdate,
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
	return (
		<div className='space-y-3'>
			<Label className='flex items-center gap-2'>
				<IconTag className='w-4 h-4' />
				Labels
			</Label>
			<LabelManager
				cardId={cardId}
				labels={labels}
				onUpdate={onUpdate}
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
