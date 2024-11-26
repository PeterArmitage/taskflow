// app/(dashboard)/settings/profile/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/app/components/ui/avatar';
import { IconLoader2, IconUpload, IconX } from '@tabler/icons-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/auth';
import { useToast } from '@/hooks/use-toast';
import { WobbleCard } from '@/app/components/ui/wobble-card';
import { ProfileUpdateData } from '@/app/types/auth';

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

			// Update profile information
			const updatedUser = await authApi.updateProfile(
				user.id.toString(),
				updateData
			);

			// If there's a new avatar, update it
			if (avatarFile) {
				const userWithAvatar = await authApi.updateAvatar(
					user.id.toString(),
					avatarFile
				);
				updatedUser.avatar_url = userWithAvatar.avatar_url;
			}

			// Update the user in auth context
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
		<WobbleCard>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='max-w-2xl relative'
			>
				{/* Close Button */}
				<button
					onClick={handleClose}
					className='absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'
				>
					<IconX className='w-5 h-5' />
				</button>

				<h1 className='text-2xl font-bold mb-6'>Profile Settings</h1>

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

					<div className='flex gap-4'>
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
					</div>
				</form>
			</motion.div>
		</WobbleCard>
	);
}
