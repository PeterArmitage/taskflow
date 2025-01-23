import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { type Label } from '@/app/types/boards';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface LabelDisplayBaseProps {
	label: Label;
	onDelete?: () => void;
	disabled?: boolean;
	className?: string;
	showDelete?: boolean;
	interactive?: boolean;
	tooltipText?: string;
}

export function LabelDisplay({
	label,
	onDelete,
	disabled = false,
	className,
	showDelete = true,
	interactive = true,
	tooltipText,
}: LabelDisplayBaseProps) {
	const [isHovered, setIsHovered] = useState(false);
	useEffect(() => {
		console.log('Label display data:', {
			label,
			hasDescription: Boolean(label.description),
		});
	}, [label]);
	console.log('Label data:', label, 'tooltipText:', tooltipText);

	const getContrastColor = (hexcolor: string) => {
		const r = parseInt(hexcolor.slice(1, 3), 16);
		const g = parseInt(hexcolor.slice(3, 5), 16);
		const b = parseInt(hexcolor.slice(5, 7), 16);
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		return luminance > 0.5 ? '#000000' : '#FFFFFF';
	};

	const textColor = getContrastColor(label.color);

	const labelContent = (
		<div className='relative mb-12'>
			<motion.div
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				whileHover={interactive ? { scale: 1.02, zIndex: 10 } : undefined}
				whileTap={interactive ? { scale: 0.98 } : undefined}
				className={cn(
					'inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm relative',
					disabled && 'opacity-70 cursor-not-allowed',
					interactive && 'cursor-pointer',
					isHovered && 'shadow-lg z-50',
					className
				)}
				style={{
					backgroundColor: label.color,
					color: textColor,
				}}
			>
				<span className='truncate'>{label.name}</span>
				{showDelete && onDelete && !disabled && (
					<Button
						variant='ghost'
						size='icon'
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className={cn(
							'p-1 h-4 w-4 rounded-full hover:bg-black/20',
							'focus:ring-2 focus:ring-white/20',
							'transition-colors'
						)}
					>
						<IconX className='w-3 h-3' />
						<span className='sr-only'>Remove {label.name} label</span>
					</Button>
				)}

				{/* Use label.description directly */}
				{isHovered && (label.description || tooltipText) && (
					<motion.div
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						className='absolute left-0 top-full mt-2 p-2 rounded-lg bg-black/80 text-white text-xs max-w-[200px] z-[60]'
					>
						<p className='line-clamp-2'>{label.description || tooltipText}</p>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
	if (tooltipText) {
		return (
			<div className='relative'>
				{labelContent}
				{isHovered && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='fixed inset-0 bg-black/5 pointer-events-none'
						style={{ zIndex: 5 }}
					/>
				)}
			</div>
		);
	}

	return labelContent;
}

// Export a group version of the component for displaying multiple labels
export function LabelGroup({
	labels,
	onDelete,
	disabled,
	className,
	limit,
}: {
	labels: Label[];
	onDelete?: (labelId: number) => void;
	disabled?: boolean;
	className?: string;
	limit?: number;
}) {
	const displayLabels = limit ? labels.slice(0, limit) : labels;
	const remaining = labels.length - (limit || labels.length);

	return (
		<div className={cn('flex flex-wrap gap-1', className)}>
			{displayLabels.map((label) => (
				<LabelDisplay
					key={label.id}
					label={label}
					onDelete={onDelete ? () => onDelete(label.id) : undefined}
					disabled={disabled}
					tooltipText={label.description}
				/>
			))}
			{remaining > 0 && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='inline-flex items-center px-2 py-1 rounded-full text-sm bg-neutral-200 dark:bg-neutral-800'>
								+{remaining} more
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<div className='space-y-1'>
								{labels.slice(limit).map((label) => (
									<div key={label.id} className='text-sm'>
										{label.name}
									</div>
								))}
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}

// Small variant for compact displays
export function LabelBadge({
	label,
	className,
}: {
	label: Label;
	className?: string;
}) {
	return (
		<LabelDisplay
			label={label}
			showDelete={false}
			interactive={false}
			className={cn('text-xs px-1.5 py-0.5', className)}
		/>
	);
}
