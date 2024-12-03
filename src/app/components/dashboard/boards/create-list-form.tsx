// components/dashboard/boards/create-list-form.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listApi } from '@/app/api/list';
import { useToast } from '@/hooks/use-toast';

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
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			toast({
				title: 'Error',
				description: 'Title is required',
				variant: 'destructive',
			});
			return;
		}
		try {
			setLoading(true);
			console.log('Creating list with title:', title, 'for board:', boardId);
			const response = await listApi.createList({
				title: title.trim(),
				board_id: boardId,
			});
			console.log('List creation response:', response);
			onSuccess();
			console.log('onSuccess called - board should refresh');
		} catch (error) {
			console.error('Create list error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm'
			onSubmit={handleSubmit}
		>
			<Input
				type='text'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Enter list title...'
				className='mb-3'
				autoFocus
			/>

			<div className='flex gap-2'>
				<Button type='submit' variant='default' disabled={loading}>
					{loading ? 'Creating...' : 'Add List'}
				</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</motion.form>
	);
}
