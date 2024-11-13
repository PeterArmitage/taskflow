// components/landing/testimonials.tsx
'use client';
import { AnimatedTestimonials } from '../ui/animated-testimonials';

export const Testimonials = () => {
	const testimonials = [
		{
			quote:
				'TaskFlow has completely transformed how our team collaborates. The customizable workflows and real-time updates have made our projects run smoother than ever.',
			name: 'Sarah Chen',
			designation: 'Engineering Director at Tech Solutions Inc',
			src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80',
		},
		{
			quote:
				"We've tried many project management tools, but TaskFlow stands out with its intuitive interface and powerful features. It's become essential for our daily operations.",
			name: 'Marcus Rodriguez',
			designation: 'Product Manager at Digital Innovations',
			src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
		},
		{
			quote:
				'The automation features in TaskFlow have saved our team countless hours. What used to take days now happens automatically in the background.',
			name: 'Emily Watson',
			designation: 'Operations Lead at Creative Studios',
			src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&h=400&q=80',
		},
	];

	return (
		<section className='relative py-20 bg-black/95'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center mb-20'>
					<h2 className='text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100'>
						Loved by teams worldwide
					</h2>
					<p className='mt-4 text-lg text-neutral-300'>
						Join thousands of teams that rely on TaskFlow every day
					</p>
				</div>

				<AnimatedTestimonials testimonials={testimonials} autoplay={true} />
			</div>
		</section>
	);
};
