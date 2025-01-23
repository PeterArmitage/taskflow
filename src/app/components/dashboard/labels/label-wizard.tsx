import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/app/types/boards';
import {
	IconPlus,
	IconX,
	IconLoader2,
	IconChevronRight,
	IconChevronLeft,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { LABEL_TEMPLATES, LabelWizardProps } from '@/app/types/labels';
import { useToast } from '@/hooks/use-toast';
import { labelApi } from '@/app/api/label';
import { ColorPicker } from '@/app/components/ui/color-picker';

interface WizardStep {
	title: string;
	description: string;
}

const STEPS: WizardStep[] = [
	{
		title: 'Choose Type',
		description: 'Select a label type or create a custom label',
	},
	{
		title: 'Customize',
		description: 'Set the label name and pick a color',
	},
	{
		title: 'Preview',
		description: 'Review how your label will look',
	},
];

export function LabelWizard({
	cardId,
	labels,
	onUpdate,
	disabled = false,
	className,
	isOpen,
	onClose,
}: LabelWizardProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	console.log('LabelWizard render - isOpen:', isOpen);

	const [labelData, setLabelData] = useState({
		type: 'custom',
		name: '',
		color: '#3b82f6',
		description: '',
	});

	const handleNext = () => {
		if (currentStep < STEPS.length - 1) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleCreateLabel = async () => {
		console.log('Label data before creation:', labelData);
		if (!labelData.name.trim() || disabled || isLoading) return;

		try {
			setIsLoading(true);
			console.log('Creating label with data:', labelData);

			const labelPayload = {
				name: labelData.name.trim(),
				color: labelData.color,
				description: labelData.description?.trim() || undefined,
				type: labelData.type !== 'custom' ? labelData.type : undefined,
			};

			console.log('Sending label payload:', labelPayload);
			const newLabel = await labelApi.createLabel(cardId, labelPayload);
			console.log('Received new label:', newLabel);

			// Update labels with the newly created label
			onUpdate([...labels, newLabel]);
			resetForm();
			onClose();

			toast({
				title: 'Success',
				description: 'Label created successfully',
			});
		} catch (error) {
			console.error('Failed to create label:', error);
			toast({
				title: 'Error',
				description: 'Failed to create label',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setLabelData({
			type: 'custom',
			name: '',
			color: '#3b82f6',
			description: '',
		});
		setCurrentStep(0);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							{Object.entries(LABEL_TEMPLATES).map(([type, templates]) => (
								<Button
									key={type}
									variant='outline'
									className={cn(
										'h-auto p-4 flex flex-col items-start space-y-2',
										labelData.type === type && 'ring-2 ring-blue-500'
									)}
									onClick={() => setLabelData((prev) => ({ ...prev, type }))}
								>
									<span className='font-medium'>{type}</span>
									<span className='text-sm text-neutral-500'>
										{templates[0]?.description || `Create a ${type} label`}
									</span>
								</Button>
							))}
						</div>
					</div>
				);

			case 1:
				return (
					<div className='space-y-6'>
						<div>
							<label className='text-sm font-medium mb-1 block'>
								Label Name
							</label>
							<Input
								value={labelData.name}
								onChange={(e) =>
									setLabelData((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder='Enter label name'
								className='w-full'
							/>
						</div>

						<div>
							<label className='text-sm font-medium mb-1 block'>Color</label>
							<ColorPicker
								value={labelData.color}
								onChange={(color) =>
									setLabelData((prev) => ({ ...prev, color }))
								}
								disabled={disabled}
								className='mt-2'
							/>
						</div>

						{labelData.type === 'custom' && (
							<div>
								<label className='text-sm font-medium mb-1 block'>
									Description (Optional)
								</label>
								<Input
									value={labelData.description}
									onChange={(e) =>
										setLabelData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									placeholder='Add a description'
									className='w-full'
								/>
							</div>
						)}

						{/* Preview of the label */}
						<div className='mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg'>
							<span className='text-sm font-medium'>Preview</span>
							<div className='mt-2 flex items-center gap-2'>
								<div
									className='px-3 py-1 rounded-full text-sm'
									style={{
										backgroundColor: labelData.color,
										color:
											parseInt(labelData.color.slice(1), 16) > 0x7fffff
												? 'black'
												: 'white',
									}}
								>
									{labelData.name || 'Label Preview'}
								</div>
							</div>
						</div>
					</div>
				);

			case 2:
				return (
					<div className='space-y-4'>
						<div className='p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg'>
							<h3 className='font-medium mb-2'>Label Preview</h3>
							<div
								className='px-3 py-1 rounded-full text-white text-sm inline-flex items-center'
								style={{ backgroundColor: labelData.color }}
							>
								{labelData.name}
							</div>
						</div>

						<div className='text-sm text-neutral-500'>
							<p>Type: {labelData.type}</p>
							{labelData.description && (
								<p className='mt-1'>Description: {labelData.description}</p>
							)}
						</div>
					</div>
				);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Create New Label</DialogTitle>
				</DialogHeader>

				<div className='relative'>
					{/* Progress Steps */}
					<div className='mb-8'>
						<div className='flex justify-between'>
							{STEPS.map((step, index) => (
								<div
									key={step.title}
									className={cn(
										'flex flex-col items-center',
										index <= currentStep ? 'text-blue-500' : 'text-neutral-400'
									)}
								>
									<div className='flex items-center'>
										<div className='w-8 h-8 rounded-full border-2 flex items-center justify-center'>
											{index + 1}
										</div>
										{index < STEPS.length - 1 && (
											<div className='w-full h-[2px] bg-current' />
										)}
									</div>
									<span className='mt-2 text-sm font-medium'>{step.title}</span>
								</div>
							))}
						</div>
					</div>

					{/* Step Content */}
					<AnimatePresence mode='wait'>
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
						>
							{renderStepContent()}
						</motion.div>
					</AnimatePresence>
				</div>

				<DialogFooter className='flex justify-between mt-8'>
					<Button
						variant='outline'
						onClick={handleBack}
						disabled={currentStep === 0}
					>
						<IconChevronLeft className='w-4 h-4 mr-2' />
						Back
					</Button>

					{currentStep < STEPS.length - 1 ? (
						<Button onClick={handleNext} disabled={!labelData.type}>
							Next
							<IconChevronRight className='w-4 h-4 ml-2' />
						</Button>
					) : (
						<Button
							onClick={handleCreateLabel}
							disabled={!labelData.name.trim() || isLoading}
						>
							{isLoading ? (
								<>
									<IconLoader2 className='w-4 h-4 mr-2 animate-spin' />
									Creating...
								</>
							) : (
								'Create Label'
							)}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
