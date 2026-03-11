'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, MessageCircle, User } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Discover', href: '/discover', icon: Flame },
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Do not show the bottom nav in chat threads or auth routes
  if (['/splash', '/login', '/register', '/settings', '/admin'].includes(pathname) || 
      pathname.match(/^\/chat\/[a-zA-Z0-9]+$/)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E0E0E0] pb-safe z-50">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-[64px]">
        {tabs.map((tab) => {
          let isActive = pathname === tab.href;
          
          if (tab.name === 'Chat') {
            isActive = pathname === '/chat' || pathname.startsWith('/chat/');
          }

          const Icon = tab.icon;

          return (
            <Link 
              key={tab.name} 
              href={tab.href}
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
