// hooks/use-collaborative-editing.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import { useAuth } from './useAuth';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import {
	isEditData,
	WebSocketCursorData,
	WebSocketEditData,
} from '../types/websocket';
import { toFrontendFormat, toBackendFormat } from '@/app/utils/data-transforms';

interface CursorPosition {
	user: {
		id: number;
		username: string;
		color: string;
	};
	position: {
		start: number;
		end: number;
	};
}

interface CollaborativeEditingOptions {
	cardId: number;
	initialContent: string;
	onContentChange?: (content: string) => void;
}

interface Operation {
	id: string;
	type: 'insert' | 'delete';
	position: number;
	content?: string;
	length?: number;
	timestamp: number;
	userId: number;
}

export function useCollaborativeEditing({
	cardId,
	initialContent,
	onContentChange,
}: CollaborativeEditingOptions) {
	const { user } = useAuth();
	const { toast } = useToast();
	const [content, setContent] = useState(initialContent);
	const [cursors, setCursors] = useState<Map<number, CursorPosition>>(
		new Map()
	);
	const [isConnected, setIsConnected] = useState(false);

	// YJS document references
	const ydoc = useRef<Y.Doc>();
	const ytext = useRef<Y.Text>();
	const provider = useRef<WebsocketProvider>();
	const persistence = useRef<IndexeddbPersistence>();

	// Operation history for undo/redo
	const [undoStack, setUndoStack] = useState<Operation[]>([]);
	const [redoStack, setRedoStack] = useState<Operation[]>([]);

	// WebSocket connection for real-time updates
	const { sendMessage } = useWebSocket({
		boardId: cardId,
		cardId,
		onMessage: (message) => {
			if (message.type === 'edit' && isEditData(message.data)) {
				// Transform incoming backend data to frontend format
				const operation: Operation = {
					id: message.data.id,
					type: message.data.type,
					position: message.data.position,
					content: message.data.content,
					length: message.data.length,
					timestamp: message.data.timestamp,
					userId: message.data.userId,
				};
				handleIncomingEdit(operation);
			}
		},
	});

	// Initialize YJS document and providers
	useEffect(() => {
		if (!user) return;

		ydoc.current = new Y.Doc();
		ytext.current = ydoc.current.getText('content');

		// Set up WebSocket provider
		provider.current = new WebsocketProvider(
			process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234',
			`card-${cardId}`,
			ydoc.current
		);

		// Set up IndexedDB persistence
		persistence.current = new IndexeddbPersistence(
			`card-${cardId}`,
			ydoc.current
		);

		// Handle connection status
		provider.current.on(
			'status',
			({ status }: { status: 'connected' | 'disconnected' | 'connecting' }) => {
				setIsConnected(status === 'connected');
				if (status === 'connected') {
					toast({
						title: 'Connected',
						description: 'Real-time collaboration enabled',
					});
				} else {
					toast({
						title: 'Disconnected',
						description: 'Trying to reconnect...',
						variant: 'destructive',
					});
				}
			}
		);

		// Initialize content
		if (ytext.current && !ytext.current.length) {
			ytext.current.insert(0, initialContent);
		}

		// Observe changes
		ytext.current?.observe((event: Y.YTextEvent) => {
			const newContent = ytext.current?.toString() || '';
			setContent(newContent);
			onContentChange?.(newContent);
		});

		return () => {
			provider.current?.destroy();
			persistence.current?.destroy();
			ydoc.current?.destroy();
		};
	}, [cardId, user, initialContent, onContentChange, toast]);

	// Handle incoming edits from other users
	const handleIncomingEdit = useCallback(
		(operation: Operation) => {
			if (!ytext.current || operation.userId === user?.id) return;

			try {
				if (operation.type === 'insert' && operation.content) {
					ytext.current.insert(operation.position, operation.content);
				} else if (operation.type === 'delete' && operation.length) {
					ytext.current.delete(operation.position, operation.length);
				}
			} catch (error) {
				console.error('Error applying operation:', error);
			}
		},
		[user?.id]
	);

	// Update cursor position
	const updateCursor = useCallback(
		(start: number, end: number) => {
			if (!user || !isConnected) return;

			const cursorData: WebSocketCursorData = {
				userId: user.id,
				user: {
					id: user.id,
					username: user.username,
					color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
				},
				position: { start, end },
			};

			sendMessage({
				type: 'cursor',
				action: 'update',
				cardId,
				data: cursorData,
			});
		},
		[user, isConnected, cardId, sendMessage]
	);

	// Apply local edit operation
	const applyOperation = useCallback(
		(operation: Operation) => {
			if (!ytext.current) return;

			try {
				const editData: WebSocketEditData = {
					...operation,
					userId: user?.id || 0,
				};

				// Broadcast operation
				sendMessage({
					type: 'edit',
					action: operation.type,
					cardId,
					data: editData,
				});

				// Apply operation locally
				if (operation.type === 'insert' && operation.content) {
					ytext.current.insert(operation.position, operation.content);
				} else if (operation.type === 'delete' && operation.length) {
					ytext.current.delete(operation.position, operation.length);
				}
			} catch (error) {
				console.error('Error applying operation:', error);
			}
		},
		[cardId, sendMessage, user]
	);

	// Insert text at position
	const insertText = useCallback(
		(position: number, text: string) => {
			const operation: Operation = {
				id: nanoid(),
				type: 'insert',
				position,
				content: text,
				timestamp: Date.now(),
				userId: user?.id || 0,
			};
			applyOperation(operation);
		},
		[applyOperation, user]
	);

	// Delete text at position
	const deleteText = useCallback(
		(position: number, length: number) => {
			const operation: Operation = {
				id: nanoid(),
				type: 'delete',
				position,
				length,
				timestamp: Date.now(),
				userId: user?.id || 0,
			};
			applyOperation(operation);
		},
		[applyOperation, user]
	);

	// Undo last operation
	const undo = useCallback(() => {
		const lastOperation = undoStack[undoStack.length - 1];
		if (!lastOperation) return;

		// Remove from undo stack
		setUndoStack((prev) => prev.slice(0, -1));

		// Add inverse operation to redo stack
		const inverseOperation: Operation = {
			...lastOperation,
			id: nanoid(),
			type: lastOperation.type === 'insert' ? 'delete' : 'insert',
			timestamp: Date.now(),
		};
		setRedoStack((prev) => [...prev, inverseOperation]);

		// Apply inverse operation
		applyOperation(inverseOperation);
	}, [undoStack, applyOperation]);

	// Redo last undone operation
	const redo = useCallback(() => {
		const lastOperation = redoStack[redoStack.length - 1];
		if (!lastOperation) return;

		// Remove from redo stack
		setRedoStack((prev) => prev.slice(0, -1));

		// Add inverse operation to undo stack
		const inverseOperation: Operation = {
			...lastOperation,
			id: nanoid(),
			type: lastOperation.type === 'insert' ? 'delete' : 'insert',
			timestamp: Date.now(),
		};
		setUndoStack((prev) => [...prev, inverseOperation]);

		// Apply inverse operation
		applyOperation(inverseOperation);
	}, [redoStack, applyOperation]);

	return {
		content,
		isConnected,
		cursors,
		insertText,
		deleteText,
		updateCursor,
		undo,
		redo,
		canUndo: undoStack.length > 0,
		canRedo: redoStack.length > 0,
	};
}
