// types/user.ts

// Base user interface with required properties
export interface BaseUser {
	id: number;
	username: string;
	email: string;
	avatar_url?: string | undefined;
}

// Auth-specific user type with required timestamps
export interface AuthUser extends BaseUser {
	created_at: string;
	updated_at: string;
}

// Board-specific user type
export interface BoardUser extends BaseUser {
	created_at?: string;
	updated_at?: string;
}

export interface CommentUser extends BaseUser {
	created_at: string;
	updated_at: string;
}
