// components/landing/footer.tsx
import Link from 'next/link';
import {
	IconBrandGithub,
	IconBrandTwitter,
	IconBrandLinkedin,
} from '@tabler/icons-react';

export const Footer = () => {
	return (
		<footer className='bg-black text-white py-16'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='grid grid-cols-2 md:grid-cols-5 gap-8 mb-8'>
					<div className='col-span-2'>
						<Link href='/' className='text-2xl font-bold mb-4 block'>
							TaskFlow
						</Link>
						<p className='text-neutral-400 mb-4 max-w-xs'>
							Streamline your workflow, boost productivity, and achieve more
							with TaskFlow.
						</p>
						<div className='flex space-x-4'>
							<Link href='#' className='hover:text-blue-500 transition-colors'>
								<IconBrandTwitter className='h-6 w-6' />
							</Link>
							<Link href='#' className='hover:text-blue-500 transition-colors'>
								<IconBrandGithub className='h-6 w-6' />
							</Link>
							<Link href='#' className='hover:text-blue-500 transition-colors'>
								<IconBrandLinkedin className='h-6 w-6' />
							</Link>
						</div>
					</div>

					{footerLinks.map((section) => (
						<div key={section.title}>
							<h3 className='font-semibold mb-4'>{section.title}</h3>
							<ul className='space-y-2'>
								{section.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className='text-neutral-400 hover:text-white transition-colors'
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className='border-t border-neutral-800 pt-8 mt-8 text-center md:flex md:justify-between md:text-left'>
					<p className='text-neutral-400 mb-4 md:mb-0'>
						© {new Date().getFullYear()} TaskFlow. All rights reserved.
					</p>
					<div className='space-x-6'>
						<Link
							href='#'
							className='text-neutral-400 hover:text-white transition-colors'
						>
							Privacy Policy
						</Link>
						<Link
							href='#'
							className='text-neutral-400 hover:text-white transition-colors'
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

const footerLinks = [
	{
		title: 'Product',
		links: [
			{ name: 'Features', href: '#features' },
			{ name: 'Integrations', href: '#integrations' },
			{ name: 'Pricing', href: '#pricing' },
			{ name: 'Changelog', href: '#' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ name: 'Documentation', href: '#' },
			{ name: 'Guides', href: '#' },
			{ name: 'Tutorial', href: '#' },
			{ name: 'API Reference', href: '#' },
		],
	},
	{
		title: 'Company',
		links: [
			{ name: 'About', href: '#' },
			{ name: 'Blog', href: '#' },
			{ name: 'Careers', href: '#' },
			{ name: 'Contact', href: '#' },
		],
	},
];
