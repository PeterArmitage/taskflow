// components/landing/solutions.tsx
'use client';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export const Solutions = () => {
	return (
		<section className='relative h-[40rem] flex flex-col items-center justify-center overflow-hidden bg-white'>
			{/* Background decoration */}
			<div className='absolute inset-0 w-full h-full bg-white dark:bg-black/[0.96] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]' />

			<h2 className='text-3xl md:text-5xl font-bold text-center mb-8 relative z-10'>
				Trusted by teams of all sizes
			</h2>
			<p className='text-base md:text-lg text-neutral-600 mb-12 text-center max-w-lg relative z-10'>
				From small teams to large enterprises, TaskFlow adapts to how your team
				works
			</p>

			<InfiniteMovingCards items={solutions} direction='right' speed='slow' />
		</section>
	);
};

// components/landing/solutions.tsx
export const InfiniteMovingCards = ({
	items,
	direction = 'left',
	speed = 'fast',
	pauseOnHover = true,
}: {
	items: {
		quote: string;
		name: string;
		title: string;
		image: string;
	}[];
	direction?: 'left' | 'right';
	speed?: 'fast' | 'slow';
	pauseOnHover?: boolean;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLUListElement>(null);
	const [start, setStart] = useState(false);

	const getDirection = useCallback(() => {
		if (containerRef.current) {
			if (direction === 'left') {
				containerRef.current.style.setProperty(
					'--animation-direction',
					'forwards'
				);
			} else {
				containerRef.current.style.setProperty(
					'--animation-direction',
					'reverse'
				);
			}
		}
	}, [direction]);

	const getSpeed = useCallback(() => {
		if (containerRef.current) {
			if (speed === 'fast') {
				containerRef.current.style.setProperty('--animation-duration', '20s');
			} else {
				containerRef.current.style.setProperty('--animation-duration', '40s');
			}
		}
	}, [speed]);

	useEffect(() => {
		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);

			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				if (scrollerRef.current) {
					scrollerRef.current.appendChild(duplicatedItem);
				}
			});

			getDirection();
			getSpeed();
			setStart(true);
		}
	}, [getDirection, getSpeed]);

	return (
		<div
			ref={containerRef}
			className={cn(
				'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
				pauseOnHover && 'hover:[animation-play-state:paused]'
			)}
		>
			<ul
				ref={scrollerRef}
				className={cn(
					'flex min-w-full shrink-0 gap-4 py-4',
					start && 'animate-scroll',
					pauseOnHover && 'hover:[animation-play-state:paused]'
				)}
			>
				{items.map((item, idx) => (
					<li
						key={idx}
						className='w-[350px] max-w-full relative rounded-2xl border border-gray-200 px-8 py-6 flex-shrink-0 bg-white shadow-sm transition-all hover:shadow-md'
					>
						<blockquote>
							<div className='relative z-20'>
								<p className='text-sm leading-relaxed text-gray-700'>
									{item.quote}
								</p>
								<div className='relative z-20 mt-6 flex flex-row items-center'>
									<Image
										src={item.image}
										alt={item.name}
										height={40}
										width={40}
										className='h-10 w-10 rounded-full object-cover'
									/>
									<div className='ml-4'>
										<p className='font-semibold text-sm text-gray-900'>
											{item.name}
										</p>
										<p className='text-sm text-gray-600'>{item.title}</p>
									</div>
								</div>
							</div>
						</blockquote>
					</li>
				))}
			</ul>
		</div>
	);
};

// components/landing/solutions.tsx
const solutions = [
	{
		quote:
			'TaskFlow revolutionized our sprint planning and bug tracking. Perfect for our agile workflows.',
		name: 'Development Teams',
		title: 'Agile Project Management',
		image:
			'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
	},
	{
		quote:
			'Managing our content calendar and campaign workflows has never been easier.',
		name: 'Marketing Teams',
		title: 'Campaign Management',
		image:
			'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=200&h=200&q=80',
	},
	{
		quote:
			"We track our entire product roadmap and feature releases here. It's transformed our workflow.",
		name: 'Product Teams',
		title: 'Product Development',
		image:
			'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&h=200&q=80',
	},
	{
		quote:
			'The perfect tool for visualizing our sales pipeline and keeping track of deals.',
		name: 'Sales Teams',
		title: 'Sales Pipeline',
		image:
			'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&h=200&q=80',
	},
	{
		quote:
			'Streamlined our entire employee onboarding process. New hires love it!',
		name: 'HR Teams',
		title: 'HR Operations',
		image:
			'https://images.unsplash.com/photo-1542190891-2093d38760f2?auto=format&fit=crop&w=200&h=200&q=80',
	},
	{
		quote:
			'From planning to execution, every event detail is perfectly organized.',
		name: 'Event Teams',
		title: 'Event Planning',
		image:
			'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=200&h=200&q=80',
	},
];
