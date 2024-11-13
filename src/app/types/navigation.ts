// types/navigation.ts
export interface NavItem {
	title: string;
	type: 'section' | 'page';
	href: string;
	items?: {
		title: string;
		description: string;
		icon: React.ReactNode;
		href: string;
		type: 'section' | 'page';
	}[];
}
