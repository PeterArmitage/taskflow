// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from './providers/theme-provider';
import { AuthProvider } from './providers/auth-provider';
import { BoardProvider } from './contexts/BoardContext';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-montserrat',
});

export const metadata: Metadata = {
	title: 'TaskFlow',
	description: 'Organize anything, together',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='scroll-smooth'>
			<body
				className={`${inter.className} ${montserrat.variable} min-h-screen flex flex-col`}
			>
				<ThemeProvider>
					<Theme>
						<AuthProvider>
							<BoardProvider>{children}</BoardProvider>
						</AuthProvider>
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	);
}
