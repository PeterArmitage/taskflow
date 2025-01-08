// types/requests.ts
export interface CreateCardRequest {
	title: string;
	list_id: number;
	board_id: number;
	description?: string;
	due_date?: string;
}

export interface UpdateListRequest {
	title?: string;
	position?: number;
}

export interface CreateCardRequest {
	title: string;
	list_id: number;
	board_id: number; // Added required board_id
	description?: string;
	due_date?: string;
}

export interface UpdateCardRequest {
	title?: string;
	description?: string;
	list_id?: number;
	due_date?: string | null;
	position?: number;
}

export interface CardResponse {
	id: number;
	title: string;
	list_id: number;
	board_id: number;
	description?: string;
	due_date?: string;
	created_at: string;
	updated_at: string;
	position: number;
	comments: Comment[];
	attachments_count: number;
	checklist_total: number;
	checklist_completed: number;
}
