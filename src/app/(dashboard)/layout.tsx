// app/(dashboard)/layout.tsx
'use client';

import { Sidebar } from '@/app/components/dashboard/sidebar/sidebar';
import { Navbar } from '@/app/components/dashboard/navbar';
import { useAuth } from '@/app/hooks/useAuth';
import { Loading } from '@/app/components/ui/loading';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	// Get user and loading state from our auth hook
	const { user, loading } = useAuth();

	// Show loading screen while checking authentication
	if (loading) {
		return <Loading />;
	}

	// If somehow we got here without a user, we could redirect to login
	// but that's usually handled by our auth middleware
	if (!user) {
		return null;
	}

	return (
		<div className='flex h-screen bg-gray-50 dark:bg-neutral-900'>
			<Sidebar />
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Navbar user={user} />
				<main className='flex-1 overflow-auto p-4'>{children}</main>
			</div>
		</div>
	);
}
