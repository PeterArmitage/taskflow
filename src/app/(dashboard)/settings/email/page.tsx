// app/(dashboard)/settings/email/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { WobbleCard } from '@/app/components/ui/wobble-card';
import { EmailPreferences } from '@/app/types/settings';
import { useToast } from '@/hooks/use-toast';
import { IconLoader2 } from '@tabler/icons-react';

export default function EmailPreferencesPage() {
	const { toast } = useToast();
	const [saving, setSaving] = useState(false);
	const [preferences, setPreferences] = useState<EmailPreferences>({
		notifications: {
			cardDue: true,
			mentionedInCard: true,
			cardAssigned: true,
			boardInvites: true,
			weeklyDigest: false,
		},
		marketing: {
			newsletter: false,
			productUpdates: true,
			tips: false,
		},
	});

	const handleSave = async () => {
		setSaving(true);
		try {
			// TODO: Implement API call
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			toast({
				title: 'Success',
				description: 'Email preferences updated successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update email preferences.',
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<WobbleCard>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='p-6 space-y-8'
			>
				<div>
					<h2 className='text-xl font-semibold mb-6'>Email Notifications</h2>
					<div className='space-y-4'>
						{Object.entries(preferences.notifications).map(([key, value]) => (
							<div key={key} className='flex items-center justify-between'>
								<div>
									<p className='font-medium'>{formatLabel(key)}</p>
									<p className='text-sm text-neutral-500 dark:text-neutral-400'>
										{getNotificationDescription(key)}
									</p>
								</div>
								<Switch
									checked={value}
									onCheckedChange={(checked) => {
										setPreferences((prev) => ({
											...prev,
											notifications: {
												...prev.notifications,
												[key]: checked,
											},
										}));
									}}
								/>
							</div>
						))}
					</div>
				</div>

				<div>
					<h2 className='text-xl font-semibold mb-6'>Marketing Emails</h2>
					<div className='space-y-4'>
						{Object.entries(preferences.marketing).map(([key, value]) => (
							<div key={key} className='flex items-center justify-between'>
								<div>
									<p className='font-medium'>{formatLabel(key)}</p>
									<p className='text-sm text-neutral-500 dark:text-neutral-400'>
										{getMarketingDescription(key)}
									</p>
								</div>
								<Switch
									checked={value}
									onCheckedChange={(checked) => {
										setPreferences((prev) => ({
											...prev,
											marketing: {
												...prev.marketing,
												[key]: checked,
											},
										}));
									}}
								/>
							</div>
						))}
					</div>
				</div>

				<div className='flex justify-end'>
					<Button variant='sketch' onClick={handleSave} disabled={saving}>
						{saving ? (
							<>
								<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
								Saving...
							</>
						) : (
							'Save Changes'
						)}
					</Button>
				</div>
			</motion.div>
		</WobbleCard>
	);
}

function formatLabel(key: string): string {
	return key
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function getNotificationDescription(key: string): string {
	const descriptions: Record<string, string> = {
		cardDue: 'Get notified when a card is due soon',
		mentionedInCard: 'Get notified when someone mentions you in a card',
		cardAssigned: 'Get notified when you are assigned to a card',
		boardInvites: 'Get notified when you are invited to a board',
		weeklyDigest: 'Receive a weekly summary of your boards activity',
	};
	return descriptions[key] || '';
}

function getMarketingDescription(key: string): string {
	const descriptions: Record<string, string> = {
		newsletter: 'Receive our monthly newsletter with updates and tips',
		productUpdates: 'Get notified about new features and improvements',
		tips: 'Receive productivity tips and best practices',
	};
	return descriptions[key] || '';
}
