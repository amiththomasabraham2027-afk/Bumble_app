'use client';

import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { MessageCircle } from 'lucide-react';

export default function ChatList() {
  const conversations = [
    { 
      id: 'chat1', 
      user: { name: 'Alex', imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=100&h=100&fit=crop', isOnline: true },
      lastMessage: 'That sounds like fun! What time?',
      timestamp: '2m',
      unreadCount: 1,
      initiationPending: false
    },
    { 
      id: 'chat2', 
      user: { name: 'Jessica', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', isOnline: false },
      lastMessage: 'You matched with Jessica',
      timestamp: '1h',
      unreadCount: 0,
      initiationPending: true,
      timeLeft: '18h left'
    },
    { 
      id: 'chat3', 
      user: { name: 'David', imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop', isOnline: false },
      lastMessage: 'Haha absolutely not 🤣',
      timestamp: 'Yesterday',
      unreadCount: 0,
      initiationPending: false
    }
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <TopBar variant="title-center" title="Chats" />

      <main className="flex-1 overflow-y-auto pb-[80px] pt-4">
        <div className="px-4">
          <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-3">Conversations</h2>
          
          {conversations.length > 0 ? (
            <div className="flex flex-col">
              {conversations.map(chat => (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] active:bg-[#F5F5F5] transition-colors rounded-lg -mx-2 px-2">
                   <div className="relative w-[56px] h-[56px] flex-shrink-0">
                     <img src={chat.user.imageUrl} className="w-full h-full rounded-full object-cover" alt={chat.user.name} />
                     {chat.user.isOnline && (
                       <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full z-10" />
                     )}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-0.5">
                       <span className="text-[15px] font-semibold text-[#1A1A1A] truncate">{chat.user.name}</span>
                       <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 ml-2">{chat.timestamp}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <p className={`text-[13px] truncate ${chat.unreadCount > 0 ? 'text-[#1A1A1A] font-medium' : 'text-[#6B7280]'}`}>
                         {chat.lastMessage}
                       </p>
                       {chat.unreadCount > 0 && (
                         <div className="ml-2 w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                           {chat.unreadCount}
                         </div>
                       )}
                       {chat.initiationPending && chat.unreadCount === 0 && (
                         <div className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold flex-shrink-0 whitespace-nowrap">
                           ⏳ {chat.timeLeft}
                         </div>
                       )}
                     </div>
                   </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-10 text-center px-4">
              <div className="w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-[#FFC629]" size={32} />
              </div>
              <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">No chats yet</h2>
              <p className="text-[15px] text-[#9CA3AF] mb-6">Start a conversation with your matches!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
