// types/error.ts
export interface ApiErrorData {
	detail?: string;
	message?: string;
	errors?: Record<string, string[]>;
	status?: number;
}

export interface ApiErrorResponse {
	data: ApiErrorData;
	status: number;
	statusText?: string;
}

export class ApiError extends Error {
	response?: ApiErrorResponse;
	status?: number;

	constructor(message: string, response?: ApiErrorResponse) {
		super(message);
		this.name = 'ApiError';
		this.response = response;
		this.status = response?.status;
	}
}
