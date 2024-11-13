// components/ui/button.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'sketch';
	size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'default', ...props }, ref) => {
		const baseStyles = 'transition duration-200';
		const variants = {
			default: 'bg-blue-600 text-white hover:bg-blue-700',
			outline: 'border border-gray-300 hover:bg-gray-50',
			sketch:
				'border border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:border-white dark:text-white dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)]',
		};

		const sizes = {
			default: 'px-4 py-2 text-sm',
			sm: 'px-3 py-1.5 text-sm',
			lg: 'px-6 py-3 text-base',
		};

		return (
			<button
				className={cn(
					baseStyles,
					variants[variant],
					sizes[size],
					'rounded-md',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = 'Button';

export { Button };
