// types/checklist.ts
export interface ChecklistItem {
	id: number;
	content: string;
	completed: boolean;
	position: number;
	checklist_id: number;
	created_at: string;
	updated_at?: string;
}

export interface Checklist {
	id: number;
	title: string;
	card_id: number;
	items: ChecklistItem[];
	position: number;
	created_at: string;
	updated_at?: string;
}

export interface CreateChecklistData {
	title: string;
	card_id: number;
}

export interface CreateChecklistItemData {
	content: string;
	checklist_id: number;
	position?: number;
}

export interface UpdateChecklistItemData {
	content?: string;
	completed?: boolean;
	position?: number;
}

export interface UpdateChecklistData {
	title?: string;
	position?: number;
}
