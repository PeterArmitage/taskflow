import { Nullable } from './helpers';

export interface DatePickerProps {
	value: Nullable<string>;
	onChange: (value: Nullable<string>) => void;
	className?: string;
	disabled?: boolean;
}
