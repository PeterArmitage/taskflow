'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { SelectSingleEventHandler } from 'react-day-picker';
import { Nullable } from '@/app/types/helpers';

interface DatePickerProps {
	value: Nullable<string>;
	onChange: (value: Nullable<string>) => void;
	disabled?: boolean; // Added disabled prop
	className?: string;
}

export function DatePicker({
	value,
	onChange,
	disabled = false,
	className,
}: DatePickerProps) {
	// Convert ISO string to Date for the Calendar component
	const getDateFromValue = (): Date | undefined => {
		if (!value) return undefined;
		const date = new Date(value);
		return isNaN(date.getTime()) ? undefined : date;
	};

	// Handle calendar selection
	const handleSelect: SelectSingleEventHandler = (selectedDate) => {
		if (disabled) return;
		if (!selectedDate) {
			onChange(null);
			return;
		}
		onChange(selectedDate.toISOString());
	};

	const displayDate = getDateFromValue();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'w-full justify-start text-left font-normal',
						!displayDate && 'text-muted-foreground',
						disabled && 'opacity-50 cursor-not-allowed',
						className
					)}
					disabled={disabled}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{displayDate ? format(displayDate, 'PPP') : <span>Set due date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0' align='start'>
				<Calendar
					mode='single'
					selected={displayDate}
					onSelect={handleSelect}
					disabled={disabled}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
