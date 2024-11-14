'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import {
	IconChartBar,
	IconReportAnalytics,
	IconDashboard,
	IconChartPie,
	IconTrendingUp,
	IconBellRinging,
} from '@tabler/icons-react';
import { ContainerScroll } from '@/app/components/ui/container-scroll';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { WobbleCard } from '@/app/components/ui/wobble-card';

interface AnalyticsFeature {
	title: string;
	description: string;
	icon: typeof IconChartBar;
}

const analyticsFeatures: AnalyticsFeature[] = [
	{
		title: 'Custom Dashboards',
		description: 'Create personalized dashboards with drag-and-drop widgets.',
		icon: IconDashboard,
	},
	{
		title: 'Advanced Reports',
		description: 'Generate detailed reports with custom filters and metrics.',
		icon: IconReportAnalytics,
	},
	{
		title: 'Performance Metrics',
		description: 'Track team and project performance with key metrics.',
		icon: IconChartBar,
	},
	{
		title: 'Data Visualization',
		description: 'Visualize trends with interactive charts and graphs.',
		icon: IconChartPie,
	},
	{
		title: 'Trend Analysis',
		description: 'Identify patterns and trends in your project data.',
		icon: IconTrendingUp,
	},
	{
		title: 'Smart Alerts',
		description: 'Get notified about important metric changes automatically.',
		icon: IconBellRinging,
	},
];

const AnalyticsDemo = () => {
	return (
		<WobbleCard className='w-full p-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]'>
				{/* Charts Section */}
				<div className='space-y-4'>
					{/* Productivity Chart */}
					<div className='bg-white/10 rounded-lg p-4 h-[180px]'>
						<h3 className='text-sm font-medium mb-4'>Team Productivity</h3>
						<div className='flex items-end h-20 gap-2'>
							{[60, 80, 65, 85, 75, 90, 70].map((height, i) => (
								<motion.div
									key={i}
									initial={{ height: 0 }}
									animate={{ height: `${height}%` }}
									transition={{ delay: i * 0.1, duration: 0.4 }}
									className='flex-1 bg-blue-500/50 rounded-t'
								/>
							))}
						</div>
						<div className='flex justify-between mt-2 text-xs text-neutral-400'>
							<span>Mon</span>
							<span>Sun</span>
						</div>
					</div>

					{/* Task Completion Chart */}
					<div className='bg-white/10 rounded-lg p-4 h-[180px]'>
						<h3 className='text-sm font-medium mb-4'>Task Completion Rate</h3>
						<div className='relative h-24'>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: '85%' }}
								transition={{ duration: 1 }}
								className='absolute top-0 h-8 bg-green-500/50 rounded'
							/>
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: '65%' }}
								transition={{ duration: 1, delay: 0.2 }}
								className='absolute top-12 h-8 bg-yellow-500/50 rounded'
							/>
						</div>
						<div className='flex justify-between mt-2 text-xs'>
							<span className='text-green-400'>This Week</span>
							<span className='text-yellow-400'>Last Week</span>
						</div>
					</div>
				</div>

				{/* Metrics Section */}
				<div className='bg-white/10 rounded-lg p-4'>
					<h3 className='text-sm font-medium mb-4'>Key Metrics</h3>
					<div className='grid grid-cols-2 gap-4'>
						{[
							{ label: 'Tasks Completed', value: '127', change: '+12%' },
							{ label: 'Active Projects', value: '8', change: '+2' },
							{ label: 'Team Velocity', value: '94%', change: '+5%' },
							{ label: 'On-time Delivery', value: '91%', change: '+3%' },
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
								<p className='text-xs text-green-400 mt-1'>{metric.change}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</WobbleCard>
	);
};

const AnalyticsPage = () => {
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
						Data-Driven Insights
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto'
					>
						Transform your project data into actionable insights with powerful
						analytics and reporting tools.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Button variant='sketch' size='lg'>
							Explore Analytics
						</Button>
					</motion.div>
				</section>

				{/* Features Section */}
				<ContainerScroll
					titleComponent={
						<h2 className='text-3xl md:text-4xl font-bold text-center mb-10'>
							Powerful analytics tools at your fingertips
						</h2>
					}
				>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
						{analyticsFeatures.map((feature, index) => (
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
						Analytics in action
					</h2>
					<AnalyticsDemo />
				</section>

				{/* CTA Section */}
				<section className='text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6'>
						Make better decisions with data
					</h2>
					<p className='text-xl text-neutral-600 dark:text-neutral-300 mb-8'>
						Start turning your project data into actionable insights
					</p>
					<Button variant='sketch' size='lg'>
						Get Started Free
					</Button>
				</section>
			</div>
		</div>
	);
};

export default AnalyticsPage;
