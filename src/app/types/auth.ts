export interface User {
	id: number;
	username: string;
	email: string;
	created_at: string;
	updated_at?: string;
	avatar_url?: string;
	name?: string;
	bio?: string;
	token?: string;
}

export interface AuthFormData {
	email: string;
	password: string;
	username?: string;
	rememberMe?: boolean;
}

export interface AuthResponse {
	user: User;
	access_token: string;
	token_type: string;
}

export interface AuthError {
	message: string;
	field?: string;
	code?: string;
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

export interface PasswordResetRequest {
	email: string;
}

export interface PasswordResetVerify {
	token: string;
}

export interface PasswordReset {
	password: string;
	token: string;
}

export type ApiErrorResponse = {
	response?: {
		data?: {
			detail?: string;
		};
		status?: number;
	};
	message?: string;
};

export interface ProfileUpdateData {
	username?: string;
	email?: string;
	name?: string;
	bio?: string;
	avatar_url?: string;
}

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: AuthError | null;
	signup: (data: AuthFormData) => Promise<AuthResponse>;
	signin: (data: AuthFormData) => Promise<AuthResponse>;
	signout: () => Promise<void>;
	updateUser: (data: Partial<User>) => void;
	getToken: () => string | null;
}

export interface AvatarUpdateResponse {
	avatar_url: string;
}
