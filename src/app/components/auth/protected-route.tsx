// components/auth/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { Loading } from '@/app/components/ui/loading';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push('/signin');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className='h-screen w-screen flex items-center justify-center'>
				<Loading />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}
