export interface BoardMember {
	id: number;
	user_id: number;
	board_id: number;
	role: 'viewer' | 'editor' | 'admin';
	joined_at: string;
}

export interface ShareBoardData {
	email: string;
	role: BoardMember['role'];
}
