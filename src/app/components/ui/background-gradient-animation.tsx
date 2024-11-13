'use client';
import { cn } from '@/lib/utils';

export const BackgroundGradientAnimation = ({
	gradientBackgroundStart = 'rgb(108, 0, 162)',
	gradientBackgroundEnd = 'rgb(0, 17, 82)',
	firstColor = '18, 113, 255',
	secondColor = '221, 74, 255',
	thirdColor = '100, 220, 255',
	pointerColor = '140, 100, 255',
	size = '80%',
	blendingValue = 'hard-light',
	children,
	className,
}: {
	gradientBackgroundStart?: string;
	gradientBackgroundEnd?: string;
	firstColor?: string;
	secondColor?: string;
	thirdColor?: string;
	pointerColor?: string;
	size?: string;
	blendingValue?: string;
	children?: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				'relative h-screen w-screen overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
				className
			)}
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;
				e.currentTarget.style.setProperty('--mouse-x', `${mouseX}px`);
				e.currentTarget.style.setProperty('--mouse-y', `${mouseY}px`);
			}}
			style={
				{
					'--gradient-background-start': gradientBackgroundStart,
					'--gradient-background-end': gradientBackgroundEnd,
					'--first-color': firstColor,
					'--second-color': secondColor,
					'--third-color': thirdColor,
					'--pointer-color': pointerColor,
					'--size': size,
					'--blending-value': blendingValue,
				} as React.CSSProperties
			}
		>
			<div className='relative z-10'>{children}</div>
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 z-[-1] bg-[radial-gradient(circle_farthest-side_at_var(--mouse-x,100px)_var(--mouse-y,100px),var(--pointer-color)_0%,transparent_100%)]' />
				<div className='absolute inset-0 z-[-1] opacity-[0.4] mix-blend-overlay bg-[radial-gradient(circle_at_0_0,var(--first-color)_0%,transparent_50%),radial-gradient(circle_at_100%_0%,var(--second-color)_0%,transparent_50%),radial-gradient(at_0%_100%,var(--second-color)_0%,transparent_50%),radial-gradient(at_100%_100%,var(--third-color)_0%,transparent_50%)]' />
			</div>
		</div>
	);
};
