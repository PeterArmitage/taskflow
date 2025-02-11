// components/dashboard/activity/activity-feed-skeleton.tsx
import { motion } from 'framer-motion';

export function ActivityFeedSkeleton() {
	// Create an array of 5 skeleton items
	const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

	return (
		<div className='space-y-6'>
			{/* Date group skeleton */}
			<div>
				<div className='h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3 animate-pulse' />

				<div className='space-y-4'>
					{skeletonItems.map((index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className='flex items-start gap-3'
						>
							{/* Avatar skeleton */}
							<div className='w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse' />

							<div className='flex-1 space-y-2'>
								{/* Username and timestamp skeleton */}
								<div className='flex items-center gap-2'>
									<div className='h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
									<div className='h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
								</div>

								{/* Activity content skeleton */}
								<div className='h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
							</div>
						</motion.div>
					))}
				</div>
			</div>

			{/* Second date group skeleton */}
			<div>
				<div className='h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-3 animate-pulse' />

				<div className='space-y-4'>
					{skeletonItems.slice(0, 3).map((index) => (
						<motion.div
							key={`second-${index}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: (index + 5) * 0.1 }}
							className='flex items-start gap-3'
						>
							<div className='w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse' />
							<div className='flex-1 space-y-2'>
								<div className='flex items-center gap-2'>
									<div className='h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
									<div className='h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
								</div>
								<div className='h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse' />
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
