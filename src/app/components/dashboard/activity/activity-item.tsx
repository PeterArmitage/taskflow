// components/dashboard/activity/activity-item.tsx
import { Activity } from '@/app/types/activity';
import { Avatar } from '@/app/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
	activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
	const renderActivityContent = () => {
		switch (activity.type) {
			case 'comment_created':
				return (
					<span>
						commented on{' '}
						<span className='font-medium'>{activity.cardTitle}</span>
					</span>
				);
			case 'card_moved':
				return (
					<span>
						moved <span className='font-medium'>{activity.cardTitle}</span> from{' '}
						<span className='font-medium'>{activity.fromList}</span> to{' '}
						<span className='font-medium'>{activity.toList}</span>
					</span>
				);
			// Add more cases for different activity types
		}
	};

	return (
		<div className='flex items-start gap-3'>
			<Avatar
				src={activity.user.avatar_url}
				fallback={activity.user.username[0].toUpperCase()}
				size='sm'
			/>
			<div className='flex-1 min-w-0'>
				<div className='flex items-center gap-2'>
					<span className='font-medium truncate'>{activity.user.username}</span>
					<span className='text-sm text-neutral-500'>
						{formatDistanceToNow(new Date(activity.timestamp), {
							addSuffix: true,
						})}
					</span>
				</div>
				<p className='text-sm text-neutral-700 dark:text-neutral-300'>
					{renderActivityContent()}
				</p>
			</div>
		</div>
	);
}
