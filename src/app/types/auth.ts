export interface User {
	id: string;
	username: string;
	email: string;
	created_at: string;
	updated_at?: string;
}

export interface AuthFormData {
	email: string;
	password: string;
	username?: string; // Optional for registration
}

export interface AuthResponse {
	user: User;
	access_token: string;
	token_type: string;
}

export interface AuthError {
	message: string;
	field?: string;
}

export interface AuthState {
	user: User | null;
	loading: boolean;
	error: AuthError | null;
}

export interface ApiError {
	response?: {
		data?: {
			detail?: string;
		};
	};
}
