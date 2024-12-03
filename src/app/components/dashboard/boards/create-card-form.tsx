// components/dashboard/boards/create-card-form.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cardApi } from '@/app/api/card';
import { useToast } from '@/hooks/use-toast';

export interface CreateCardFormProps {
	listId: number;
	onCancel: () => void;
	onSuccess: () => void;
}

export function CreateCardForm({
	listId,
	onCancel,
	onSuccess,
}: CreateCardFormProps) {
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			setLoading(true);
			await cardApi.createCard({
				title: title.trim(),
				list_id: listId,
			});

			toast({
				title: 'Success',
				description: 'Card created successfully',
			});

			onSuccess();
		} catch (error) {
			console.error('Failed to create card:', error);
			toast({
				title: 'Error',
				description: 'Failed to create card. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white dark:bg-neutral-900 p-3 rounded shadow-sm'
			onSubmit={handleSubmit}
		>
			<textarea
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Enter card title...'
				className='w-full p-2 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 mb-3 resize-none'
				rows={2}
				autoFocus
			/>

			<div className='flex items-center gap-2'>
				<Button type='submit' disabled={loading}>
					{loading ? 'Adding...' : 'Add Card'}
				</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</motion.form>
	);
}
