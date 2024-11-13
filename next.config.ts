import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			// If we need to add more image sources later, we can add them here
			{
				protocol: 'https',
				hostname: 'source.unsplash.com',
			},
		],
	},
};

export default nextConfig;
