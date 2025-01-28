// components/dashboard/checklists/checklist.tsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChecklistItem } from './checklist-item';
import { ProgressBar } from './progress-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
	Checklist as ChecklistType,
	ChecklistItem as ChecklistItemType,
} from '@/app/types/checklist';
import { useToast } from '@/hooks/use-toast';
import { checklistApi } from '@/app/api/checklist';

interface ChecklistProps {
	checklist: ChecklistType;
	onDelete: () => Promise<void>;
	onUpdate: (checklist: ChecklistType) => void;
	disabled?: boolean;
}

export function Checklist({
	checklist,
	onDelete,
	onUpdate,
	disabled = false,
}: ChecklistProps) {
	const [newItemContent, setNewItemContent] = useState('');
	const [isAddingItem, setIsAddingItem] = useState(false);
	const { toast } = useToast();

	const completedItems = checklist.items.filter(
		(item) => item.completed
	).length;
	const progress =
		checklist.items.length > 0
			? (completedItems / checklist.items.length) * 100
			: 0;

	const handleAddItem = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newItemContent.trim() || disabled) return;

		try {
			const newItem = await checklistApi.createItem({
				content: newItemContent.trim(),
				checklist_id: checklist.id,
			});

			onUpdate({
				...checklist,
				items: [...checklist.items, newItem],
			});
			setNewItemContent('');
			setIsAddingItem(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to add checklist item',
				variant: 'destructive',
			});
		}
	};

	const handleItemUpdate = useCallback(
		async (itemId: number, updates: Partial<ChecklistItemType>) => {
			try {
				const updatedItem = await checklistApi.updateItem(itemId, updates);
				onUpdate({
					...checklist,
					items: checklist.items.map((item) =>
						item.id === itemId ? updatedItem : item
					),
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to update checklist item',
					variant: 'destructive',
				});
			}
		},
		[checklist, onUpdate, toast]
	);

	const handleItemDelete = useCallback(
		async (itemId: number) => {
			try {
				await checklistApi.deleteItem(itemId);
				onUpdate({
					...checklist,
					items: checklist.items.filter((item) => item.id !== itemId),
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to delete checklist item',
					variant: 'destructive',
				});
			}
		},
		[checklist, onUpdate, toast]
	);

	return (
		<div className='space-y-4'>
			{/* Header */}
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
				<AnimatePresence mode='popLayout'>
					{checklist.items.map((item) => (
						<ChecklistItem
							key={item.id}
							item={item}
							onUpdate={handleItemUpdate}
							onDelete={handleItemDelete}
							disabled={disabled}
						/>
					))}
				</AnimatePresence>
			</div>

			{/* Add Item Form */}
			{isAddingItem ? (
				<motion.form
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					onSubmit={handleAddItem}
					className='space-y-2'
				>
					<Input
						value={newItemContent}
						onChange={(e) => setNewItemContent(e.target.value)}
						placeholder='Add an item...'
						disabled={disabled}
						autoFocus
					/>
					<div className='flex gap-2'>
						<Button type='submit' disabled={disabled || !newItemContent.trim()}>
							Add
						</Button>
						<Button
							type='button'
							variant='outline'
							onClick={() => setIsAddingItem(false)}
						>
							Cancel
						</Button>
					</div>
				</motion.form>
			) : (
				<Button
					variant='outline'
					size='sm'
					onClick={() => setIsAddingItem(true)}
					disabled={disabled}
					className='w-full'
				>
					<IconPlus className='w-4 h-4 mr-2' />
					Add Item
				</Button>
			)}
		</div>
	);
}
