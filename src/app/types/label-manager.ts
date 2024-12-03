import { Label } from './boards';

export interface LabelManagerProps {
	cardId: number;
	labels: Label[];
	onUpdate: (labels: Label[]) => void;
	disabled?: boolean;
	className?: string;
}

export interface LabelColor {
	value: string;
	name: string;
}
