// types/api-responses.ts

import { Board, Card, List, Label, Comment, Activity } from './boards';

// Base API Response interface that all responses extend
interface ApiResponse<T> {
	data: T;
	message?: string;
	status: 'success' | 'error';
}

// Error response type
export interface ApiError {
	status: 'error';
	message: string;
	code?: string;
	details?: Record<string, string[]>;
}

// Pagination metadata
export interface PaginationMeta {
	current_page: number;
	total_pages: number;
	total_items: number;
	items_per_page: number;
}

// Paginated response interface
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	meta: PaginationMeta;
}

// Specific response types for each entity
export type BoardResponse = ApiResponse<Board>;
export type BoardsResponse = PaginatedResponse<Board>;
export type CardResponse = ApiResponse<Card>;
export type CardsResponse = PaginatedResponse<Card>;
export type ListResponse = ApiResponse<List>;
export type ListsResponse = PaginatedResponse<List>;

// Response types for card-related operations
export interface CardUpdateResponse extends ApiResponse<Card> {
	included?: {
		labels?: Label[];
		comments?: Comment[];
		activities?: Activity[];
	};
}

export type CardMoveResponse = ApiResponse<{
	card: Card;
	source_list: List;
	target_list: List;
}>;

export type BatchOperationResponse = ApiResponse<{
	succeeded: number;
	failed: number;
	errors?: Record<string, string>;
}>;

export type SearchResponse = ApiResponse<{
	cards: Card[];
	boards: Board[];
	lists: List[];
	total_results: number;
}>;
