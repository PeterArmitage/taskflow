import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	IconPaperclip,
	IconDownload,
	IconTrash,
	IconFile,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Attachment, UploadProgress } from '@/app/types/attachment';

interface AttachmentManagerProps {
	cardId: number;
	attachments: Attachment[];
	onUpload: (file: File) => Promise<void>;
	onDelete: (attachmentId: number) => Promise<void>;
}

export function AttachmentManager({
	cardId,
	attachments,
	onUpload,
	onDelete,
}: AttachmentManagerProps) {
	const [uploads, setUploads] = useState<Record<string, UploadProgress>>({});
	const { toast } = useToast();

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files?.length) return;

		const file = files[0];
		if (file.size > 10 * 1024 * 1024) {
			toast({
				title: 'Error',
				description: 'File size must be less than 10MB',
				variant: 'destructive',
			});
			return;
		}

		// Initialize upload progress
		setUploads((prev) => ({
			...prev,
			[file.name]: {
				progress: 0,
				status: 'uploading',
				filename: file.name,
			},
		}));

		try {
			await onUpload(file);
			setUploads((prev) => ({
				...prev,
				[file.name]: {
					...prev[file.name],
					progress: 100,
					status: 'complete',
				},
			}));

			setTimeout(() => {
				setUploads((prev) => {
					const newUploads = { ...prev };
					delete newUploads[file.name];
					return newUploads;
				});
			}, 2000);
		} catch (error) {
			setUploads((prev) => ({
				...prev,
				[file.name]: {
					...prev[file.name],
					status: 'error',
				},
			}));
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='font-medium flex items-center gap-2'>
					<IconPaperclip className='w-4 h-4' />
					Attachments
				</h3>
				<label>
					<input
						type='file'
						className='hidden'
						onChange={handleFileSelect}
						accept='image/*,.pdf,.doc,.docx,.txt'
					/>
					<Button variant='outline' size='sm' asChild>
						<span>Upload File</span>
					</Button>
				</label>
			</div>

			<AnimatePresence>
				{Object.entries(uploads).map(([filename, upload]) => (
					<motion.div
						key={filename}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className='bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 space-y-2'
					>
						<div className='flex items-center justify-between'>
							<span className='text-sm truncate flex-1'>{filename}</span>
							<span className='text-sm text-neutral-500'>
								{upload.status === 'uploading' ? 'Uploading...' : upload.status}
							</span>
						</div>
						<Progress value={upload.progress} />
					</motion.div>
				))}
			</AnimatePresence>

			<div className='space-y-2'>
				{attachments.map((attachment) => (
					<motion.div
						key={attachment.id}
						layout
						className='flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg'
					>
						<div className='flex items-center gap-3'>
							<IconFile className='w-5 h-5 text-neutral-500' />
							<div>
								<p className='font-medium text-sm'>{attachment.filename}</p>
								<p className='text-xs text-neutral-500'>
									{formatFileSize(attachment.size)} •
									{new Date(attachment.uploaded_at).toLocaleDateString()}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => window.open(`/api/attachments/${attachment.id}`)}
							>
								<IconDownload className='w-4 h-4' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onDelete(attachment.id)}
							>
								<IconTrash className='w-4 h-4' />
							</Button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
