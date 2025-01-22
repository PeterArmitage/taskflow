import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	disabled?: boolean;
	className?: string;
}

const COLORS = [
	{ value: '#ef4444', label: 'Red' },
	{ value: '#f97316', label: 'Orange' },
	{ value: '#f59e0b', label: 'Amber' },
	{ value: '#84cc16', label: 'Lime' },
	{ value: '#10b981', label: 'Emerald' },
	{ value: '#06b6d4', label: 'Cyan' },
	{ value: '#3b82f6', label: 'Blue' },
	{ value: '#8b5cf6', label: 'Violet' },
	{ value: '#d946ef', label: 'Pink' },
	{ value: '#f43f5e', label: 'Rose' },
	{ value: '#64748b', label: 'Gray' },
	{ value: '#1e293b', label: 'Slate' },
];

export function ColorPicker({
	value,
	onChange,
	disabled = false,
	className,
}: ColorPickerProps) {
	return (
		<div className={cn('grid grid-cols-6 gap-2', className)}>
			{COLORS.map((color) => (
				<motion.button
					key={color.value}
					type='button'
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => !disabled && onChange(color.value)}
					className={cn(
						'w-8 h-8 rounded-full flex items-center justify-center',
						'transition-shadow duration-200',
						'focus:outline-none focus:ring-2 focus:ring-offset-2',
						disabled && 'opacity-50 cursor-not-allowed',
						value === color.value && 'ring-2 ring-offset-2'
					)}
					style={{ backgroundColor: color.value }}
					title={color.label}
					disabled={disabled}
					aria-label={`Select ${color.label} color`}
				>
					{value === color.value && (
						<Check
							className={cn(
								'w-4 h-4',
								parseInt(color.value.slice(1), 16) > 0x7fffff
									? 'text-black'
									: 'text-white'
							)}
						/>
					)}
				</motion.button>
			))}
		</div>
	);
}
