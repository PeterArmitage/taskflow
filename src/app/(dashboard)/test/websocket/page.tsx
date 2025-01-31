// app/(dashboard)/test/websocket/page.tsx
'use client';

import { useEffect } from 'react';
import { WebSocketTest } from '@/app/components/test/websocket-test';
import { useAuth } from '@/app/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function WebSocketTestPage() {
	const { user, signin } = useAuth();

	const createTestUser = async () => {
		try {
			await signin({
				email: 'test@example.com',
				password: 'password123',
			});
		} catch (error) {
			console.error('Failed to create test user:', error);
		}
	};

	useEffect(() => {
		return () => {
			// Clean up any WebSocket connections when component unmounts
			if (user) {
				// Add any necessary cleanup code here
			}
		};
	}, [user]);

	if (!user) {
		return (
			<div className='container mx-auto py-8'>
				<h1 className='text-2xl font-bold mb-8'>WebSocket Test</h1>
				<Button onClick={createTestUser}>Create Test User</Button>
			</div>
		);
	}

	return (
		<div className='container mx-auto py-8'>
			<h1 className='text-2xl font-bold mb-8'>WebSocket Test</h1>
			<WebSocketTest cardId={1} />
		</div>
	);
}
