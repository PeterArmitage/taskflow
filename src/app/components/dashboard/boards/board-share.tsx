// components/dashboard/boards/board-share.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareBoardData } from '@/app/types/collaboration';

interface BoardShareProps {
	boardId: number;
	onShare: (data: ShareBoardData) => Promise<void>;
}

export function BoardShare({ boardId, onShare }: BoardShareProps) {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<ShareBoardData['role']>('viewer');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onShare({ email, role });
		setEmail('');
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Email address</label>
				<Input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Enter email address'
					required
				/>
			</div>

			<div className='space-y-2'>
				<label className='text-sm font-medium'>Role</label>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value as ShareBoardData['role'])}
					className='w-full p-2 rounded-lg border border-gray-200 dark:border-neutral-700'
				>
					<option value='viewer'>Viewer</option>
					<option value='editor'>Editor</option>
					<option value='admin'>Admin</option>
				</select>
			</div>

			<Button type='submit' variant='sketch'>
				Share Board
			</Button>
		</form>
	);
}
