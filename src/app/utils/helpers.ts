// utils/helpers.ts
export const generateTempCommentId = () =>
	`temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const generateUniqueId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2)}`;
