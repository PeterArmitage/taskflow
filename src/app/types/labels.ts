// types/labels.ts
import { Label } from './boards';

export type LabelType = 'priority' | 'status' | 'category' | 'custom';

export interface LabelTemplate {
	name: string;
	color: string;
	description: string;
	type: LabelType;
}

export interface LabelData {
	type: LabelType;
	name: string;
	color: string;
	description?: string;
}

export interface LabelCreateData {
	name: string;
	color: string;
	type?: string;
}
export interface LabelManagerProps {
	cardId: number;
	labels: Label[];
	onUpdate: (label: Label[]) => Promise<void>;
	disabled?: boolean;
	className?: string;
}

export interface LabelWizardProps extends LabelManagerProps {
	onClose: () => void;
	isOpen: boolean;
}

export interface LabelDisplayProps {
	label: Label;
	onDelete?: () => void;
	disabled?: boolean;
	className?: string;
}

// Predefined label templates
export const LABEL_TEMPLATES: Record<LabelType, LabelTemplate[]> = {
	priority: [
		{
			name: 'High Priority',
			color: '#ef4444',
			description: 'Urgent attention required',
			type: 'priority',
		},
		{
			name: 'Medium Priority',
			color: '#f59e0b',
			description: 'Important but not urgent',
			type: 'priority',
		},
		{
			name: 'Low Priority',
			color: '#10b981',
			description: 'Can be addressed later',
			type: 'priority',
		},
	],
	status: [
		{
			name: 'In Progress',
			color: '#3b82f6',
			description: 'Currently being worked on',
			type: 'status',
		},
		{
			name: 'Blocked',
			color: '#ef4444',
			description: 'Cannot proceed due to dependencies',
			type: 'status',
		},
		{
			name: 'Done',
			color: '#10b981',
			description: 'Completed work',
			type: 'status',
		},
	],
	category: [
		{
			name: 'Feature',
			color: '#8b5cf6',
			description: 'New functionality',
			type: 'category',
		},
		{
			name: 'Bug',
			color: '#ef4444',
			description: 'Issue that needs fixing',
			type: 'category',
		},
		{
			name: 'Enhancement',
			color: '#10b981',
			description: 'Improvement to existing feature',
			type: 'category',
		},
	],
	custom: [],
};

// API request/response types
// Matches exactly what the FastAPI endpoint expects
export interface CreateLabelRequest {
	name: string;
	color: string;
	type?: LabelType;
}

export interface UpdateLabelRequest extends Partial<CreateLabelRequest> {
	id: number;
}

export interface LabelResponse extends Label {
	type?: LabelType;
	description?: string;
}

// Type guards
export function isLabelTemplate(value: unknown): value is LabelTemplate {
	if (!value || typeof value !== 'object') return false;
	const template = value as LabelTemplate;
	return (
		typeof template.name === 'string' &&
		typeof template.color === 'string' &&
		typeof template.type === 'string' &&
		typeof template.description === 'string'
	);
}

export function isLabelType(value: string): value is LabelType {
	return ['priority', 'status', 'category', 'custom'].includes(value);
}
