'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ForgotPasswordForm, ForgotPasswordData } from './forgot-password-form';
import { authApi } from '@/app/api/auth';

interface ForgotPasswordDialogProps {
	trigger: React.ReactNode;
}

type ApiErrorResponse = {
	response?: {
		data?: {
			detail?: string;
		};
	};
};

export const ForgotPasswordDialog = ({
	trigger,
}: ForgotPasswordDialogProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string } | null>(null);
	const [open, setOpen] = useState(false);

	const handleSubmit = async (data: ForgotPasswordData) => {
		try {
			setLoading(true);
			setError(null);
			await authApi.forgotPassword(data.email);
			// Keep dialog open to show success message
		} catch (err) {
			const apiError = err as ApiErrorResponse;
			setError({
				message:
					apiError.response?.data?.detail || 'Failed to send reset email',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Reset your password</DialogTitle>
				</DialogHeader>
				<ForgotPasswordForm
					onSubmit={handleSubmit}
					loading={loading}
					error={error}
				/>
			</DialogContent>
		</Dialog>
	);
};
