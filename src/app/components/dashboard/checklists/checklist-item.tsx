// components/dashboard/checklists/checklist-item.tsx
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { IconTrash, IconEdit, IconX, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ChecklistItem as ChecklistItemType } from '@/app/types/checklist';

interface ChecklistItemProps {
	item: ChecklistItemType;
	onUpdate: (
		itemId: number,
		updates: Partial<ChecklistItemType>
	) => Promise<void>;
	onDelete: (itemId: number) => Promise<void>;
	disabled?: boolean;
}

export const ChecklistItem = memo(function ChecklistItem({
	item,
	onUpdate,
	onDelete,
	disabled = false,
}: ChecklistItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(item.content);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async () => {
		if (!content.trim() || content === item.content) {
			setIsEditing(false);
			return;
		}

		try {
			setIsLoading(true);
			await onUpdate(item.id, { content: content.trim() });
			setIsEditing(false);
		} catch (error) {
			// Error is handled by parent
			setContent(item.content); // Reset on error
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggle = async (checked: boolean) => {
		if (disabled) return;
		try {
			setIsLoading(true);
			await onUpdate(item.id, { completed: checked });
		} catch (error) {
			// Error is handled by parent
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (disabled) return;
		try {
			setIsLoading(true);
			await onDelete(item.id);
		} catch (error) {
			// Error is handled by parent
		}
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			className={cn('flex items-center gap-3 group', disabled && 'opacity-70')}
		>
			<Checkbox
				checked={item.completed}
				onCheckedChange={handleToggle}
				disabled={disabled || isLoading}
			/>

			{isEditing ? (
				<div className='flex-1 space-y-2'>
					<Input
						value={content}
						onChange={(e) => setContent(e.target.value)}
						disabled={isLoading}
						autoFocus
					/>
					<div className='flex gap-2'>
						<Button
							size='sm'
							onClick={handleUpdate}
							disabled={
								isLoading || !content.trim() || content === item.content
							}
						>
							<IconCheck className='w-4 h-4' />
						</Button>
						<Button
							size='sm'
							variant='outline'
							onClick={() => {
								setIsEditing(false);
								setContent(item.content);
							}}
						>
							<IconX className='w-4 h-4' />
						</Button>
					</div>
				</div>
			) : (
				<>
					<span
						className={cn(
							'flex-1',
							item.completed && 'line-through text-neutral-500'
						)}
					>
						{item.content}
					</span>

					{!disabled && (
						<div className='opacity-0 group-hover:opacity-100 flex gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setIsEditing(true)}
								disabled={isLoading}
								className='h-6 w-6 p-0'
							>
								<IconEdit className='w-4 h-4' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleDelete}
								disabled={isLoading}
								className='h-6 w-6 p-0 text-red-500 hover:text-red-600'
							>
								<IconTrash className='w-4 h-4' />
							</Button>
						</div>
					)}
				</>
			)}
		</motion.div>
	);
});
