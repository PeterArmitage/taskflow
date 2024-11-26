export interface Board {
	id: number;
	title: string;
	description?: string;
	created_at: string;
	updated_at: string;
	owner_id: number;
	lists: List[];
}

export interface List {
	id: number;
	title: string;
	board_id: number;
	created_at: string;
	updated_at: string;
	cards?: Card[];
}

export interface Card {
	id: number;
	title: string;
	description?: string;
	list_id: number;
	due_date?: string;
	created_at: string;
	updated_at: string;
	comments_count?: number;
	attachments_count?: number;
}
export interface BoardWithLists extends Board {
	lists: (List & {
		cards: Card[];
	})[];
}
