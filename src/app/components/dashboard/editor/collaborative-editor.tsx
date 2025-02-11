// components/dashboard/editor/collaborative-editor.tsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborativeEditing } from '@/app/hooks/use-collaborative-editing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	IconLoader2,
	IconArrowBackUp,
	IconArrowForwardUp,
	IconUsers,
} from '@tabler/icons-react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface CollaborativeEditorProps {
	cardId: number;
	initialContent: string;
	onSave?: (content: string) => Promise<void>;
	className?: string;
	placeholder?: string;
}

interface CursorOverlay {
	userId: number;
	username: string;
	color: string;
	position: { top: number; left: number };
}

export function CollaborativeEditor({
	cardId,
	initialContent,
	onSave,
	className,
	placeholder,
}: CollaborativeEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [cursorOverlays, setCursorOverlays] = useState<CursorOverlay[]>([]);

	const {
		content,
		isConnected,
		cursors,
		insertText,
		deleteText,
		updateCursor,
		undo,
		redo,
		canUndo,
		canRedo,
	} = useCollaborativeEditing({
		cardId,
		initialContent,
		onContentChange: async (newContent) => {
			if (onSave) {
				setIsSaving(true);
				try {
					await onSave(newContent);
				} finally {
					setIsSaving(false);
				}
			}
		},
	});

	// Handle cursor position updates
	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return;

		const updateCursorOverlays = () => {
			const newOverlays: CursorOverlay[] = [];
			cursors.forEach((cursor) => {
				const range = document.createRange();
				const startNode = editor.firstChild || editor;
				range.setStart(startNode, cursor.position.start);

				const rect = range.getBoundingClientRect();
				const editorRect = editor.getBoundingClientRect();

				newOverlays.push({
					userId: cursor.user.id,
					username: cursor.user.username,
					color: cursor.user.color,
					position: {
						top: rect.top - editorRect.top,
						left: rect.left - editorRect.left,
					},
				});
			});
			setCursorOverlays(newOverlays);
		};

		updateCursorOverlays();
	}, [cursors]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
				e.preventDefault();
				if (e.shiftKey) {
					redo();
				} else {
					undo();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [undo, redo]);

	// Handle selection changes
	useEffect(() => {
		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (!selection || !editorRef.current) return;

			const range = selection.getRangeAt(0);
			if (!editorRef.current.contains(range.commonAncestorContainer)) return;

			updateCursor(range.startOffset, range.endOffset);
		};

		document.addEventListener('selectionchange', handleSelectionChange);
		return () =>
			document.removeEventListener('selectionchange', handleSelectionChange);
	}, [updateCursor]);

	// Handle text input and deletion
	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement;
		const selection = window.getSelection();
		if (!selection) return;

		const position = selection.anchorOffset;
		const text = target.textContent || '';

		// Determine if text was inserted or deleted
		if (text.length > content.length) {
			const insertedText = text.slice(position - 1, position);
			insertText(position - 1, insertedText);
		} else if (text.length < content.length) {
			const deletedLength = content.length - text.length;
			deleteText(position, deletedLength);
		}
	};

	return (
		<div className='relative'>
			{/* Toolbar */}
			<div className='flex items-center justify-between mb-2'>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						onClick={undo}
						disabled={!canUndo}
						className='h-8 w-8 p-0'
					>
						<IconArrowBackUp className='h-4 w-4' />
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={redo}
						disabled={!canRedo}
						className='h-8 w-8 p-0'
					>
						<IconArrowForwardUp className='h-4 w-4' />
					</Button>
				</div>

				<div className='flex items-center gap-2'>
					{isSaving && (
						<IconLoader2 className='h-4 w-4 animate-spin text-neutral-500' />
					)}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='flex items-center gap-1'>
								<IconUsers className='h-4 w-4' />
								<span className='text-sm text-neutral-500'>
									{cursors.size} active
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<div className='space-y-1'>
								{Array.from(cursors.values()).map((cursor) => (
									<div
										key={cursor.user.id}
										className='flex items-center gap-2'
										style={{ color: cursor.user.color }}
									>
										<div
											className='w-2 h-2 rounded-full'
											style={{ backgroundColor: cursor.user.color }}
										/>
										<span>{cursor.user.username}</span>
									</div>
								))}
							</div>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Editor */}
			<div className='relative'>
				<div
					ref={editorRef}
					contentEditable
					onInput={handleInput}
					className={cn(
						'min-h-[150px] p-3 rounded-lg border',
						'border-neutral-200 dark:border-neutral-800',
						'focus:outline-none focus:ring-2 focus:ring-blue-500',
						'prose dark:prose-invert max-w-none',
						!content &&
							'before:text-neutral-500 before:content-[attr(data-placeholder)]',
						className
					)}
					data-placeholder={placeholder}
					dangerouslySetInnerHTML={{ __html: content }}
				/>

				{/* Cursor Overlays */}
				<AnimatePresence>
					{cursorOverlays.map((overlay) => (
						<motion.div
							key={overlay.userId}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className='absolute pointer-events-none'
							style={{
								top: overlay.position.top,
								left: overlay.position.left,
							}}
						>
							<div
								className='w-0.5 h-5 -mt-1'
								style={{ backgroundColor: overlay.color }}
							/>
							<div
								className='absolute top-0 left-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap'
								style={{ backgroundColor: overlay.color }}
							>
								{overlay.username}
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{/* Connection Status */}
				<div className='absolute bottom-2 right-2'>
					<div
						className={cn(
							'w-2 h-2 rounded-full',
							isConnected ? 'bg-green-500' : 'bg-red-500'
						)}
					/>
				</div>
			</div>
		</div>
	);
}
