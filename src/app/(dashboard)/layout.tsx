'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { Sidebar } from '@/app/components/dashboard/sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/app/components/ui/loading';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading } = useAuth();
	const [collapsed, setCollapsed] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push('/signin');
		}
	}, [loading, user, router]);

	if (loading) {
		return <Loading />;
	}

	if (!user) {
		return null;
	}

	return (
		<div className='flex h-screen bg-gray-50 dark:bg-neutral-900'>
			<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
			<main
				className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-200 ${
					collapsed ? 'ml-20' : 'ml-64'
				}`}
			>
				<div className='container mx-auto px-6 py-8'>{children}</div>
			</main>
		</div>
	);
}
