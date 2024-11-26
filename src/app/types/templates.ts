// types/templates.ts
export interface BoardTemplate {
	id: number;
	name: string;
	description: string;
	lists: BoardTemplateList[];
	created_by: number;
	created_at: string;
}

export interface BoardTemplateList {
	id: number;
	name: string;
	template_id: number;
	order: number;
}
