'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
	IconLoader2,
	IconPalette,
	IconLanguage,
	IconAccessible,
	IconEye,
} from '@tabler/icons-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

// Define our interfaces for type safety
interface AdvancedSettings {
	theme: {
		mode: 'light' | 'dark' | 'system';
		customColors: boolean;
		animations: boolean;
		reducedMotion: boolean;
	};
	language: {
		preferred: string;
		dateFormat: string;
		timeFormat: '12h' | '24h';
	};
	accessibility: {
		screenReader: boolean;
		highContrast: boolean;
		largeText: boolean;
		keyboardNavigation: boolean;
	};
	display: {
		denseMode: boolean;
		showAvatars: boolean;
		showLabels: boolean;
		compactView: boolean;
	};
}

interface SwitchItemProps {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

// Reusable components
const SwitchItem = ({
	title,
	description,
	checked,
	onCheckedChange,
}: SwitchItemProps) => (
	<div className='flex items-center justify-between py-2'>
		<div>
			<p className='font-medium'>{title}</p>
			<p className='text-sm text-neutral-500 dark:text-neutral-400'>
				{description}
			</p>
		</div>
		<Switch checked={checked} onCheckedChange={onCheckedChange} />
	</div>
);

// Constants for options
const languages = [
	{ value: 'en', label: 'English' },
	{ value: 'es', label: 'Español' },
	{ value: 'fr', label: 'Français' },
	{ value: 'de', label: 'Deutsch' },
	{ value: 'it', label: 'Italiano' },
	{ value: 'pt', label: 'Português' },
] as const;

const dateFormats = [
	{ value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
	{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
	{ value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
] as const;

const themeOptions = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'system', label: 'System' },
] as const;

export default function AdvancedSettingsPage() {
	const { toast } = useToast();
	const [saving, setSaving] = useState(false);
	const [settings, setSettings] = useState<AdvancedSettings>({
		theme: {
			mode: 'system',
			customColors: false,
			animations: true,
			reducedMotion: false,
		},
		language: {
			preferred: 'en',
			dateFormat: 'MM/DD/YYYY',
			timeFormat: '24h',
		},
		accessibility: {
			screenReader: false,
			highContrast: false,
			largeText: false,
			keyboardNavigation: true,
		},
		display: {
			denseMode: false,
			showAvatars: true,
			showLabels: true,
			compactView: false,
		},
	});

	// Handle saving settings
	const handleSave = async () => {
		setSaving(true);
		try {
			// Simulated API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Success',
				description: 'Advanced settings updated successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update advanced settings.',
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Theme Settings Card */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<IconPalette className='h-5 w-5' />
						<CardTitle>Theme Preferences</CardTitle>
					</div>
					<CardDescription>Customize your interface appearance</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='font-medium'>Theme Mode</p>
							<p className='text-sm text-neutral-500 dark:text-neutral-400'>
								Choose your preferred theme mode
							</p>
						</div>
						<Select
							value={settings.theme.mode}
							onValueChange={(value: 'light' | 'dark' | 'system') =>
								setSettings((prev) => ({
									...prev,
									theme: { ...prev.theme, mode: value },
								}))
							}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select theme' />
							</SelectTrigger>
							<SelectContent>
								{themeOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Theme toggles */}
					{Object.entries(settings.theme)
						.filter(([key]) => key !== 'mode')
						.map(([key, value]) => (
							<SwitchItem
								key={key}
								title={formatTitle(key)}
								description={getThemeDescription(key)}
								checked={Boolean(value)}
								onCheckedChange={(checked) =>
									setSettings((prev) => ({
										...prev,
										theme: { ...prev.theme, [key]: checked },
									}))
								}
							/>
						))}
				</CardContent>
			</Card>

			{/* Language Settings Card */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<IconLanguage className='h-5 w-5' />
						<CardTitle>Language & Region</CardTitle>
					</div>
					<CardDescription>
						Set your language and regional preferences
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='font-medium'>Language</p>
							<p className='text-sm text-neutral-500 dark:text-neutral-400'>
								Select your preferred language
							</p>
						</div>
						<Select
							value={settings.language.preferred}
							onValueChange={(value) =>
								setSettings((prev) => ({
									...prev,
									language: { ...prev.language, preferred: value },
								}))
							}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select language' />
							</SelectTrigger>
							<SelectContent>
								{languages.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center justify-between'>
						<div>
							<p className='font-medium'>Date Format</p>
							<p className='text-sm text-neutral-500 dark:text-neutral-400'>
								Choose how dates are displayed
							</p>
						</div>
						<Select
							value={settings.language.dateFormat}
							onValueChange={(value) =>
								setSettings((prev) => ({
									...prev,
									language: { ...prev.language, dateFormat: value },
								}))
							}
						>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Select format' />
							</SelectTrigger>
							<SelectContent>
								{dateFormats.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Accessibility Settings Card */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<IconAccessible className='h-5 w-5' />
						<CardTitle>Accessibility</CardTitle>
					</div>
					<CardDescription>Configure accessibility settings</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{Object.entries(settings.accessibility).map(([key, value]) => (
						<SwitchItem
							key={key}
							title={formatTitle(key)}
							description={getAccessibilityDescription(key)}
							checked={Boolean(value)}
							onCheckedChange={(checked) =>
								setSettings((prev) => ({
									...prev,
									accessibility: { ...prev.accessibility, [key]: checked },
								}))
							}
						/>
					))}
				</CardContent>
			</Card>

			{/* Display Settings Card */}
			<Card>
				<CardHeader>
					<div className='flex items-center gap-2'>
						<IconEye className='h-5 w-5' />
						<CardTitle>Display Settings</CardTitle>
					</div>
					<CardDescription>Customize your viewing experience</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{Object.entries(settings.display).map(([key, value]) => (
						<SwitchItem
							key={key}
							title={formatTitle(key)}
							description={getDisplayDescription(key)}
							checked={Boolean(value)}
							onCheckedChange={(checked) =>
								setSettings((prev) => ({
									...prev,
									display: { ...prev.display, [key]: checked },
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

// Utility functions
function formatTitle(key: string): string {
	return key
		.split(/(?=[A-Z])/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

function getThemeDescription(key: string): string {
	const descriptions: Record<string, string> = {
		customColors: 'Enable custom color schemes',
		animations: 'Enable interface animations',
		reducedMotion: 'Reduce motion for accessibility',
	};
	return descriptions[key] || '';
}

function getAccessibilityDescription(key: string): string {
	const descriptions: Record<string, string> = {
		screenReader: 'Optimize for screen readers',
		highContrast: 'Increase contrast for better visibility',
		largeText: 'Use larger text throughout the interface',
		keyboardNavigation: 'Enhanced keyboard navigation support',
	};
	return descriptions[key] || '';
}

function getDisplayDescription(key: string): string {
	const descriptions: Record<string, string> = {
		denseMode: 'Compress the layout to show more content',
		showAvatars: 'Show user avatars in the interface',
		showLabels: 'Display labels on cards and boards',
		compactView: 'Use a more compact view for lists',
	};
	return descriptions[key] || '';
}
