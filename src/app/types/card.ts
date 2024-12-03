import { Attachment } from './attachment';
import { Comment, Label } from './boards';
import { Nullable } from './helpers';

export interface Card extends CardData {
	id: number;
	title: string;
	description?: string;
	list_id: number;
	created_at: string;
	updated_at: string;
	due_date?: string;
	labels: Label[];
	attachments: Attachment[];
	comments: Comment[];
	attachments_count: number;
	comments_count?: number;
}

export interface List {
	id: number;
	title: string;
	cards: Card[];
}

export interface Board {
	id: number;
	title: string;
	lists: List[];
}

export interface CardData {
	title: string;
	description?: string;
	list_id: number;
	due_date?: Nullable<string>;
	position?: number;
	labels?: Label[];
	comments?: Comment[];
}

export type CardUpdateData = Partial<CardData>;
export interface CardCreateData extends Pick<CardData, 'title' | 'list_id'> {
	description?: string;
}
