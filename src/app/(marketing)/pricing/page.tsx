// app/pricing/page.tsx
import { Button } from '@/app/components/ui/button';
import { motion } from 'framer-motion';
import {
	IconCheck,
	IconCreditCard,
	IconUsers,
	IconBuilding,
} from '@tabler/icons-react';
import { LandingNavbar } from '../components/landing/navbar';

const plans = [
	{
		name: 'Free',
		icon: IconUsers,
		price: '0',
		description: 'Perfect for individuals and small teams',
		buttonText: 'Get Started',
		features: [
			'Up to 3 boards',
			'Basic automation',
			'1GB storage',
			'Core integrations',
			'iOS & Android apps',
			'2 weeks history',
		],
	},
	{
		name: 'Professional',
		icon: IconCreditCard,
		price: '12',
		description: 'Ideal for growing teams and organizations',
		buttonText: 'Start Free Trial',
		features: [
			'Unlimited boards',
			'Advanced automation',
			'10GB storage',
			'All integrations',
			'Priority support',
			'Unlimited history',
			'Custom fields',
			'Admin controls',
		],
	},
	{
		name: 'Enterprise',
		icon: IconBuilding,
		price: '29',
		description: 'Advanced features for large teams',
		buttonText: 'Contact Sales',
		features: [
			'Everything in Pro',
			'Enterprise SSO',
			'Unlimited storage',
			'Advanced security',
			'24/7 support',
			'Custom contracts',
			'Dedicated success manager',
			'Custom integrations',
		],
	},
];

export default function PricingPage() {
	return (
		<div className='min-h-screen bg-black'>
			<LandingNavbar />
			<main className='pt-24 pb-20'>
				<div className='max-w-7xl mx-auto px-4'>
					<div className='text-center mb-16'>
						<h1 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 mb-4'>
							Simple, transparent pricing
						</h1>
						<p className='text-lg text-neutral-400'>
							No hidden fees. No surprise charges. Choose the plan that&apos;s
							right for you.
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
						{plans.map((plan, index) => (
							<motion.div
								key={plan.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.4,
									delay: index * 0.1,
								}}
								className={`relative rounded-2xl p-8 ${
									plan.name === 'Professional'
										? 'bg-gradient-to-b from-blue-500 to-blue-600'
										: 'bg-neutral-900'
								} shadow-xl`}
							>
								{/* Plan content - same as landing page pricing section */}
								<div className='mb-6'>
									<plan.icon className='h-8 w-8 text-white mb-4' />
									<h3 className='text-xl font-bold text-white mb-2'>
										{plan.name}
									</h3>
									<div className='mb-2'>
										<span className='text-4xl font-bold text-white'>
											${plan.price}
										</span>
										<span className='text-neutral-400 ml-2'>/month</span>
									</div>
									<p className='text-neutral-400'>{plan.description}</p>
								</div>

								<Button
									variant={plan.name === 'Professional' ? 'sketch' : 'outline'}
									className='w-full mb-6'
								>
									{plan.buttonText}
								</Button>

								<ul className='space-y-3'>
									{plan.features.map((feature, index) => (
										<li key={index} className='flex items-center text-sm'>
											<IconCheck className='h-5 w-5 mr-3 text-green-500 flex-shrink-0' />
											<span className='text-neutral-300'>{feature}</span>
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
