// components/dashboard/checklists/checklist.tsx
import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconTrash,
	IconPlus,
	IconLoader2,
	IconGripVertical,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
	Checklist as ChecklistType,
	ChecklistItem,
} from '@/app/types/checklist';
import { ChecklistItem as ChecklistItemComponent } from './checklist-item';
import { ProgressBar } from './progress-bar';
import { useToast } from '@/hooks/use-toast';
import { checklistApi } from '@/app/api/checklist';
import {
	DndContext,
	DragEndEvent,
	useSensors,
	useSensor,
	PointerSensor,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		})
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		if (active.id !== over.id) {
			const oldIndex = checklist.items.findIndex(
				(item) => item.id === active.id
			);
			const newIndex = checklist.items.findIndex((item) => item.id === over.id);

			const newItems = arrayMove(checklist.items, oldIndex, newIndex).map(
				(item, index) => ({ ...item, position: index })
			);

			try {
				setIsLoading(true);
				// Update positions in the backend
				await Promise.all(
					newItems.map((item) =>
						checklistApi.updateItem(item.id, { position: item.position })
					)
				);

				await onUpdate({
					...checklist,
					items: newItems,
				});
			} catch (error) {
				console.error('Failed to reorder items:', error);
				toast({
					title: 'Error',
					description: 'Failed to reorder items',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		}
	};

	// Calculate progress
	const completedItems = checklist.items.filter(
		(item) => item.completed
	).length;
	const progress =
		checklist.items.length > 0
			? (completedItems / checklist.items.length) * 100
			: 0;

	const handleItemAdd = async () => {
		if (!newItemContent.trim() || disabled) return;

		try {
			setIsLoading(true);

			const newItem = await checklistApi.createItem({
				content: newItemContent.trim(),
				checklist_id: checklist.id,
				position: checklist.items.length,
			});

			await onUpdate({
				...checklist,
				items: [...checklist.items, newItem],
			});

			setNewItemContent('');
			setIsAddingItem(false);

			toast({
				title: 'Success',
				description: 'Item added successfully',
			});
		} catch (error) {
			console.error('Failed to add item:', error);
			toast({
				title: 'Error',
				description: 'Failed to add item',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemUpdate = async (
		itemId: number,
		updates: Partial<ChecklistItem>
	) => {
		try {
			setIsLoading(true);
			const updatedItem = await checklistApi.updateItem(itemId, updates);

			const updatedItems = checklist.items.map((item) =>
				item.id === itemId ? updatedItem : item
			);

			await onUpdate({
				...checklist,
				items: updatedItems,
			});
		} catch (error) {
			console.error('Failed to update item:', error);
			toast({
				title: 'Error',
				description: 'Failed to update item',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleItemDelete = async (itemId: number) => {
		try {
			setIsLoading(true);
			await checklistApi.deleteItem(itemId);

			const updatedItems = checklist.items.filter((item) => item.id !== itemId);
			await onUpdate({
				...checklist,
				items: updatedItems,
			});

			toast({
				title: 'Success',
				description: 'Item deleted successfully',
			});
		} catch (error) {
			console.error('Failed to delete item:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete item',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='space-y-4 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<IconGripVertical className='w-5 h-5 text-neutral-400 cursor-move' />
					<h3 className='font-medium'>{checklist.title}</h3>
				</div>
				<Button
					variant='ghost'
					size='sm'
					onClick={onDelete}
					disabled={disabled || isLoading}
					className='text-red-500 hover:text-red-600'
				>
					<IconTrash className='w-4 h-4' />
				</Button>
			</div>

			{/* Progress Bar */}
			<ProgressBar progress={progress} />
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext
					items={checklist.items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className='space-y-2'>
						<AnimatePresence mode='popLayout'>
							{checklist.items.map((item) => (
								<ChecklistItemComponent
									key={item.id}
									item={item}
									onUpdate={handleItemUpdate}
									onDelete={handleItemDelete}
									disabled={disabled || isLoading}
								/>
							))}
						</AnimatePresence>
					</div>
				</SortableContext>
			</DndContext>

			{/* Add Item Form */}
			{!disabled && (
				<div>
					<AnimatePresence mode='wait'>
						{isAddingItem ? (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className='space-y-2'
							>
								<Input
									value={newItemContent}
									onChange={(e) => setNewItemContent(e.target.value)}
									placeholder='Add an item...'
									disabled={isLoading}
									autoFocus
								/>
								<div className='flex gap-2'>
									<Button
										onClick={handleItemAdd}
										disabled={isLoading || !newItemContent.trim()}
									>
										{isLoading ? (
											<IconLoader2 className='w-4 h-4 animate-spin' />
										) : (
											'Add'
										)}
									</Button>
									<Button
										variant='outline'
										onClick={() => {
											setIsAddingItem(false);
											setNewItemContent('');
										}}
										disabled={isLoading}
									>
										Cancel
									</Button>
								</div>
							</motion.div>
						) : (
							<Button
								variant='outline'
								onClick={() => setIsAddingItem(true)}
								disabled={isLoading}
								className='w-full'
							>
								<IconPlus className='w-4 h-4 mr-2' />
								Add Item
							</Button>
						)}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
});
