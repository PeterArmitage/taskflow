'use client';

import { useRouter } from 'next/navigation';
import { CreateBoardForm } from '@/app/components/dashboard/boards/create-board-form';
import { WobbleCard } from '@/app/components/ui/wobble-card';
import { boardApi } from '@/app/api/board';

export default function CreateBoardPage() {
	const router = useRouter();

	const handleSubmit = async (data: {
		title: string;
		description?: string;
	}) => {
		await boardApi.createBoard(data);
		router.push('/boards');
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className='max-w-2xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Create New Board</h1>

			<WobbleCard className='p-6'>
				<CreateBoardForm onSubmit={handleSubmit} onCancel={handleCancel} />
			</WobbleCard>
		</div>
	);
}
