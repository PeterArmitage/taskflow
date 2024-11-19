export interface Board {
	id: string;
	title: string;
	created_at: string;
	updated_at: string;
	owner_id: string;
}

export interface List {
	id: string;
	title: string;
	board_id: string;
	order: number;
}

export interface Card {
	id: string;
	title: string;
	description?: string;
	list_id: string;
	order: number;
	due_date?: string;
	labels?: string[];
	assignees?: string[];
}

export interface BoardWithLists extends Board {
	lists: (List & {
		cards: Card[];
	})[];
}
