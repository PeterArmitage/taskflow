// components/dashboard/labels/label-manager.tsx
import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus } from '@tabler/icons-react';
import {
	type LabelManagerProps,
	type LabelCreateData,
} from '@/app/types/labels';
import { LabelDisplay, LabelGroup } from './label-display';
import { LabelWizard } from './label-wizard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { labelApi } from '@/app/api/label';
import { Label } from '@/app/types/boards';

export const LabelManager = memo(function LabelManager({
	cardId,
	labels,
	onUpdate,
	disabled = false,
	className,
}: LabelManagerProps) {
	const [showWizard, setShowWizard] = useState(false);
	const { toast } = useToast();

	const handleLabelCreate = useCallback(
		async (updatedLabels: Label[]) => {
			try {
				const newLabel = updatedLabels[updatedLabels.length - 1];
				const createdLabel = await labelApi.createLabel(cardId, {
					name: newLabel.name,
					color: newLabel.color,
				});

				const finalLabels = [...labels, createdLabel];
				await onUpdate(finalLabels);
				setShowWizard(false);

				toast({
					title: 'Success',
					description: 'Label created successfully',
				});
			} catch (error) {
				console.error('Label creation error:', error);
				toast({
					title: 'Error',
					description: 'Failed to create label',
					variant: 'destructive',
				});
			}
		},
		[cardId, labels, onUpdate, toast]
	);

	const handleLabelDelete = useCallback(
		async (labelId: number) => {
			try {
				// Delete the label from the API
				await labelApi.deleteLabel(labelId);
				// Update local state by filtering out the deleted label
				const updatedLabels = labels.filter((label) => label.id !== labelId);
				await onUpdate(updatedLabels);

				toast({
					title: 'Success',
					description: 'Label deleted successfully',
				});
			} catch (error) {
				console.error('Label deletion error:', error);
				toast({
					title: 'Error',
					description: 'Failed to delete label',
					variant: 'destructive',
				});
			}
		},
		[labels, onUpdate, toast]
	);

	return (
		<div className={className}>
			<div className='space-y-4'>
				<AnimatePresence mode='popLayout'>
					{labels.length > 0 ? (
						<div className='space-y-2'>
							{/* Individual label display */}
							{labels.map((label) => (
								<LabelDisplay
									key={label.id}
									label={label}
									onDelete={() => handleLabelDelete(label.id)}
									disabled={disabled}
									tooltipText={label.description}
									className='w-full'
								/>
							))}
						</div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='text-center py-4 text-neutral-500 dark:text-neutral-400'
						>
							No labels yet
						</motion.div>
					)}
				</AnimatePresence>

				<Button
					variant='outline'
					size='sm'
					onClick={() => !disabled && setShowWizard(true)}
					disabled={disabled}
					className='w-full'
				>
					<IconPlus className='w-4 h-4 mr-2' />
					Add Label
				</Button>
			</div>

			{showWizard && (
				<LabelWizard
					cardId={cardId}
					labels={labels}
					onUpdate={handleLabelCreate}
					disabled={disabled}
					isOpen={showWizard}
					onClose={() => setShowWizard(false)}
				/>
			)}
		</div>
	);
});
