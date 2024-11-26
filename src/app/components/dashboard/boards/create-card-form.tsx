// components/dashboard/boards/create-card-form.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { cardApi } from '@/app/api/card';

interface CreateCardFormProps {
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
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			setError('Title is required');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await cardApi.createCard({
				title: title.trim(),
				list_id: listId,
			});
			onSuccess();
		} catch (error) {
			setError('Failed to create card');
			console.error('Create card error:', error);
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

			{error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

			<div className='flex items-center gap-2'>
				<Button type='submit' variant='sketch' disabled={loading}>
					{loading ? (
						<IconLoader2 className='w-4 h-4 animate-spin' />
					) : (
						'Add Card'
					)}
				</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</motion.form>
	);
}
