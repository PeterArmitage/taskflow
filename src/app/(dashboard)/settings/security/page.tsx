// app/(dashboard)/settings/security/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { WobbleCard } from '@/app/components/ui/wobble-card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
	IconLoader2,
	IconDevices,
	IconShieldLock,
	IconTrash,
} from '@tabler/icons-react';
import type { SecuritySettings, Session } from '@/app/types/settings';

const mockSessions: Session[] = [
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

export default function SecurityPage() {
	const { toast } = useToast();
	const [saving, setSaving] = useState(false);
	const [loading2FA, setLoading2FA] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [sessions] = useState<Session[]>(mockSessions);
	const [settings, setSettings] = useState<SecuritySettings>({
		twoFactorEnabled: false,
		lastPasswordChange: '2024-02-15T00:00:00Z',
		activeSessions: sessions,
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			// TODO: Implement password change API call
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
			// TODO: Implement 2FA toggle API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSettings((prev) => ({
				...prev,
				twoFactorEnabled: !prev.twoFactorEnabled,
			}));
			toast({
				title: 'Success',
				description: `Two-factor authentication ${settings.twoFactorEnabled ? 'disabled' : 'enabled'}.`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update 2FA settings.',
				variant: 'destructive',
			});
		} finally {
			setLoading2FA(false);
		}
	};

	const handleRevokeSession = async (sessionId: string) => {
		try {
			// TODO: Implement session revocation API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSettings((prev) => ({
				...prev,
				activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
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
		<WobbleCard>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='p-6 space-y-8'
			>
				{/* Password Section */}
				<section>
					<h2 className='text-xl font-semibold mb-4'>Password</h2>
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
								required
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
								required
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
								required
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
				</section>

				{/* 2FA Section */}
				<section>
					<h2 className='text-xl font-semibold mb-4'>
						Two-Factor Authentication
					</h2>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-neutral-500 dark:text-neutral-400'>
								Add an extra layer of security to your account
							</p>
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
					</div>
				</section>

				{/* Active Sessions Section */}
				<section>
					<h2 className='text-xl font-semibold mb-4'>Active Sessions</h2>
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
				</section>

				{/* Danger Zone */}
				<section className='border-t pt-8'>
					<h2 className='text-xl font-semibold mb-4 text-red-600'>
						Danger Zone
					</h2>
					<div className='bg-red-50 dark:bg-red-950 p-4 rounded-lg'>
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
					</div>
				</section>
			</motion.div>
		</WobbleCard>
	);
}
