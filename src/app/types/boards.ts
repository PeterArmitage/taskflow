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
	comments: Comment[];
	comments_count?: number;
	position: number;
	activities?: Activity[];
	attachments_count: number;
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
	user: User;
}

export interface BoardActivity {
	id: number;
	board_id: number;
	user_id: number;
	action: string;
	details: string;
	created_at: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	avatar_url?: string | null;
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
	user: User;
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

export interface Activity extends Timestamps {
	id: number;
	type:
		| 'card_created'
		| 'card_moved'
		| 'card_updated'
		| 'comment_added'
		| 'label_added';
	card_id: number;
	user_id: number;
	user: User;
	metadata?: Record<string, unknown>;
}

export interface CardCreateData {
	title: string;
	list_id: number;
	description?: string;
	due_date?: string;
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
