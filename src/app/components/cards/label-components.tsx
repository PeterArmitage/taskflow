// components/dashboard/cards/label-components.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Label {
	id: number;
	name: string;
	color: string;
	card_id: number;
}

interface LabelProps {
	label: Label;
	onDelete?: (labelId: number) => Promise<void>;
	className?: string;
}

interface LabelManagerProps {
	cardId: number;
	labels: Label[];
	onCreateLabel: (label: Omit<Label, 'id'>) => Promise<void>;
	onDeleteLabel: (labelId: number) => Promise<void>;
}

const PRESET_COLORS = [
	'#ef4444', // red
	'#f97316', // orange
	'#f59e0b', // amber
	'#84cc16', // lime
	'#10b981', // emerald
	'#06b6d4', // cyan
	'#3b82f6', // blue
	'#8b5cf6', // violet
];

export function CardLabel({ label, onDelete, className }: LabelProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm',
				'hover:ring-2 hover:ring-offset-2 hover:ring-neutral-900/10 dark:hover:ring-neutral-100/10',
				className
			)}
			style={{ backgroundColor: label.color }}
		>
			<span className='text-white truncate'>{label.name}</span>
			{onDelete && (
				<button
					onClick={() => onDelete(label.id)}
					className='text-white/80 hover:text-white'
				>
					×
				</button>
			)}
		</div>
	);
}

export function LabelManager({
	cardId,
	labels,
	onCreateLabel,
	onDeleteLabel,
}: LabelManagerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newLabel, setNewLabel] = useState({
		name: '',
		color: PRESET_COLORS[0],
	});
	const [isCreating, setIsCreating] = useState(false);

	const handleCreateLabel = async () => {
		if (!newLabel.name.trim()) return;

		try {
			setIsCreating(true);
			await onCreateLabel({
				name: newLabel.name,
				color: newLabel.color,
				card_id: cardId,
			});
			setNewLabel({ name: '', color: PRESET_COLORS[0] });
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<>
			<div className='flex flex-wrap gap-2'>
				{labels.map((label) => (
					<CardLabel key={label.id} label={label} onDelete={onDeleteLabel} />
				))}
				<Button variant='outline' size='sm' onClick={() => setIsOpen(true)}>
					Add Label
				</Button>
			</div>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Label</DialogTitle>
					</DialogHeader>

					<div className='space-y-4 py-4'>
						<Input
							placeholder='Label name'
							value={newLabel.name}
							onChange={(e) =>
								setNewLabel({ ...newLabel, name: e.target.value })
							}
						/>

						<div className='grid grid-cols-8 gap-2'>
							{PRESET_COLORS.map((color) => (
								<button
									key={color}
									className={cn(
										'w-8 h-8 rounded-full',
										newLabel.color === color &&
											'ring-2 ring-offset-2 ring-neutral-900 dark:ring-neutral-100'
									)}
									style={{ backgroundColor: color }}
									onClick={() => setNewLabel({ ...newLabel, color })}
								/>
							))}
						</div>

						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleCreateLabel}
								disabled={isCreating || !newLabel.name.trim()}
							>
								Create Label
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
