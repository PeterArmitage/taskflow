// components/dashboard/activity/activity-feed.tsx
import { useEffect, useState } from 'react';
import { useWebSocket } from '@/app/hooks/use-websocket';
import { ActivityItem } from './activity-item';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/app/types/activity';
import { ActivityFeedSkeleton } from './activity-feed-skeleton';

interface ActivityFeedProps {
	boardId: number;
	cardId?: number;
}

export function ActivityFeed({ boardId, cardId }: ActivityFeedProps) {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);

	const { sendMessage } = useWebSocket({
		boardId,
		cardId: cardId ?? null,
		onMessage: (message) => {
			if (message.type === 'activity') {
				// Add new activity to the feed
				setActivities((prev) => [message.data as Activity, ...prev]);
			}
		},
	});

	useEffect(() => {
		// Fetch initial activities
		const fetchActivities = async () => {
			try {
				const response = await fetch(
					`/api/boards/${boardId}/activities${cardId ? `?cardId=${cardId}` : ''}`
				);
				const data = await response.json();
				setActivities(data);
			} catch (error) {
				console.error('Failed to fetch activities:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchActivities();
	}, [boardId, cardId]);

	const groupActivitiesByDate = (activities: Activity[]) => {
		return activities.reduce(
			(groups, activity) => {
				const date = new Date(activity.timestamp).toLocaleDateString();
				if (!groups[date]) {
					groups[date] = [];
				}
				groups[date].push(activity);
				return groups;
			},
			{} as Record<string, Activity[]>
		);
	};

	if (loading) {
		return <ActivityFeedSkeleton />;
	}

	const groupedActivities = groupActivitiesByDate(activities);

	return (
		<div className='space-y-6'>
			{Object.entries(groupedActivities).map(([date, dateActivities]) => (
				<div key={date}>
					<h3 className='text-sm font-medium text-neutral-500 mb-3'>
						{formatDistanceToNow(new Date(date), { addSuffix: true })}
					</h3>
					<div className='space-y-4'>
						{dateActivities.map((activity) => (
							<ActivityItem key={activity.id} activity={activity} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
