'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Base64 encoded noise texture
const noiseTexture = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAAAAAB3tzPbAAACOUlEQVR4Ae3aCQrrIBRG4e5/Tz+CBAlIkIAECUjoSt48z/GZeAvnrOB7N8fYbwDAAAAAAAAAAAAAYHq79XbO+P2HfMspZ13ydWcNh3yvVUP/hHxvX9B9JORjezdM8zsEH9u49rL+JR9etEYr/1+If6V9Rdf/FeJ3p1TL+rdC/O9Q0JU0/sDfVBaMhfi5WmuUzP8K8XsdS0aQuU2In2vbHOL/uXzD7BNBz1WjZ5pb41wJ9bPU9CoZUfN8Cv1c/SSgflbpGeometridaeH3XkCCNcRqFnNhRgs2BPRW+nJ/CmyoYKOBmsW82lGCzQE9lb7cn8IbKhhooGYxr3aUYHNAT6Uv96fAhgo2GqhZzKsdJdgc0FPpy/0psKGCjQZqFvNqRwk2B/RU+nJ/CmyoYKOBmsW82lGCzQE9lb7cnwIbKthooGYxr3aUYAE9lb7cnwIbKthooGYxr3aUYHNAT6Uv96fAhgo2GqhZzKsdJdgc0FPpy/0psKGCjQZqFvNqRwk2B/RU+nJ/CmyoYKOBmsW82lGCzQE9lb7cnwIbKthooGYxr3aUYHNAT6Uv96fAhgo2GqhZzKsdJdgc0FPpy/0psKGCjQZqFvNqRwk2B/RU+nJ/CmyoYKOBmsW82lGCzQE9lb7cnwIbKthooGYxr3aUYHNAT6Uv96fAhgo2GqhZzKsdJdgc0FPpy/0psKGCgQZqFvNmRwk2AfS+9QEAAAAAAAAAAAAAAGB6PwAAAP//VbWqOqPoQYoAAAAASUVORK5CYII=`;

export const WobbleCard = ({
	children,
	containerClassName,
	className,
}: {
	children: React.ReactNode;
	containerClassName?: string;
	className?: string;
}) => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
		const { clientX, clientY } = event;
		const rect = event.currentTarget.getBoundingClientRect();
		const x = (clientX - (rect.left + rect.width / 2)) / 20;
		const y = (clientY - (rect.top + rect.height / 2)) / 20;
		setMousePosition({ x, y });
	};

	return (
		<motion.section
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => {
				setIsHovering(false);
				setMousePosition({ x: 0, y: 0 });
			}}
			style={{
				transform: isHovering
					? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
					: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
				transition: 'transform 0.1s ease-out',
			}}
			className={cn(
				'mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden',
				containerClassName
			)}
		>
			<div
				className='relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden'
				style={{
					boxShadow:
						'0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)',
				}}
			>
				<motion.div
					style={{
						transform: isHovering
							? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
							: 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
						transition: 'transform 0.1s ease-out',
					}}
					className={cn('h-full px-4 py-20 sm:px-10', className)}
				>
					<div
						className='absolute inset-0 w-full h-full scale-[1.2] transform opacity-10'
						style={{
							backgroundImage: `url(${noiseTexture})`,
							backgroundSize: '30%',
							maskImage: 'radial-gradient(#fff,transparent,75%)',
						}}
					/>
					{children}
				</motion.div>
			</div>
		</motion.section>
	);
};
