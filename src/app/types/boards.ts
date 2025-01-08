export interface Board extends Timestamps {
	id: number;
	title: string;
	description?: string;
	created_at: string;
	updated_at: string;
	owner_id: number;
	lists?: List[];
	cards_count?: number;
}

export interface List extends Timestamps {
	id: number;
	title: string;
	board_id: number;
	created_at: string;
	updated_at: string;
	cards?: Card[];
	position: number;
}

export interface Card extends Timestamps {
	id: number;
	title: string;
	description?: string;
	list_id: number;
	created_at: string;
	updated_at: string;
	due_date?: string | null;
	labels?: Label[];
	attachments?: Attachment[];
	comments: AnyComment[];
	comments_count?: number;
	position: number;
	activities?: BaseActivity[];
	attachments_count: number;
	checklist_total: number;
	checklist_completed: number;
	checklists?: Checklist[];
	archived?: boolean;
	cover_image_url?: string;
}
export interface BoardWithLists extends Board {
	lists: (List & {
		cards: Card[];
	})[];
}

export interface Label {
	id: number;
	name: string;
	color: string;
	card_id: number;
}

export interface BoardMember extends Timestamps {
	id: number;
	board_id: number;
	user_id: number;
	role: 'viewer' | 'editor' | 'admin';
	user: BoardUser;
}

export interface BoardActivity extends Omit<BaseActivity, 'type' | 'user'> {
	type: ActivityType;
	details?: string;
	user: BoardUser;
}

export interface Timestamps {
	created_at: string;
	updated_at: string;
}

export interface Comment extends Timestamps {
	id: number;
	content: string;
	card_id: number;
	user_id: number;
	user: BoardUser;
	created_at: string;
	updated_at: string;
}

export interface Attachment extends Timestamps {
	id: number;
	filename: string;
	file_path: string;
	card_id: number;
	size: number;
	mime_type: string;
	uploaded_at: string;
}

export interface CardCreateData {
	title: string;
	list_id: number;
	description?: string;
	due_date?: string;
	position?: number;
}

export interface CardUpdateData {
	title?: string;
	description?: string;
	list_id?: number;
	due_date?: string | null;
	position?: number;
	comments?: Comment[];
}

export interface CardMoveData {
	list_id: number;
	position: number;
}

// Types for label operations
export interface LabelCreateData {
	name: string;
	color: string;
	card_id: number;
}

export interface LabelUpdateData {
	name?: string;
	color?: string;
}

// Types for comment operations
export interface CommentCreateData {
	content: string;
	card_id: number;
}

export interface CommentUpdateData {
	content: string;
}

export interface ChecklistItem {
	id: number;
	content: string;
	completed: boolean;
}

export interface Checklist {
	id: number;
	title: string;
	items: ChecklistItem[];
}
