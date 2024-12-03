'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IconLoader2 } from '@tabler/icons-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface EmailPreferences {
	notifications: {
		cardDue: boolean;
		mentionedInCard: boolean;
		cardAssigned: boolean;
		boardInvites: boolean;
		weeklyDigest: boolean;
	};
	marketing: {
		newsletter: boolean;
		productUpdates: boolean;
		tips: boolean;
	};
}

interface SwitchItemProps {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

const SwitchItem = ({
	title,
	description,
	checked,
	onCheckedChange,
}: SwitchItemProps) => (
	<div className='flex items-center justify-between'>
		<div>
			<p className='font-medium'>{title}</p>
			<p className='text-sm text-neutral-500 dark:text-neutral-400'>
				{description}
			</p>
		</div>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
	</div>
);

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
			await new Promise((resolve) => setTimeout(resolve, 1000));
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
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Task Notifications</CardTitle>
					<CardDescription>
						Configure how you receive task-related notifications
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{Object.entries(preferences.notifications).map(([key, value]) => (
						<SwitchItem
							key={key}
							title={formatLabel(key)}
							description={getNotificationDescription(key)}
							checked={value}
							onCheckedChange={(checked) =>
								setPreferences((prev) => ({
									...prev,
									notifications: { ...prev.notifications, [key]: checked },
								}))
							}
						/>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Marketing Communications</CardTitle>
					<CardDescription>
						Manage your marketing email preferences
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{Object.entries(preferences.marketing).map(([key, value]) => (
						<SwitchItem
							key={key}
							title={formatLabel(key)}
							description={getMarketingDescription(key)}
							checked={value}
							onCheckedChange={(checked) =>
								setPreferences((prev) => ({
									...prev,
									marketing: { ...prev.marketing, [key]: checked },
								}))
							}
						/>
					))}
				</CardContent>
				<CardFooter>
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
				</CardFooter>
			</Card>
		</div>
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
