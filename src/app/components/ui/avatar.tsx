// components/ui/avatar.tsx
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
	src?: string | null;
	fallback: string;
	className?: string;
}

export function Avatar({ src, fallback, className }: AvatarProps) {
	if (src) {
		return (
			<Image
				src={src}
				alt='Avatar'
				className={cn('rounded-full object-cover', className)}
			/>
		);
	}

	return (
		<div
			className={cn(
				'rounded-full bg-blue-500 flex items-center justify-center text-white font-medium',
				className
			)}
		>
			{fallback}
		</div>
	);
}
