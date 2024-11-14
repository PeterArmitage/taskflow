'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { IconCheck } from '@tabler/icons-react';
import { AuroraBackground } from '@/app/components/ui/aurora-background';

interface PricingTier {
	name: string;
	price: string;
	description: string;
	features: string[];
	highlighted?: boolean;
	ctaText: string;
}

const pricingTiers: PricingTier[] = [
	{
		name: 'Free',
		price: '$0',
		description: 'Perfect for individuals and small teams',
		features: [
			'Up to 3 boards',
			'Basic automation',
			'1GB storage',
			'Core integrations',
			'iOS & Android apps',
			'2 weeks history',
		],
		ctaText: 'Get Started',
	},
	{
		name: 'Professional',
		price: '$12',
		description: 'Ideal for growing teams and organizations',
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
		highlighted: true,
		ctaText: 'Start Free Trial',
	},
	{
		name: 'Enterprise',
		price: '$29',
		description: 'Advanced features for large teams',
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
		ctaText: 'Contact Sales',
	},
];

const PricingCard = ({ tier }: { tier: PricingTier }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			whileHover={{ y: -5 }}
			className={`relative p-8 rounded-2xl border ${
				tier.highlighted
					? 'border-blue-500 dark:border-blue-400'
					: 'border-neutral-200 dark:border-neutral-800'
			} bg-white/10 backdrop-blur-sm`}
		>
			{tier.highlighted && (
				<div className='absolute -top-4 left-0 right-0 flex justify-center'>
					<div className='px-4 py-1 bg-blue-500 text-white text-sm font-bold rounded-full'>
						Most Popular
					</div>
				</div>
			)}

			<div className='mb-8'>
				<h3 className='text-2xl font-bold mb-2'>{tier.name}</h3>
				<div className='mb-4'>
					<span className='text-4xl font-bold'>{tier.price}</span>
					<span className='text-neutral-600 dark:text-neutral-400'>/month</span>
				</div>
				<p className='text-neutral-600 dark:text-neutral-400'>
					{tier.description}
				</p>
			</div>

			<ul className='space-y-4 mb-8'>
				{tier.features.map((feature, index) => (
					<li key={index} className='flex items-center gap-2'>
						<IconCheck className='h-5 w-5 text-green-500 flex-shrink-0' />
						<span>{feature}</span>
					</li>
				))}
			</ul>

			<Button
				variant={tier.highlighted ? 'sketch' : 'outline'}
				className='w-full'
				size='lg'
			>
				{tier.ctaText}
			</Button>
		</motion.div>
	);
};

const PricingPage = () => {
	return (
		<div className='relative min-h-screen'>
			<AuroraBackground className='absolute top-0 h-full w-full opacity-40' />
			<div className='relative z-10 max-w-7xl mx-auto px-4 py-20'>
				<section className='text-center mb-20'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-bold mb-6'
					>
						Simple, transparent pricing
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Choose the plan that&apos;s right for you. All plans include a
						14-day free trial.
					</motion.p>

					<div className='flex justify-center gap-4 mb-12'>
						<Button variant='outline'>Monthly Billing</Button>
						<Button variant='outline'>
							Annual Billing
							<span className='ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full'>
								Save 20%
							</span>
						</Button>
					</div>
				</section>

				<div className='grid md:grid-cols-3 gap-8 mb-20'>
					{pricingTiers.map((tier) => (
						<PricingCard key={tier.name} tier={tier} />
					))}
				</div>

				<section className='text-center max-w-3xl mx-auto'>
					<h2 className='text-3xl font-bold mb-6'>
						Frequently Asked Questions
					</h2>
					<div className='space-y-6 text-left'>
						{[
							{
								q: 'Can I change plans later?',
								a: 'Yes, you can upgrade or downgrade your plan at any time.',
							},
							{
								q: 'What payment methods do you accept?',
								a: 'We accept all major credit cards and PayPal.',
							},
							{
								q: 'Is there a long-term contract?',
								a: 'No, all plans are month-to-month with no long-term commitment.',
							},
						].map((faq, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1 }}
								className='border-b border-neutral-200 dark:border-neutral-800 pb-4'
							>
								<h3 className='font-semibold mb-2'>{faq.q}</h3>
								<p className='text-neutral-600 dark:text-neutral-400'>
									{faq.a}
								</p>
							</motion.div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default PricingPage;
