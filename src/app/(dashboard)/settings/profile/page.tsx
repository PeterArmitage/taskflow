'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/app/components/ui/avatar';
import { IconLoader2, IconUpload, IconX } from '@tabler/icons-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileUpdateData } from '@/app/types/auth';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';

interface ProfileFormData {
	username: string;
	email: string;
	name?: string;
	bio?: string;
}

export default function ProfileSettings() {
	const { user, loading, updateUser } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const [formData, setFormData] = useState<ProfileFormData>({
		username: user?.username || '',
		email: user?.email || '',
		name: user?.name || '',
		bio: user?.bio || '',
	});

	const [saving, setSaving] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setAvatarFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		try {
			setSaving(true);

			const updateData: ProfileUpdateData = {
				username: formData.username,
				email: formData.email,
				name: formData.name,
				bio: formData.bio,
			};

			const updatedUser = await authApi.updateProfile(
				user.id.toString(),
				updateData
			);

			if (avatarFile) {
				const userWithAvatar = await authApi.updateAvatar(
					user.id.toString(),
					avatarFile
				);
				updatedUser.avatar_url = userWithAvatar.avatar_url;
			}

			updateUser(updatedUser);

			toast({
				title: 'Success',
				description: 'Your profile has been updated successfully.',
			});
		} catch (error) {
			console.error('Failed to update profile:', error);
			toast({
				title: 'Error',
				description: 'Failed to update profile. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setSaving(false);
		}
	};

	const handleClose = useCallback(() => {
		router.push('/dashboard');
	}, [router]);

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<IconLoader2 className='w-6 h-6 animate-spin' />
			</div>
		);
	}

	return (
		<Card className='max-w-2xl mx-auto'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle>Profile Settings</CardTitle>
					<button
						onClick={handleClose}
						className='p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
					>
						<IconX className='w-5 h-5' />
					</button>
				</div>
			</CardHeader>

			<CardContent>
				<div className='mb-8'>
					<div className='flex items-center gap-6'>
						<Avatar
							src={
								avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar_url
							}
							fallback={user?.username?.[0]?.toUpperCase() || 'U'}
							className='h-20 w-20'
						/>
						<label>
							<input
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleAvatarChange}
							/>
							<Button variant='outline'>
								<IconUpload className='h-4 w-4 mr-2' />
								Change Avatar
							</Button>
						</label>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium mb-1'>Username</label>
							<Input
								value={formData.username}
								onChange={(e) =>
									setFormData({ ...formData, username: e.target.value })
								}
								className='max-w-md'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>Email</label>
							<Input
								type='email'
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className='max-w-md'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>
								Full Name
							</label>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className='max-w-md'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium mb-1'>Bio</label>
							<textarea
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								rows={4}
								className='w-full p-3 rounded-lg bg-white/5 border border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
							/>
						</div>
					</div>

					<CardFooter className='flex gap-4 px-0'>
						<Button variant='sketch' type='submit' disabled={saving}>
							{saving ? (
								<>
									<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
									Saving...
								</>
							) : (
								'Save Changes'
							)}
						</Button>
						<Button variant='outline' type='button' onClick={handleClose}>
							Cancel
						</Button>
					</CardFooter>
				</form>
			</CardContent>
		</Card>
	);
}
