// app/(marketing)/layout.tsx
import { LandingNavbar } from '@/app/components/landing/navbar';
import { AuroraBackground } from '@/app/components/ui/aurora-background';

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='min-h-screen'>
			<div className='relative'>
				<AuroraBackground className='absolute top-0 h-[100vh] w-full opacity-40' />
				<LandingNavbar />
				<main className='pt-16 relative z-10'>{children}</main>
			</div>
		</div>
	);
}
