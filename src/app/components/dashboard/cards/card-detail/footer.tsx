// components/dashboard/cards/card-detail/footer.tsx
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';

interface CardDetailFooterProps {
	isSaving: boolean;
	onCancel: () => void;
	onSave: () => Promise<void>;
}

export const CardDetailFooter = memo(function CardDetailFooter({
	isSaving,
	onCancel,
	onSave,
}: CardDetailFooterProps) {
	return (
		<div className='border-t dark:border-neutral-800 p-4'>
			<div className='flex justify-end gap-2'>
				<Button variant='outline' onClick={onCancel}>
					Cancel
				</Button>
				<Button variant='default' onClick={onSave} disabled={isSaving}>
					{isSaving ? (
						<>
							<IconLoader2 className='w-4 h-4 animate-spin mr-2' />
							Saving...
						</>
					) : (
						'Save Changes'
					)}
				</Button>
			</div>
		</div>
	);
});
