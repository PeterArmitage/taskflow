'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconShieldLock,
	IconSettings,
	IconUsers,
	IconServer,
	IconBuildingSkyscraper,
	IconHeadset,
} from '@tabler/icons-react';
import { ContainerScroll } from '@/app/components/ui/container-scroll';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { WobbleCard } from '@/app/components/ui/wobble-card';

interface EnterpriseFeature {
	title: string;
	description: string;
	icon: typeof IconShieldLock;
}

const enterpriseFeatures: EnterpriseFeature[] = [
	{
		title: 'Advanced Security',
		description:
			'Enterprise-grade security with SSO, audit logs, and encryption at rest.',
		icon: IconShieldLock,
	},
	{
		title: 'Custom Deployment',
		description: 'Deploy on-premises or in your private cloud environment.',
		icon: IconServer,
	},
	{
		title: 'User Management',
		description: 'Advanced user roles, permissions, and access controls.',
		icon: IconUsers,
	},
	{
		title: 'Custom Integration',
		description: 'Connect with your existing enterprise tools and workflows.',
		icon: IconSettings,
	},
	{
		title: 'Scale With Confidence',
		description: 'Built to handle enterprise-scale workloads and teams.',
		icon: IconBuildingSkyscraper,
	},
	{
		title: 'Premium Support',
		description: '24/7 dedicated support with guaranteed response times.',
		icon: IconHeadset,
	},
];

const EnterpriseDemo = () => {
	return (
		<WobbleCard className='w-full p-8'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]'>
				{/* Security Dashboard */}
				<div className='col-span-2 bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Security Overview</h3>
					<div className='grid grid-cols-2 gap-4'>
						{[
							{ label: 'Security Score', value: '98%', status: 'Excellent' },
							{ label: 'Active Users', value: '1,247', status: 'Normal' },
							{ label: 'Data Encrypted', value: '100%', status: 'Protected' },
							{ label: 'Compliance', value: 'SOC2', status: 'Compliant' },
						].map((metric, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1 }}
								className='p-4 rounded bg-white/5'
							>
								<p className='text-sm text-neutral-400'>{metric.label}</p>
								<p className='text-2xl font-bold mt-1'>{metric.value}</p>
								<p className='text-xs text-green-400 mt-1'>{metric.status}</p>
							</motion.div>
						))}
					</div>

					<div className='mt-4 p-4 rounded bg-white/5'>
						<h4 className='text-sm font-medium mb-2'>Recent Activity</h4>
						<div className='space-y-2'>
							{[
								'SSO Integration Updated',
								'Backup Completed',
								'Security Scan Complete',
								'New Admin Added',
							].map((activity, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1 }}
									className='flex items-center gap-2 text-sm'
								>
									<div className='w-2 h-2 rounded-full bg-green-400' />
									{activity}
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Stats Panel */}
				<div className='bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>System Health</h3>
					<div className='space-y-4'>
						{[
							{ label: 'Uptime', value: '99.99%' },
							{ label: 'Response Time', value: '45ms' },
							{ label: 'Error Rate', value: '0.01%' },
						].map((stat, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.2 }}
								className='p-3 rounded bg-white/5'
							>
								<p className='text-sm text-neutral-400'>{stat.label}</p>
								<p className='text-xl font-bold'>{stat.value}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</WobbleCard>
	);
};

const EnterprisePage = () => {
	return (
		<div className='relative min-h-screen'>
			<AuroraBackground className='absolute top-0 h-full w-full opacity-40' />
			<div className='relative z-10 max-w-7xl mx-auto px-4 py-20'>
				{/* Hero Section */}
				<section className='text-center mb-20'>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-4xl md:text-6xl font-bold mb-6'
					>
						Enterprise-Grade Solutions
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Secure, scalable, and customizable solutions designed for the needs
						of large organizations.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className='flex gap-4 justify-center'
					>
						<Button variant='sketch' size='lg'>
							Contact Sales
						</Button>
						<Button variant='outline' size='lg'>
							View Demo
						</Button>
					</motion.div>
				</section>

				{/* Features Section */}
				<ContainerScroll
					titleComponent={
						<h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>
							Enterprise-ready features for global teams
						</h2>
					}
				>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
						{enterpriseFeatures.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className='relative p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/10 backdrop-blur-sm'
							>
								<div className='flex items-center gap-4 mb-4'>
									<feature.icon className='h-8 w-8 text-blue-500' />
									<h3 className='text-xl font-bold'>{feature.title}</h3>
								</div>
								<p className='text-neutral-600 dark:text-neutral-300'>
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</ContainerScroll>

				{/* Interactive Demo Section */}
				<section className='mb-20'>
					<h2 className='text-3xl font-bold text-center mb-10'>
						Enterprise Control Center
					</h2>
					<EnterpriseDemo />
				</section>

				{/* CTA Section */}
				<section className='text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Ready to scale your operations?
					</h2>
					<p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8'>
						Let&apos;s discuss how TaskFlow can help your organization
					</p>
					<Button variant='sketch' size='lg'>
						Schedule Consultation
					</Button>
				</section>
			</div>
		</div>
	);
};

export default EnterprisePage;
