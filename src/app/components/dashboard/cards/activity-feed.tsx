import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/app/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Activity, TimelineItem } from '@/app/types/activity';
import { Comment } from '@/app/types/comments';
import {
	IconMessageCircle,
	IconTag,
	IconArrowRight,
	IconCalendar,
	IconPaperclip,
	IconPlus,
} from '@tabler/icons-react';

interface ActivityFeedProps {
	activities: Activity[];
	comments: Comment[];
	cardId: number;
}

interface ActivityIconProps {
	type: Activity['type'];
}

const ActivityIcon = ({ type }: ActivityIconProps) => {
	switch (type) {
		case 'comment_added':
			return <IconMessageCircle className='w-4 h-4 text-blue-500' />;
		case 'label_added':
		case 'label_removed':
			return <IconTag className='w-4 h-4 text-purple-500' />;
		case 'card_moved':
			return <IconArrowRight className='w-4 h-4 text-green-500' />;
		case 'due_date_updated':
			return <IconCalendar className='w-4 h-4 text-orange-500' />;
		case 'attachment_added':
			return <IconPaperclip className='w-4 h-4 text-pink-500' />;
		default:
			return <IconPlus className='w-4 h-4 text-gray-500' />;
	}
};

const TimelineItemComponent = ({ item }: { item: TimelineItem }) => {
	const isComment = item.type === 'comment';
	const content = item.content;
	const user = isComment
		? (content as Comment).user
		: (content as Activity).user;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className='flex gap-3 group'
		>
			<div className='flex-shrink-0'>
				<Avatar
					src={user.avatar_url}
					fallback={user.username[0].toUpperCase()}
					className='w-8 h-8'
				/>
			</div>

			<div className='flex-1 min-w-0'>
				<div className='flex items-center gap-2 mb-1'>
					<span className='font-medium text-sm'>{user.username}</span>
					<span className='text-xs text-neutral-500'>
						{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
					</span>
				</div>

				{isComment ? (
					<div className='bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3'>
						<p className='text-sm whitespace-pre-wrap'>
							{(content as Comment).content}
						</p>
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<ActivityIcon type={(content as Activity).type} />
						<p className='text-sm text-neutral-600 dark:text-neutral-400'>
							{(content as Activity).details}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export function ActivityFeed({
	activities,
	comments,
	cardId,
}: ActivityFeedProps) {
	const timelineItems = useMemo(() => {
		const items: TimelineItem[] = [
			...activities.map((activity) => ({
				id: activity.id,
				type: 'activity' as const,
				content: activity,
				timestamp: activity.created_at,
			})),
			...comments.map((comment) => ({
				id: `comment-${comment.id}`,
				type: 'comment' as const,
				content: comment,
				timestamp: comment.created_at,
			})),
		];

		return items.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
	}, [activities, comments]);

	if (timelineItems.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-12 text-neutral-500'>
				<IconMessageCircle className='w-8 h-8 mb-2' />
				<p>No activity yet</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<AnimatePresence mode='popLayout'>
				{timelineItems.map((item) => (
					<TimelineItemComponent key={item.id} item={item} />
				))}
			</AnimatePresence>
		</div>
	);
}
