// components/dashboard/checklists/checklist-item.tsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 10 }}
			className='flex items-center gap-3 group'
		>
			<Checkbox
				checked={item.completed}
				onCheckedChange={(checked) =>
					onUpdate(item.id, { completed: checked as boolean })
				}
				disabled={disabled}
			/>
			<Input
				value={item.content}
				onChange={(e) => onUpdate(item.id, { content: e.target.value })}
				disabled={disabled}
				className={`flex-1 ${item.completed ? 'line-through text-neutral-500' : ''}`}
			/>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => onDelete(item.id)}
				disabled={disabled}
				className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600'
			>
				<IconTrash className='w-4 h-4' />
			</Button>
		</motion.div>
	);
});
