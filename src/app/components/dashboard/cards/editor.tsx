import {
	useCallback,
	useRef,
	forwardRef,
	useImperativeHandle,
	useState,
	useEffect,
} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
	IconBold,
	IconItalic,
	IconList,
	IconListNumbers,
	IconLink,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// Define our interfaces
export interface EditorRef {
	dom: HTMLDivElement | null;
	innerHTML: string;
	focus: () => void;
	insertText: (text: string) => void;
	setContent: (content: string) => void;
}

export interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
	onFocus?: () => void;
	onBlur?: () => void;
}

// This interface properly defines what we need to store about selection
interface SelectionState {
	startPath: number[];
	startOffset: number;
	endPath: number[];
	endOffset: number;
}

export const Editor = forwardRef<EditorRef, EditorProps>(
	(
		{
			content,
			onChange,
			placeholder,
			readOnly = false,
			className,
			onFocus,
			onBlur,
		},
		forwardedRef
	) => {
		const contentRef = useRef<HTMLDivElement>(null);
		const [selectionState, setSelectionState] = useState<SelectionState | null>(
			null
		);
		const isComposingRef = useRef(false);

		const getNodePath = (node: Node, root: Node): number[] => {
			const path: number[] = [];
			let currentNode: Node | null = node;

			// Traverse up the tree until we reach the root
			while (currentNode && currentNode !== root && currentNode.parentNode) {
				// Type the parent node as ParentNode & Node
				const parent = currentNode.parentNode as ParentNode & Node;
				// Get the index of the current node among its siblings
				const index = Array.from(parent.childNodes).indexOf(
					currentNode as ChildNode
				);
				// Add the index to the start of our path
				path.unshift(index);
				// Move up to the parent
				currentNode = parent;
			}

			return path;
		};
		const getNodeFromPath = (path: number[], root: Node): Node | null => {
			let current: Node = root;

			for (const index of path) {
				const children = current.childNodes;
				if (index < 0 || index >= children.length) {
					return null;
				}
				current = children[index];
			}

			return current;
		};

		const saveCurrentSelection = useCallback(() => {
			if (!contentRef.current) return null;

			const selection = window.getSelection();
			if (!selection || !selection.rangeCount) return null;

			const range = selection.getRangeAt(0);
			if (!contentRef.current.contains(range.commonAncestorContainer))
				return null;

			// Here we're working with the actual DOM nodes
			const state: SelectionState = {
				startPath: getNodePath(range.startContainer, contentRef.current),
				startOffset: range.startOffset,
				endPath: getNodePath(range.endContainer, contentRef.current),
				endOffset: range.endOffset,
			};

			setSelectionState(state);
			return state;
		}, []);

		// Helper function to restore the selection
		const restoreSelection = useCallback(
			(state: SelectionState | null = selectionState) => {
				if (!state || !contentRef.current) return;

				try {
					const startNode = getNodeFromPath(
						state.startPath,
						contentRef.current
					);
					const endNode = getNodeFromPath(state.endPath, contentRef.current);

					// Make sure we have valid nodes before creating the range
					if (startNode && endNode) {
						const range = document.createRange();
						range.setStart(startNode, state.startOffset);
						range.setEnd(endNode, state.endOffset);

						const selection = window.getSelection();
						if (selection) {
							selection.removeAllRanges();
							selection.addRange(range);
						}

						// Ensure the editor maintains focus
						contentRef.current.focus();
					}
				} catch (error) {
					console.warn('Failed to restore selection:', error);
				}
			},
			[selectionState]
		);

		// Handle input changes while preserving cursor position
		const handleInput = useCallback(
			(e: React.FormEvent<HTMLDivElement>) => {
				if (readOnly || isComposingRef.current) return;

				const target = e.target as HTMLDivElement;
				const currentSelection = saveCurrentSelection();

				onChange(target.innerHTML);

				// Ensure we restore selection after React has processed the update
				if (currentSelection) {
					requestAnimationFrame(() => {
						if (target.isConnected) {
							// Check if the element is still in the DOM
							restoreSelection(currentSelection);
						}
					});
				}
			},
			[readOnly, onChange, saveCurrentSelection, restoreSelection]
		);

		// Expose component methods through ref
		useImperativeHandle(
			forwardedRef,
			() => ({
				dom: contentRef.current,
				innerHTML: contentRef.current?.innerHTML || '',
				focus: () => {
					contentRef.current?.focus();
					if (selectionState) {
						restoreSelection();
					}
				},
				insertText: (text: string) => {
					if (!contentRef.current || readOnly) return;

					const selection = window.getSelection();
					if (!selection?.rangeCount) return;

					const range = selection.getRangeAt(0);
					range.deleteContents();
					range.insertNode(document.createTextNode(text));
					range.collapse(false);

					// Trigger input event for consistency
					const event = new InputEvent('input', { bubbles: true });
					contentRef.current.dispatchEvent(event);
				},
				setContent: (newContent: string) => {
					if (contentRef.current) {
						contentRef.current.innerHTML = newContent;
						const event = new InputEvent('input', { bubbles: true });
						contentRef.current.dispatchEvent(event);
					}
				},
			}),
			[readOnly, selectionState, restoreSelection]
		);

		// Handle composition events for IME input
		const handleCompositionStart = useCallback(() => {
			isComposingRef.current = true;
		}, []);

		const handleCompositionEnd = useCallback(
			(e: React.CompositionEvent<HTMLDivElement>) => {
				isComposingRef.current = false;
				handleInput(e as unknown as React.FormEvent<HTMLDivElement>);
			},
			[handleInput]
		);

		// Handle special key events
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent<HTMLDivElement>) => {
				if (readOnly) return;

				if (e.key === 'Tab') {
					e.preventDefault();
					document.execCommand('insertText', false, '    ');
				}
			},
			[readOnly]
		);

		// Handle paste events
		const handlePaste = useCallback(
			(e: React.ClipboardEvent<HTMLDivElement>) => {
				if (readOnly) return;

				e.preventDefault();
				const text = e.clipboardData.getData('text/plain');
				document.execCommand('insertText', false, text);
			},
			[readOnly]
		);

		// Handle formatting commands
		const execCommand = useCallback(
			(command: string, value?: string) => {
				if (readOnly || !contentRef.current) return;

				const currentSelection = saveCurrentSelection();
				document.execCommand(command, false, value);

				onChange(contentRef.current.innerHTML);

				requestAnimationFrame(() => {
					contentRef.current?.focus();
					if (currentSelection) {
						restoreSelection(currentSelection);
					}
				});
			},
			[readOnly, onChange, saveCurrentSelection, restoreSelection]
		);
		useEffect(() => {
			if (contentRef.current && contentRef.current.innerHTML !== content) {
				const isCurrentlyFocused =
					document.activeElement === contentRef.current;
				contentRef.current.innerHTML = content;

				if (isCurrentlyFocused && selectionState) {
					requestAnimationFrame(() => {
						restoreSelection();
					});
				}
			}
		}, [content, restoreSelection, selectionState]);
		return (
			<div className='space-y-2'>
				{/* Toolbar */}
				{!readOnly && (
					<motion.div
						className='flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => execCommand('bold')}
							aria-label='Bold'
						>
							<IconBold className='w-4 h-4' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => execCommand('italic')}
							aria-label='Italic'
						>
							<IconItalic className='w-4 h-4' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => execCommand('insertUnorderedList')}
							aria-label='Bullet List'
						>
							<IconList className='w-4 h-4' />
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => execCommand('insertOrderedList')}
							aria-label='Numbered List'
						>
							<IconListNumbers className='w-4 h-4' />
						</Button>
					</motion.div>
				)}

				{/* Editor Content */}
				<div
					ref={contentRef}
					contentEditable={!readOnly}
					className={cn(
						'min-h-[150px] p-3 rounded-lg border',
						'border-neutral-200 dark:border-neutral-800',
						'focus:outline-none focus:ring-2 focus:ring-blue-500',
						'overflow-y-auto prose dark:prose-invert max-w-none',
						readOnly && 'bg-neutral-50 dark:bg-neutral-900 cursor-default',
						className
					)}
					dangerouslySetInnerHTML={{ __html: content }}
					onInput={handleInput}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
					onFocus={onFocus}
					onBlur={onBlur}
					data-placeholder={placeholder}
					aria-multiline='true'
					role='textbox'
					aria-label={placeholder}
					style={{
						outline: 'none',
						minHeight: '150px',
					}}
				/>
			</div>
		);
	}
);

Editor.displayName = 'Editor';
