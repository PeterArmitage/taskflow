import { api } from './api';
import { Attachment } from '@/app/types/attachment';

export const attachmentApi = {
	async uploadAttachment(cardId: number, file: File): Promise<Attachment> {
		const formData = new FormData();
		formData.append('file', file);

		const response = await api.post(`/cards/${cardId}/attachments`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.data;
	},

	async deleteAttachment(attachmentId: number): Promise<void> {
		await api.delete(`/attachments/${attachmentId}`);
	},

	async getAttachments(cardId: number): Promise<Attachment[]> {
		const response = await api.get(`/cards/${cardId}/attachments`);
		return response.data;
	},
};
