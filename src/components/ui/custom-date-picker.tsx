import DatePicker from 'react-datepicker';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Nullable } from '@/app/types/helpers';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
	value: Nullable<string>;
	onChange: (date: Nullable<string>) => void;
	disabled?: boolean;
	className?: string;
}

export function CustomDatePicker({
	value,
	onChange,
	disabled = false,
	className,
}: CustomDatePickerProps) {
	const dateValue = value ? new Date(value) : null;

	const CustomInput = forwardRef<
		HTMLButtonElement,
		{ value?: string; onClick?: () => void }
	>(({ value, onClick }, ref) => (
		<Button
			type='button'
			variant='outline'
			ref={ref}
			onClick={onClick}
			disabled={disabled}
			className={cn(
				'w-full justify-start text-left font-normal',
				!value && 'text-muted-foreground',
				className
			)}
		>
			<CalendarIcon className='mr-2 h-4 w-4' />
			{value || 'Pick a date'}
		</Button>
	));

	CustomInput.displayName = 'CustomInput';

	return (
		<div className='relative'>
			<DatePicker
				selected={dateValue}
				onChange={(date: Date | null) => {
					onChange(date?.toISOString() ?? null);
				}}
				customInput={<CustomInput />}
				disabled={disabled}
				dateFormat='PPP'
				minDate={new Date()}
				isClearable
				popperProps={{
					strategy: 'fixed',
				}}
				wrapperClassName='w-full'
			/>
		</div>
	);
}
