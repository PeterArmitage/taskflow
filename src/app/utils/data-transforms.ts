// utils/data-transforms.ts
/**
 * Utility functions to transform data between frontend and backend formats.
 * Frontend uses camelCase (userId) while backend uses snake_case (user_id).
 */

// Type for frontend format
interface FrontendOperation {
	id: string;
	type: 'insert' | 'delete';
	position: number;
	content?: string;
	length?: number;
	timestamp: number;
	userId: number;
}

// Type for backend format
interface BackendOperation {
	id: string;
	type: 'insert' | 'delete';
	position: number;
	content?: string;
	length?: number;
	timestamp: number;
	user_id: number;
}

/**
 * Transforms backend snake_case format to frontend camelCase format
 */
export function toFrontendFormat<T extends { user_id: number }>(
	data: T
): Omit<T, 'user_id'> & { userId: number } {
	const { user_id, ...rest } = data;
	return {
		...rest,
		userId: user_id,
	};
}

/**
 * Transforms frontend camelCase format to backend snake_case format
 */
export function toBackendFormat<T extends { userId: number }>(
	data: T
): Omit<T, 'userId'> & { user_id: number } {
	const { userId, ...rest } = data;
	return {
		...rest,
		user_id: userId,
	};
}
