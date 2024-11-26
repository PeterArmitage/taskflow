// types/settings.ts
export interface EmailPreferences {
	notifications: {
		cardDue: boolean;
		mentionedInCard: boolean;
		cardAssigned: boolean;
		boardInvites: boolean;
		weeklyDigest: boolean;
	};
	marketing: {
		newsletter: boolean;
		productUpdates: boolean;
		tips: boolean;
	};
}

export interface SecuritySettings {
	twoFactorEnabled: boolean;
	lastPasswordChange: string;
	activeSessions: Session[];
}

export interface Session {
	id: string;
	device: string;
	browser: string;
	location: string;
	lastActive: string;
	current: boolean;
}

export interface ThemePreferences {
	theme: 'light' | 'dark' | 'system';
	fontSize: 'small' | 'medium' | 'large';
	reducedMotion: boolean;
	highContrast: boolean;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface UserSettings {
	id: number;
	userId: number;
	emailPreferences: EmailPreferences;
	security: SecuritySettings;
	theme: ThemePreferences;
	language: Language;
	updatedAt: string;
}
