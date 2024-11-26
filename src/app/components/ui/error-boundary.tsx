// components/ui/error-boundary.tsx
'use client';

import { Button } from '@/app/components/ui/button';
import { Component, ErrorInfo, ReactNode } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className='flex flex-col items-center justify-center min-h-[400px] p-4'>
						<IconAlertCircle className='w-12 h-12 text-red-500 mb-4' />
						<h2 className='text-xl font-semibold mb-2'>Something went wrong</h2>
						<p className='text-gray-600 dark:text-gray-400 mb-4'>
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<Button
							variant='sketch'
							onClick={() => this.setState({ hasError: false })}
						>
							Try again
						</Button>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
