export interface Attachment {
	id: number;
	filename: string;
	file_path: string;
	size: number;
	mime_type: string;
	uploaded_at: string;
	card_id: number;
}

export interface UploadProgress {
	progress: number;
	status: 'uploading' | 'complete' | 'error';
	filename: string;
}
