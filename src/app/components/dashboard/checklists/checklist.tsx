// components/dashboard/checklists/checklist.tsx
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
	Checklist as ChecklistType,
	ChecklistItem,
} from '@/app/types/checklist';
import { ChecklistItem as ChecklistItemComponent } from './checklist-item';
import { ProgressBar } from './progress-bar';

interface ChecklistProps {
	checklist: ChecklistType;
	onDelete: () => Promise<void>;
	onUpdate: (checklist: ChecklistType) => Promise<void>;
	disabled?: boolean;
}

export const Checklist = memo(function Checklist({
	checklist,
	onDelete,
	onUpdate,
	disabled = false,
}: ChecklistProps) {
	const [newItemContent, setNewItemContent] = useState('');
	const [isAddingItem, setIsAddingItem] = useState(false);

	// Calculate progress
	const completedItems = checklist.items.filter(
		(item) => item.completed
	).length;
	const progress =
		checklist.items.length > 0
			? (completedItems / checklist.items.length) * 100
			: 0;

	// Handler for updating individual checklist items
	const handleItemUpdate = async (
		itemId: number,
		updates: Partial<ChecklistItem>
	) => {
		const updatedItems = checklist.items.map((item) =>
			item.id === itemId ? { ...item, ...updates } : item
		);
		await onUpdate({ ...checklist, items: updatedItems });
	};

	// Handler for deleting individual checklist items
	const handleItemDelete = async (itemId: number) => {
		const updatedItems = checklist.items.filter((item) => item.id !== itemId);
		await onUpdate({ ...checklist, items: updatedItems });
	};

	// Handler for adding new items
	const handleAddItem = async () => {
		if (!newItemContent.trim()) return;

		const newItem: Omit<ChecklistItem, 'id'> = {
			content: newItemContent.trim(),
			completed: false,
			checklist_id: checklist.id,
			created_at: new Date().toISOString(),
			position: checklist.items.length,
		};

		await onUpdate({
			...checklist,
			items: [...checklist.items, { ...newItem, id: Date.now() }],
		});

		setNewItemContent('');
		setIsAddingItem(false);
	};

	return (
		<div className='space-y-4 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4'>
			{/* Checklist Header */}
			<div className='flex items-center justify-between'>
				<h3 className='font-medium'>{checklist.title}</h3>
				<Button
					variant='ghost'
					size='sm'
					onClick={onDelete}
					disabled={disabled}
					className='text-red-500 hover:text-red-600'
				>
					<IconTrash className='w-4 h-4' />
				</Button>
			</div>

			{/* Progress Bar */}
			<ProgressBar progress={progress} />

			{/* Checklist Items */}
			<div className='space-y-2'>
				{checklist.items.map((item) => (
					<ChecklistItemComponent
						key={item.id}
						item={item}
						onUpdate={handleItemUpdate}
						onDelete={handleItemDelete}
						disabled={disabled}
					/>
				))}
			</div>

			{/* Add Item Form */}
			{!disabled && (
				<div>
					{isAddingItem ? (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='space-y-2'
						>
							<Input
								value={newItemContent}
								onChange={(e) => setNewItemContent(e.target.value)}
								placeholder='Add an item...'
								autoFocus
							/>
							<div className='flex gap-2'>
								<Button
									variant='default'
									onClick={handleAddItem}
									disabled={!newItemContent.trim()}
								>
									Add
								</Button>
								<Button
									variant='outline'
									onClick={() => setIsAddingItem(false)}
								>
									Cancel
								</Button>
							</div>
						</motion.div>
					) : (
						<Button
							variant='outline'
							size='sm'
							onClick={() => setIsAddingItem(true)}
							className='w-full'
						>
							<IconPlus className='w-4 h-4 mr-2' />
							Add Item
						</Button>
					)}
				</div>
			)}
		</div>
	);
});
