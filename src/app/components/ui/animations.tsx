// components/ui/animations.tsx
'use client';
import { motion } from 'framer-motion';

// Fade In animation
export const FadeIn = ({
	children,
	className,
	delay = 0,
	duration = 0.5,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration, delay }}
			viewport={{ once: true }}
			className={className}
		>
			{children}
		</motion.div>
	);
};

// Slide In animation
export const SlideIn = ({
	children,
	className,
	direction = 'left',
	delay = 0,
	duration = 0.5,
}: {
	children: React.ReactNode;
	className?: string;
	direction?: 'left' | 'right' | 'up' | 'down';
	delay?: number;
	duration?: number;
}) => {
	const directionMap = {
		left: { x: -100, y: 0 },
		right: { x: 100, y: 0 },
		up: { x: 0, y: -100 },
		down: { x: 0, y: 100 },
	};

	return (
		<motion.div
			initial={{ opacity: 0, ...directionMap[direction] }}
			whileInView={{ opacity: 1, x: 0, y: 0 }}
			transition={{ duration, delay }}
			viewport={{ once: true }}
			className={className}
		>
			{children}
		</motion.div>
	);
};

// Scale animation
export const ScaleIn = ({
	children,
	className,
	delay = 0,
	duration = 0.5,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	duration?: number;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			whileInView={{ opacity: 1, scale: 1 }}
			transition={{ duration, delay }}
			viewport={{ once: true }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
