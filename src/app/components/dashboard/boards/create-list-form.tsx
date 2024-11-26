// components/dashboard/boards/create-list-form.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { listApi } from '@/app/api/list';

interface CreateListFormProps {
	boardId: number;
	onCancel: () => void;
	onSuccess: () => void;
}

export function CreateListForm({
	boardId,
	onCancel,
	onSuccess,
}: CreateListFormProps) {
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
			await listApi.createList({
				title: title.trim(),
				board_id: Number(boardId),
			});
			onSuccess();
		} catch (error) {
			setError('Failed to create list');
			console.error('Create list error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg'
			onSubmit={handleSubmit}
		>
			<input
				type='text'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Enter list title...'
				className='w-full p-2 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 mb-3'
				autoFocus
			/>

			{error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

			<div className='flex items-center gap-2'>
				<Button type='submit' variant='sketch' disabled={loading}>
					{loading ? (
						<IconLoader2 className='w-4 h-4 animate-spin' />
					) : (
						'Add List'
					)}
				</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</motion.form>
	);
}
