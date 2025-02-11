// types/real-time-updates.ts
export type ListOperationType = 'created' | 'updated' | 'deleted';

export interface BoardListUpdate {
	type: 'list';
	action: ListOperationType;
	boardId: number;
	data: {
		id: number;
		title: string;
		board_id: number;
		user_id: number;
	};
}

export interface BoardCardUpdate {
	type: 'card';
	action: 'created' | 'updated' | 'deleted' | 'moved';
	boardId: number;
	data: {
		id: number;
		title: string;
		list_id: number;
		user_id: number;
	};
}

export interface BoardCommentUpdate {
	type: 'comment';
	action: 'created' | 'updated' | 'deleted';
	boardId: number;
	data: {
		id: number;
		content: string;
		card_id: number;
		user_id: number;
	};
}

// Union type for all real-time board updates
export type BoardRealTimeUpdate =
	| BoardListUpdate
	| BoardCardUpdate
	| BoardCommentUpdate;

// Type guard functions for checking update types
export function isBoardListUpdate(
	update: BoardRealTimeUpdate
): update is BoardListUpdate {
	return update.type === 'list';
}

export function isBoardCardUpdate(
	update: BoardRealTimeUpdate
): update is BoardCardUpdate {
	return update.type === 'card';
}

export function isBoardCommentUpdate(
	update: BoardRealTimeUpdate
): update is BoardCommentUpdate {
	return update.type === 'comment';
}
