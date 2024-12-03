'use client';

import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
	IconBold,
	IconItalic,
	IconList,
	IconListNumbers,
	IconLink,
} from '@tabler/icons-react';
import { EditorProps } from '@/app/types/editor';

export function Editor({
	content,
	onChange,
	placeholder = 'Start typing...',
	readOnly = false,
	className,
}: EditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);

	const execCommand = useCallback(
		(command: string, value?: string) => {
			document.execCommand(command, false, value);

			// Update content after command execution
			if (editorRef.current) {
				onChange(editorRef.current.innerHTML);
			}
		},
		[onChange]
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			execCommand('insertText', '    ');
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const text = e.clipboardData.getData('text/plain');
		execCommand('insertText', text);
	};

	return (
		<div className='space-y-2'>
			{/* Toolbar */}
			<motion.div
				className='flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg'
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => execCommand('bold')}
					className='p-2 h-8 w-8'
				>
					<IconBold className='h-4 w-4' />
				</Button>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => execCommand('italic')}
					className='p-2 h-8 w-8'
				>
					<IconItalic className='h-4 w-4' />
				</Button>
				<div className='w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1' />
				<Button
					variant='ghost'
					size='sm'
					onClick={() => execCommand('insertUnorderedList')}
					className='p-2 h-8 w-8'
				>
					<IconList className='h-4 w-4' />
				</Button>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => execCommand('insertOrderedList')}
					className='p-2 h-8 w-8'
				>
					<IconListNumbers className='h-4 w-4' />
				</Button>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => {
						const url = window.prompt('Enter link URL:');
						if (url) execCommand('createLink', url);
					}}
					className='p-2 h-8 w-8'
				>
					<IconLink className='h-4 w-4' />
				</Button>
			</motion.div>

			{/* Editable Content Area */}
			<div
				ref={editorRef}
				contentEditable
				className='min-h-[150px] p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto'
				dangerouslySetInnerHTML={{ __html: content }}
				onInput={(e) => onChange(e.currentTarget.innerHTML)}
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
				data-placeholder={placeholder}
			/>
		</div>
	);
}
