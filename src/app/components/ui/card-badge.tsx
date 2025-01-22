// components/ui/card-badge.tsx
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { IconCalendar } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface DueDateBadgeProps {
	dueDate: string;
	className?: string;
}

export const DueDateBadge = ({ dueDate, className }: DueDateBadgeProps) => {
	const date = new Date(dueDate);
	const isOverdue = date < new Date();
	const isPending =
		!isOverdue && date.getTime() - new Date().getTime() < 86400000; // 24 hours

	return (
		<motion.div
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.98 }}
			className={cn(
				'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
				isOverdue
					? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
					: isPending
						? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
						: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
				className
			)}
		>
			<IconCalendar className='w-3.5 h-3.5' />
			<span>{format(date, 'MMM d')}</span>
		</motion.div>
	);
};
