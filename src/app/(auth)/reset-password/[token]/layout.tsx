// app/(auth)/reset-password/[token]/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Reset Password - TaskFlow',
	description: 'Reset your TaskFlow account password',
};

export default function ResetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
