'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/app/types/boards';
import { cn } from '@/lib/utils';
import { IconPlus, IconX } from '@tabler/icons-react';
import { LabelManagerProps } from '@/app/types/label-manager';

// Add type for label colors
interface LabelColor {
	value: string;
	name: string;
}

const LABEL_COLORS: LabelColor[] = [
	{ value: '#ef4444', name: 'red' },
	{ value: '#f97316', name: 'orange' },
	{ value: '#f59e0b', name: 'amber' },
	{ value: '#84cc16', name: 'lime' },
	{ value: '#10b981', name: 'emerald' },
	{ value: '#06b6d4', name: 'cyan' },
	{ value: '#3b82f6', name: 'blue' },
	{ value: '#8b5cf6', name: 'violet' },
];

interface LabelDisplayProps {
	label: Label;
	onDelete?: () => void;
	disabled?: boolean;
}

const LabelDisplay = ({
	label,
	onDelete,
	disabled = false,
}: LabelDisplayProps) => (
	<div
		className={cn(
			'inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm',
			disabled && 'opacity-70'
		)}
		style={{ backgroundColor: label.color }}
	>
		<span className='text-white truncate'>{label.name}</span>
		{onDelete && !disabled && (
			<button
				onClick={onDelete}
				className='text-white/80 hover:text-white transition-colors'
				aria-label={`Remove ${label.name} label`}
			>
				<IconX className='w-3 h-3' />
			</button>
		)}
	</div>
);

export function LabelManager({
	cardId,
	labels,
	onUpdate,
	disabled = false,
	className,
}: LabelManagerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [newLabel, setNewLabel] = useState({
		name: '',
		color: LABEL_COLORS[0].value,
	});

	const handleCreateLabel = () => {
		if (!newLabel.name.trim() || disabled) return;

		const tempLabel: Label = {
			id: Math.random(),
			name: newLabel.name.trim(),
			color: newLabel.color,
			card_id: cardId,
		};

		onUpdate([...labels, tempLabel]);
		setNewLabel({ name: '', color: LABEL_COLORS[0].value });
		setIsOpen(false);
	};

	const handleDeleteLabel = (labelId: number) => {
		if (disabled) return;
		onUpdate(labels.filter((label) => label.id !== labelId));
	};

	return (
		<div className={className}>
			{/* Label Display and Add Button */}
			<div className='flex flex-wrap gap-2'>
				<AnimatePresence mode='popLayout'>
					{labels.map((label) => (
						<motion.div
							key={label.id}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
						>
							<LabelDisplay
								label={label}
								onDelete={() => handleDeleteLabel(label.id)}
								disabled={disabled}
							/>
						</motion.div>
					))}
				</AnimatePresence>
				<Button
					variant='outline'
					size='sm'
					onClick={() => !disabled && setIsOpen(true)}
					disabled={disabled}
					className='gap-1'
				>
					<IconPlus className='w-4 h-4' />
					Add Label
				</Button>
			</div>

			{/* Label Creation Dialog */}
			<Dialog
				open={isOpen && !disabled}
				onOpenChange={(open) => !disabled && setIsOpen(open)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Label</DialogTitle>
					</DialogHeader>

					<div className='space-y-4'>
						<Input
							placeholder='Label name'
							value={newLabel.name}
							onChange={(e) =>
								setNewLabel({ ...newLabel, name: e.target.value })
							}
							className='mb-2'
							disabled={disabled}
						/>

						<div className='space-y-2'>
							<p className='text-sm font-medium'>Color</p>
							<div className='grid grid-cols-4 gap-2'>
								{LABEL_COLORS.map((color) => (
									<button
										key={color.value}
										type='button'
										className={cn(
											'w-8 h-8 rounded-full transition-all',
											newLabel.color === color.value &&
												'ring-2 ring-offset-2 ring-black dark:ring-white',
											disabled && 'opacity-50 cursor-not-allowed'
										)}
										style={{ backgroundColor: color.value }}
										onClick={() =>
											!disabled &&
											setNewLabel({ ...newLabel, color: color.value })
										}
										disabled={disabled}
										aria-label={`Select ${color.name} color`}
									/>
								))}
							</div>
						</div>

						<div className='flex justify-end gap-2'>
							<Button
								variant='outline'
								onClick={() => setIsOpen(false)}
								disabled={disabled}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateLabel}
								disabled={disabled || !newLabel.name.trim()}
							>
								Create Label
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
