'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { MessageCircle } from 'lucide-react';

export default function ChatList() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/matches');
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchMatches();
  }, [session]);

  const getOtherUser = (match) => {
    return match.users?.find(u => u.email !== session?.user?.email) || match.users?.[0];
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <TopBar variant="title-center" title="Chats" />

      <main className="flex-1 overflow-y-auto pb-[80px] pt-4">
        <div className="px-4">
          <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-3">Conversations</h2>
          
          {loading ? (
            <div className="flex items-center justify-center pt-10">
              <div className="w-8 h-8 border-4 border-[#FFC629] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : matches.length > 0 ? (
            <div className="flex flex-col">
              {matches.map(match => {
                const other = getOtherUser(match);
                const lastMsg = match.messages?.[match.messages.length - 1];
                return (
                <Link key={match._id} href={`/chat/${match._id}`} className="flex items-center gap-3 py-3 border-b border-[#F0F0F0] active:bg-[#F5F5F5] transition-colors rounded-lg -mx-2 px-2">
                   <div className="relative w-[56px] h-[56px] flex-shrink-0">
                     <img src={other?.imageUrls?.[0] || 'https://placehold.co/100x100/eeeeee/999999?text=User'} className="w-full h-full rounded-full object-cover" alt={other?.firstName || 'Match'} />
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-baseline mb-0.5">
                       <span className="text-[15px] font-semibold text-[#1A1A1A] truncate">{other?.firstName || other?.name?.split(' ')[0] || 'Match'}</span>
                       <span className="text-[11px] text-[#9CA3AF] flex-shrink-0 ml-2">{formatTime(lastMsg?.createdAt || match.updatedAt)}</span>
                     </div>
                     <p className="text-[13px] text-[#6B7280] truncate">
                       {lastMsg?.text || 'Say hello! 👋'}
                     </p>
                   </div>
                </Link>
                );
              })}
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
