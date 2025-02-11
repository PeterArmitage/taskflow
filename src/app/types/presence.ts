// types/presence.ts
import { User } from './auth';

export interface UserPresence {
	user: User;
	status: 'active' | 'idle' | 'editing';
	lastActive: string;
	currentCard?: number;
}

export interface CursorPosition {
	x: number;
	y: number;
	timestamp: string;
}

export interface UserCursor extends CursorPosition {
	userId: number;
	username: string;
}
