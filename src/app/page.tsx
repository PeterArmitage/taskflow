import { Features } from '@/app/components/landing/features';
import { Hero } from '@/app/components/landing/hero';
import { LandingNavbar } from '@/app/components/landing/navbar';
import { Solutions } from './components/landing/solutions';
import { Testimonials } from './components/landing/testimonials';
import { Views } from './components/landing/views';
import { Integrations } from './components/landing/integrations';
import { Pricing } from './components/landing/pricing';
import { Footer } from './components/landing/footer';

export default function Home() {
	return (
		<div className='min-h-screen flex flex-col'>
			{' '}
			<LandingNavbar />
			<main className='flex-grow'>
				{' '}
				<Hero />
				<Features />
				<Solutions />
				<Testimonials />
				<Views />
				<Integrations />
				<Pricing />
			</main>
			<Footer />
		</div>
	);
}
