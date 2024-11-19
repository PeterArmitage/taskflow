import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { ApiError } from '@/app/types/auth';

interface CreateBoardData {
	title: string;
	description?: string;
}

interface CreateBoardFormProps {
	onSubmit: (data: CreateBoardData) => Promise<void>;
	onCancel: () => void;
}

export function CreateBoardForm({ onSubmit, onCancel }: CreateBoardFormProps) {
	const [data, setData] = useState<CreateBoardData>({
		title: '',
		description: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!data.title.trim()) {
			setError('Title is required');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await onSubmit(data);
		} catch (err) {
			const error = err as ApiError;
			setError(error.response?.data?.detail || 'Failed to create board');
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='space-y-6'
			onSubmit={handleSubmit}
		>
			<div className='space-y-4'>
				<div>
					<label
						htmlFor='title'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Board Title
					</label>
					<input
						id='title'
						type='text'
						value={data.title}
						onChange={(e) => setData({ ...data, title: e.target.value })}
						className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
						placeholder='Enter board title'
						maxLength={100}
					/>
				</div>

				<div>
					<label
						htmlFor='description'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Description (Optional)
					</label>
					<textarea
						id='description'
						value={data.description}
						onChange={(e) => setData({ ...data, description: e.target.value })}
						className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
						placeholder='Enter board description'
						rows={3}
						maxLength={500}
					/>
				</div>
			</div>

			{error && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='text-red-500 text-sm'
				>
					{error}
				</motion.p>
			)}

			<div className='flex justify-end gap-3'>
				<Button
					type='button'
					variant='outline'
					onClick={onCancel}
					disabled={loading}
				>
					Cancel
				</Button>
				<Button type='submit' variant='sketch' disabled={loading}>
					{loading ? (
						<IconLoader2 className='h-4 w-4 animate-spin' />
					) : (
						'Create Board'
					)}
				</Button>
			</div>
		</motion.form>
	);
}
