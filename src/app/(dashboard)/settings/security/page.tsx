'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
	IconLoader2,
	IconDevices,
	IconShieldLock,
	IconTrash,
} from '@tabler/icons-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface PasswordData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface SecuritySettings {
	twoFactorEnabled: boolean;
	lastPasswordChange: string;
	activeSessions: Session[];
}

interface Session {
	id: string;
	device: string;
	browser: string;
	location: string;
	lastActive: string;
	current: boolean;
}

export default function SecurityPage() {
	const { toast } = useToast();
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [loading2FA, setLoading2FA] = useState(false);
	const [saving, setSaving] = useState(false);

	const [passwordData, setPasswordData] = useState<PasswordData>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [settings, setSettings] = useState<SecuritySettings>({
		twoFactorEnabled: false,
		lastPasswordChange: '2024-02-15T00:00:00Z',
		activeSessions: mockSessions,
	});

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Success',
				description: 'Password updated successfully.',
			});
			setShowChangePassword(false);
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update password.',
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	const handleToggle2FA = async () => {
		setLoading2FA(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSettings((prev) => ({
				...prev,
				twoFactorEnabled: !prev.twoFactorEnabled,
			}));
			toast({
				title: 'Success',
				description: `Two-factor authentication ${settings.twoFactorEnabled ? 'disabled' : 'enabled'}.`,
			});
		} finally {
			setLoading2FA(false);
		}
	};
	const handleRevokeSession = async (sessionId: string) => {
		try {
			// In a real app, this would make an API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSettings((prev) => ({
				...prev,
				activeSessions: prev.activeSessions.filter(
					(session) => session.id !== sessionId
				),
			}));
			toast({
				title: 'Success',
				description: 'Session revoked successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to revoke session.',
				variant: 'destructive',
			});
		}
	};
	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Update your account password and enable additional security measures
					</CardDescription>
				</CardHeader>

				<CardContent>
					{showChangePassword ? (
						<form onSubmit={handleChangePassword} className='space-y-4'>
							<Input
								type='password'
								placeholder='Current Password'
								value={passwordData.currentPassword}
								onChange={(e) =>
									setPasswordData((prev) => ({
										...prev,
										currentPassword: e.target.value,
									}))
								}
							/>
							<Input
								type='password'
								placeholder='New Password'
								value={passwordData.newPassword}
								onChange={(e) =>
									setPasswordData((prev) => ({
										...prev,
										newPassword: e.target.value,
									}))
								}
							/>
							<Input
								type='password'
								placeholder='Confirm New Password'
								value={passwordData.confirmPassword}
								onChange={(e) =>
									setPasswordData((prev) => ({
										...prev,
										confirmPassword: e.target.value,
									}))
								}
							/>
							<div className='flex gap-2'>
								<Button variant='sketch' type='submit' disabled={saving}>
									{saving ? (
										<>
											<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
											Saving...
										</>
									) : (
										'Update Password'
									)}
								</Button>
								<Button
									variant='outline'
									type='button'
									onClick={() => setShowChangePassword(false)}
								>
									Cancel
								</Button>
							</div>
						</form>
					) : (
						<Button
							variant='outline'
							onClick={() => setShowChangePassword(true)}
						>
							<IconShieldLock className='w-4 h-4 mr-2' />
							Change Password
						</Button>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>
						Add an extra layer of security to your account
					</CardDescription>
				</CardHeader>
				<CardContent className='flex items-center justify-between'>
					<div>
						<p className='text-sm text-neutral-500 dark:text-neutral-400'>
							{settings.twoFactorEnabled
								? 'Two-factor authentication is enabled'
								: 'Two-factor authentication is disabled'}
						</p>
					</div>
					<Switch
						checked={settings.twoFactorEnabled}
						onCheckedChange={handleToggle2FA}
						disabled={loading2FA}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Active Sessions</CardTitle>
					<CardDescription>
						Manage your active sessions across devices
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{settings.activeSessions.map((session) => (
							<div
								key={session.id}
								className='flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800'
							>
								<div className='flex items-center gap-3'>
									<IconDevices className='w-5 h-5' />
									<div>
										<p className='font-medium'>
											{session.device} - {session.browser}
											{session.current && (
												<span className='ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded'>
													Current
												</span>
											)}
										</p>
										<p className='text-sm text-neutral-500 dark:text-neutral-400'>
											{session.location} • Last active{' '}
											{new Date(session.lastActive).toLocaleDateString()}
										</p>
									</div>
								</div>
								{!session.current && (
									<Button
										variant='outline'
										onClick={() => handleRevokeSession(session.id)}
									>
										Revoke
									</Button>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className='text-red-600'>Danger Zone</CardTitle>
					<CardDescription>
						Irreversible and destructive actions
					</CardDescription>
				</CardHeader>
				<CardContent className='bg-red-50 dark:bg-red-950 p-4 rounded-lg'>
					<h3 className='font-medium text-red-600 dark:text-red-400'>
						Delete Account
					</h3>
					<p className='text-sm text-red-600/70 dark:text-red-400/70 mb-4'>
						Once you delete your account, there is no going back. Please be
						certain.
					</p>
					<Button
						variant='outline'
						className='text-red-600 hover:text-red-700 border-red-200 hover:border-red-300'
					>
						<IconTrash className='w-4 h-4 mr-2' />
						Delete Account
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

const mockSessions = [
	{
		id: '1',
		device: 'MacBook Pro',
		browser: 'Chrome',
		location: 'San Francisco, US',
		lastActive: '2024-03-26T10:00:00Z',
		current: true,
	},
	{
		id: '2',
		device: 'iPhone 13',
		browser: 'Safari',
		location: 'San Francisco, US',
		lastActive: '2024-03-25T15:30:00Z',
		current: false,
	},
];
