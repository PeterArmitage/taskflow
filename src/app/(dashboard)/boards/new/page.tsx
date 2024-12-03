// app/(dashboard)/boards/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CreateBoardForm } from '@/app/components/dashboard/boards/create-board-form';
import { boardApi } from '@/app/api/board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

			<Card>
				<CardHeader>
					<CardTitle>Create New Board</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateBoardForm onSubmit={handleSubmit} onCancel={handleCancel} />
				</CardContent>
			</Card>
		</div>
	);
}
