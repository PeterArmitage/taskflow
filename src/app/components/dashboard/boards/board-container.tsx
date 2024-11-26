// components/dashboard/boards/board-container.tsx
'use client';

import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { List } from '@/app/types/boards';
import { BoardList } from './board-list';

interface BoardContainerProps {
	lists: List[];
	onListsUpdate: (lists: List[]) => void;
}

export function BoardContainer({ lists, onListsUpdate }: BoardContainerProps) {
	const [orderedLists, setOrderedLists] = useState(lists);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		if (active.id !== over.id) {
			setOrderedLists((items) => {
				const oldIndex = items.findIndex((i) => i.id === active.id);
				const newIndex = items.findIndex((i) => i.id === over.id);

				const newLists = arrayMove(items, oldIndex, newIndex);
				onListsUpdate(newLists);
				return newLists;
			});
		}
	};

	const handleListUpdate = () => {
		onListsUpdate(orderedLists);
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<SortableContext items={orderedLists.map((list) => list.id)}>
				<div className='flex gap-4 h-full overflow-x-auto pb-4'>
					{orderedLists.map((list) => (
						<BoardList key={list.id} list={list} onUpdate={handleListUpdate} />
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
