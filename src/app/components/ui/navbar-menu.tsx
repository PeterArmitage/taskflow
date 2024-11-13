'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const transition = {
	type: 'spring',
	mass: 0.5,
	damping: 11.5,
	stiffness: 100,
	restDelta: 0.001,
	restSpeed: 0.001,
} as const;

interface MenuItemProps {
	setActive: (item: string | null) => void;
	active: string | null;
	item: string;
	children?: React.ReactNode;
	onClick?: () => void;
}

interface MenuItemPropsExternal {
	item: string;
	children?: React.ReactNode;
	onClick?: () => void;
}

interface MenuProps {
	setActive: (item: string | null) => void;
	children: React.ReactNode;
}

interface ProductItemProps {
	title: string;
	description: string;
	href: string;
	src: string;
}

interface HoveredLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
	className?: string;
}

function isMenuItemProps(
	props: MenuItemProps | MenuItemPropsExternal
): props is MenuItemProps {
	return 'setActive' in props && 'active' in props;
}

export const MenuItem: React.FC<MenuItemProps | MenuItemPropsExternal> = (
	props
) => {
	const { item, children, onClick } = props;

	const handleMouseEnter = () => {
		if (isMenuItemProps(props)) {
			props.setActive(item);
		}
	};

	return (
		<div onMouseEnter={handleMouseEnter} onClick={onClick} className='relative'>
			<motion.p
				transition={{ duration: 0.3 }}
				className='cursor-pointer text-slate-500 font-medium hover:text-black/80 transition-colors'
			>
				{item}
			</motion.p>
			{isMenuItemProps(props) && props.active !== null && (
				<motion.div
					initial={{ opacity: 0, scale: 0.85, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={transition}
				>
					{props.active === item && (
						<div className='absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4'>
							<motion.div
								transition={transition}
								layoutId='active'
								className='bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl'
							>
								<motion.div layout className='w-max h-full p-4'>
									{children}
								</motion.div>
							</motion.div>
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
};

export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
	const [activeItem, setActiveItem] = React.useState<string | null>(null);

	const handleMouseLeave = () => {
		setActiveItem(null);
		setActive(null);
	};

	// Type-safe child cloning
	const childrenWithProps = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child as React.ReactElement<MenuItemProps>, {
				active: activeItem,
				setActive: (item: string | null) => {
					setActiveItem(item);
					setActive(item);
				},
			});
		}
		return child;
	});

	return (
		<nav
			onMouseLeave={handleMouseLeave}
			className='relative rounded-full border border-transparent dark:bg-black dark:border-white/[0.2] shadow-input flex justify-center space-x-4 px-8 py-6'
		>
			{childrenWithProps}
		</nav>
	);
};

export const ProductItem: React.FC<ProductItemProps> = ({
	title,
	description,
	href,
	src,
}) => {
	return (
		<Link href={href} className='flex space-x-2'>
			<Image
				src={src}
				width={140}
				height={70}
				alt={title}
				className='flex-shrink-0 rounded-md shadow-2xl'
			/>
			<div>
				<h4 className='text-xl font-bold mb-1 text-black dark:text-white'>
					{title}
				</h4>
				<p className='text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300'>
					{description}
				</p>
			</div>
		</Link>
	);
};

export const HoveredLink: React.FC<HoveredLinkProps> = ({
	children,
	className,
	...rest
}) => {
	return (
		<Link
			{...rest}
			className={cn(
				'text-neutral-700 dark:text-neutral-200 hover:text-black',
				className
			)}
		>
			{children}
		</Link>
	);
};
