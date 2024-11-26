// components/dashboard/cards/card-modal.tsx
'use client';

import { Dialog } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Card } from '@/app/types/boards';
import { IconCalendar, IconTag, IconPaperclip } from '@tabler/icons-react';
import { Button } from '@/app/components/ui/button';

interface CardModalProps {
	card: Card;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (card: Card) => void;
}

export function CardModal({ card, isOpen, onClose, onUpdate }: CardModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
			>
				<div className='bg-white dark:bg-neutral-900 rounded-lg w-full max-w-2xl shadow-xl'>
					<div className='p-6'>
						<h2 className='text-xl font-semibold mb-4'>{card.title}</h2>

						<div className='space-y-6'>
							<div className='space-y-2'>
								<label className='text-sm font-medium'>Description</label>
								<textarea
									className='w-full p-3 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700'
									rows={4}
									defaultValue={card.description}
								/>
							</div>

							<div className='flex gap-4'>
								<Button variant='outline' onClick={onClose}>
									Cancel
								</Button>
								<Button variant='sketch'>Save Changes</Button>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</Dialog>
	);
}
