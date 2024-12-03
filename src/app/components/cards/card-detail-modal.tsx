// components/dashboard/cards/card-detail.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '@/app/types/boards';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	IconCalendar,
	IconTag,
	IconPaperclip,
	IconMessageCircle,
	IconClock,
	IconTrash,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { LabelManager } from './label-components';
import { Label } from '@/app/types/boards';

interface CardDetailProps {
	card: CardType;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (card: Partial<CardType>) => Promise<void>;
	onDelete: () => Promise<void>;
}

export function CardDetail({
	card,
	isOpen,
	onClose,
	onUpdate,
	onDelete,
}: CardDetailProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(card.description || '');
	const [isSaving, setIsSaving] = useState(false);

	async function handleLabelCreate(newLabel: Omit<Label, 'id'>) {
		const tempLabel: Label = {
			...newLabel,
			id: -1, // Temporary ID that will be replaced by the API response
		};

		try {
			const response = await onUpdate({
				...card,
				labels: [...(card.labels || []), tempLabel],
			});
			// The API response should contain the actual label with a real ID
			return response;
		} catch (error) {
			console.error('Failed to create label:', error);
			throw error;
		}
	}

	async function handleLabelDelete(labelId: number) {
		try {
			await onUpdate({
				...card,
				labels: card.labels?.filter((label: Label) => label.id !== labelId),
			});
		} catch (error) {
			console.error('Failed to delete label:', error);
			throw error;
		}
	}

	const handleDescriptionSave = async () => {
		try {
			setIsSaving(true);
			await onUpdate({ description });
			setIsEditing(false);
		} catch (error) {
			console.error('Failed to update description:', error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-4xl p-0'>
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='flex flex-col h-[80vh]'
					>
						{/* Card Header */}
						<div className='p-6 border-b dark:border-neutral-800'>
							<div className='flex items-start justify-between'>
								<h2 className='text-2xl font-semibold'>{card.title}</h2>
								<Button
									variant='ghost'
									className='text-red-500 hover:text-red-600'
									onClick={onDelete}
								>
									<IconTrash className='w-5 h-5' />
								</Button>
							</div>
							<div className='flex items-center gap-4 mt-4 text-neutral-500'>
								<div className='flex items-center gap-2 text-sm'>
									<IconClock className='w-4 h-4' />
									Created {new Date(card.created_at).toLocaleDateString()}
								</div>
								{card.due_date && (
									<div className='flex items-center gap-2 text-sm'>
										<IconCalendar className='w-4 h-4' />
										Due {new Date(card.due_date).toLocaleDateString()}
									</div>
								)}
							</div>
						</div>

						{/* Card Content with Tabs */}
						<div className='flex-1 overflow-y-auto'>
							<Tabs defaultValue='details' className='w-full h-full'>
								<TabsList className='w-full justify-start border-b dark:border-neutral-800 rounded-none bg-transparent px-6'>
									<TabsTrigger
										value='details'
										className='data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800'
									>
										Details
									</TabsTrigger>
									<TabsTrigger
										value='activity'
										className='data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800'
									>
										Activity
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value='details'
									className='p-6 space-y-6 focus-visible:ring-0'
								>
									{/* Description Section */}
									<div className='space-y-3'>
										<h3 className='font-medium'>Description</h3>
										{isEditing ? (
											<div className='space-y-2'>
												<textarea
													value={description}
													onChange={(e) => setDescription(e.target.value)}
													className='w-full h-32 p-3 rounded-lg border dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100'
													placeholder='Add a description...'
												/>
												<div className='flex gap-2'>
													<Button
														onClick={handleDescriptionSave}
														disabled={isSaving}
													>
														Save
													</Button>
													<Button
														variant='outline'
														onClick={() => setIsEditing(false)}
													>
														Cancel
													</Button>
												</div>
											</div>
										) : (
											<div
												className='p-3 rounded-lg border dark:border-neutral-800 min-h-[8rem] cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800'
												onClick={() => setIsEditing(true)}
											>
												{description || 'Add a description...'}
											</div>
										)}
									</div>
									<div className='space-y-3'>
										<h3 className='font-medium flex items-center gap-2'>
											<IconTag className='w-4 h-4' />
											Labels
										</h3>
										<LabelManager
											cardId={card.id}
											labels={card.labels || []}
											onCreateLabel={async (newLabel) => {
												const tempLabel: Label = {
													...newLabel,
													id: Date.now(), // Temporary ID until API response
													card_id: card.id,
												};
												await onUpdate({
													...card,
													labels: [...(card.labels || []), tempLabel],
												});
											}}
											onDeleteLabel={async (labelId: number) => {
												await onUpdate({
													...card,
													labels:
														card.labels?.filter(
															(label: Label) => label.id !== labelId
														) || [],
												});
											}}
										/>
									</div>
								</TabsContent>

								<TabsContent
									value='activity'
									className='p-6 focus-visible:ring-0'
								>
									<div className='space-y-4'>
										{/* Activity content will go here */}
										<p className='text-neutral-500'>No activity yet</p>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</motion.div>
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
