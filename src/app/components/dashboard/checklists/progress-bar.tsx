// components/dashboard/checklists/progress-bar.tsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
	progress: number;
	className?: string;
}

export const ProgressBar = memo(function ProgressBar({
	progress,
	className,
}: ProgressBarProps) {
	const percentage = Math.round(progress);

	return (
		<div className={cn('space-y-1', className)}>
			<div className='flex justify-between text-sm text-neutral-500'>
				<span>{percentage}%</span>
				<span>Complete</span>
			</div>
			<div className='h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden'>
				<motion.div
					className='h-full bg-blue-500'
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 0.3 }}
				/>
			</div>
		</div>
	);
});
