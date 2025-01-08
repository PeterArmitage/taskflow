export interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}

export interface EditorRef {
	editor?: {
		view?: {
			dom?: HTMLElement;
		};
	};
}
