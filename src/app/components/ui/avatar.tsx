// components/ui/avatar.tsx
import { User } from '@/app/types/auth';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
	src?: string | null;
	fallback: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, fallback, className, size = 'md' }: AvatarProps) {
	const sizeClasses = {
		sm: 'w-6 h-6 text-xs',
		md: 'w-8 h-8 text-sm',
		lg: 'w-10 h-10 text-base',
	};

	if (src) {
		return (
			<Image
				src={src}
				alt={fallback}
				width={size === 'lg' ? 40 : size === 'md' ? 32 : 24}
				height={size === 'lg' ? 40 : size === 'md' ? 32 : 24}
				className={cn(
					'rounded-full object-cover',
					sizeClasses[size],
					className
				)}
			/>
		);
	}

	return (
		<div
			className={cn(
				'rounded-full bg-blue-500 flex items-center justify-center text-white font-medium',
				sizeClasses[size],
				className
			)}
		>
			{fallback}
		</div>
	);
}
