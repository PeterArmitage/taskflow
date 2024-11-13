// components/landing/pricing.tsx
'use client';
import { motion } from 'framer-motion';
import { IconCheck } from '@tabler/icons-react';
import { Button } from '../ui/button';

export const Pricing = () => {
	return (
		<section className='py-20 bg-black text-white'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='text-center mb-16'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 mb-4'>
						Simple, transparent pricing
					</h2>
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
							whileHover={{
								translateY: -5,
							}}
							className={`relative rounded-2xl p-8 ${
								plan.featured
									? 'bg-gradient-to-b from-blue-500 to-blue-600'
									: 'bg-neutral-900'
							} shadow-xl`}
						>
							{plan.featured && (
								<div className='absolute -top-4 left-0 right-0 flex justify-center'>
									<div className='px-4 py-1 bg-white text-black text-sm font-bold rounded-full'>
										Most Popular
									</div>
								</div>
							)}

							<div className='mb-6'>
								<h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
								<div className='mb-2'>
									<span className='text-4xl font-bold'>${plan.price}</span>
									<span className='text-neutral-400 ml-2'>/month</span>
								</div>
								<p className='text-neutral-400'>{plan.description}</p>
							</div>

							<Button
								variant={plan.featured ? 'sketch' : 'outline'}
								className={`w-full mb-6 ${
									plan.featured
										? 'bg-white text-blue-600 border-white hover:bg-blue-600 hover:text-white transition-colors' // Added explicit styling for featured button
										: 'text-white hover:text-black'
								}`}
							>
								{plan.buttonText}
							</Button>

							<ul className='space-y-3'>
								{plan.features.map((feature, index) => (
									<li key={index} className='flex items-center text-sm'>
										<IconCheck className='h-5 w-5 mr-3 text-green-500 flex-shrink-0' />
										<span
											className={
												plan.featured ? 'text-white' : 'text-neutral-300'
											}
										>
											{feature}
										</span>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const plans = [
	{
		name: 'Starter',
		price: '0',
		description: 'Perfect for individuals and small teams',
		buttonText: 'Get Started',
		featured: false,
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
		price: '12',
		description: 'Ideal for growing teams and organizations',
		buttonText: 'Start Free Trial',
		featured: true,
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
		price: '29',
		description: 'Advanced features for large teams',
		buttonText: 'Contact Sales',
		featured: false,
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
