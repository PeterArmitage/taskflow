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

// types/settings.ts

export interface ThemeSettings {
	mode: 'light' | 'dark' | 'system';
	customColors: boolean;
	animations: boolean;
	reducedMotion: boolean;
}

export interface LanguageSettings {
	preferred: string;
	dateFormat: string;
	timeFormat: '12h' | '24h';
}

export interface AccessibilitySettings {
	screenReader: boolean;
	highContrast: boolean;
	largeText: boolean;
	keyboardNavigation: boolean;
}

export interface DisplaySettings {
	denseMode: boolean;
	showAvatars: boolean;
	showLabels: boolean;
	compactView: boolean;
}

export interface AdvancedSettings {
	theme: ThemeSettings;
	language: LanguageSettings;
	accessibility: AccessibilitySettings;
	display: DisplaySettings;
}

export interface LanguageOption {
	value: string;
	label: string;
}

export interface DateFormatOption {
	value: string;
	label: string;
}

export interface TimeFormatOption {
	value: '12h' | '24h';
	label: string;
}

export interface SwitchItemProps {
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}
