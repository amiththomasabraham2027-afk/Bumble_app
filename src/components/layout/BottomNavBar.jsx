'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, MessageCircle, User } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Discover', href: '/discover', icon: Flame },
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Chat', href: '/matches/[id]', matchPrefix: '/matches/', icon: MessageCircle }, // Matches any specific chat
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Do not show the bottom nav in chat threads or auth routes
  if (['/splash', '/login', '/register', '/settings', '/admin'].includes(pathname) || 
      pathname.match(/^\/matches\/[a-zA-Z0-9]+$/)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E0E0E0] pb-safe z-50">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-[64px]">
        {tabs.map((tab) => {
          // Special active case for Matches tab (should not be active if inside a chat thread)
          let isActive = pathname === tab.href;
          
          if (tab.name === 'Chat') {
            // Chat tab is active ONLY if we are inside a specific thread
            isActive = pathname !== '/matches' && pathname.startsWith('/matches/');
            // But we don't render this tab if we are inside a thread (nav is hidden).
            // This is just a placeholder if you wanted a distinct Chat tab in the nav.
            // In Bumble, the chat is usually a sub-tab of matches. The PRD lists 4 tabs.
          } else if (tab.name === 'Matches') {
            isActive = pathname === '/matches';
          }

          const Icon = tab.icon;

          return (
            <Link 
              key={tab.name} 
              href={tab.name === 'Chat' ? '/matches' : tab.href} // Clicking Chat generic tab routes to matches list
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-colors ${isActive ? 'text-[#FFC629] fill-[#FFC629]/20' : 'text-[#9CA3AF]'}`}
              />
              <span className={`text-[11px] font-medium ${isActive ? 'text-[#FFC629]' : 'text-[#9CA3AF]'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
