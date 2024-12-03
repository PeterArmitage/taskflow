export interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}
