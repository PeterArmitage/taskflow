// components/dashboard/sidebar/sidebar-context.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarContext() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebarContext must be used within a SidebarProvider');
	}
	return context;
}

export function SidebarContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	// Handle mobile detection
	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < 768);
		}

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
			{children}
		</SidebarContext.Provider>
	);
}
