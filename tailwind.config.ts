import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';
import animatePlugin from 'tailwindcss-animate';

import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			animation: {
				aurora: 'aurora 60s linear infinite',
			},
			keyframes: {
				aurora: {
					from: {
						backgroundPosition: '50% 50%, 50% 50%',
					},
					to: {
						backgroundPosition: '350% 50%, 350% 50%',
					},
				},
			},
			colors: {
				hero: {
					light: {
						bg: '#ffffff',
						text: '#1a1a1a',
						accent: '#3b82f6',
					},
					dark: {
						bg: '#0a0a0a',
						text: '#ffffff',
						accent: '#60a5fa',
					},
				},
				features: {
					light: {
						bg: '#f3f4f6',
						text: '#1f2937',
						accent: '#4f46e5',
					},
					dark: {
						bg: '#111827',
						text: '#f3f4f6',
						accent: '#818cf8',
					},
				},
				cta: {
					light: {
						bg: '#1a1a1a',
						text: '#ffffff',
						accent: '#22c55e',
					},
					dark: {
						bg: '#000000',
						text: '#ffffff',
						accent: '#4ade80',
					},
				},
				light: {
					background: '#ffffff',
					text: '#1a1a1a',
					primary: '#0070f3',
					secondary: '#666666',
				},

				dark: {
					background: '#1a1a1a',
					text: '#ffffff',
					primary: '#3291ff',
					secondary: '#999999',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [
		animatePlugin,
		function (api: PluginAPI) {
			addVariablesForColors(api);
		},
	],
};
export default config;
type ThemeFunc = (
	path: string
) => Record<string, string | Record<string, string>>;

interface PluginParams {
	addBase: PluginAPI['addBase'];
	theme: ThemeFunc;
}

function addVariablesForColors({ addBase, theme }: PluginParams) {
	const allColors = flattenColorPalette(
		theme('colors') as Record<string, string | Record<string, string>>
	);
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [
			`--${key}`,
			val.toString(), // Convert all values to string
		])
	);

	addBase({
		':root': newVars,
	});
}
