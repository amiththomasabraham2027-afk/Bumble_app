'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Heart } from 'lucide-react';

export default function Matches() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('matches');
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

  // Split matches into new (no messages) and conversations (has messages)
  const newMatches = matches.filter(m => !m.messages || m.messages.length === 0);
  const conversations = matches.filter(m => m.messages && m.messages.length > 0);

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
      <TopBar variant="title-center" title="Matches" />
      
      {/* Tabs Switcher */}
      <div className="px-4 py-3 bg-white z-10">
        <div className="flex bg-[#F0F0F0] p-1 rounded-full">
          <button 
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-1.5 text-[15px] font-medium rounded-full transition-colors ${activeTab === 'matches' ? 'bg-[#FFC629] text-[#1A1A1A] shadow-sm' : 'text-[#6B7280]'}`}
          >
            Matches
          </button>
          <button 
             onClick={() => setActiveTab('beeline')}
             className={`flex-1 py-1.5 text-[15px] font-medium rounded-full transition-colors ${activeTab === 'beeline' ? 'bg-[#FFC629] text-[#1A1A1A] shadow-sm' : 'text-[#6B7280]'}`}
          >
            Beeline
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-[80px]">
        {activeTab === 'matches' ? (
          loading ? (
            <div className="flex items-center justify-center pt-20">
              <div className="w-8 h-8 border-4 border-[#FFC629] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <EmptyState />
          ) : (
          <>
            {/* New Matches Horizontal List */}
            {newMatches.length > 0 && (
              <div className="mb-6">
                <h2 className="px-4 text-[15px] font-bold text-[#1A1A1A] mb-3">New Matches</h2>
                <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar">
                  {newMatches.map(match => {
                    const other = getOtherUser(match);
                    return (
                    <Link key={match._id} href={`/chat/${match._id}`} className="snap-start flex flex-col items-center gap-1 min-w-[72px]">
                      <div className="relative w-[72px] h-[72px] rounded-full p-[2px] bg-[#FFC629]">
                        <img src={other?.imageUrls?.[0] || 'https://placehold.co/100x100/eeeeee/999999?text=User'} className="w-full h-full rounded-full object-cover border-2 border-white" alt={other?.firstName || 'Match'} />
                      </div>
                      <span className="text-[11px] font-medium text-[#1A1A1A] truncate w-full text-center">{other?.firstName || other?.name?.split(' ')[0] || 'Match'}</span>
                    </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversations with messages */}
            {conversations.length > 0 && (
              <div className="px-4">
                <h2 className="text-[15px] font-bold text-[#1A1A1A] mb-3">Conversations</h2>
                {conversations.map(match => {
                  const other = getOtherUser(match);
                  const lastMsg = match.messages[match.messages.length - 1];
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
                        <p className="text-[13px] text-[#6B7280] truncate">{lastMsg?.text || 'Start a conversation!'}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* CTA when only new matches exist */}
            {conversations.length === 0 && (
              <div className="px-4 mt-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-[#FFC629]" size={32} />
                </div>
                <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">Your Matches</h2>
                <p className="text-[15px] text-[#9CA3AF] mb-6">Tap a match above to start chatting!</p>
              </div>
            )}
          </>
          )
        ) : (
          /* Beeline Tab Content */
          <div className="px-4 pt-4">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-[#1A1A1A]">Interested in you</h2>
                <p className="text-[13px] text-[#6B7280]">Upgrade to MATCHN'T Premium</p>
              </div>
              <div className="bg-[#FFC629] text-[#1A1A1A] font-bold w-8 h-8 rounded-full flex items-center justify-center text-[13px]">
                {beelineCount}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative">
              {[1,2,3,4].map(num => (
                <div key={num} className="relative aspect-[3/4] rounded-[16px] overflow-hidden bg-[#F0F0F0]">
                  <img src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&random=${num}`} className="w-full h-full object-cover blur-xl opacity-80" alt="Blurred admirer" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-white text-[15px] font-bold blur-[4px]">Hidden</span>
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                 <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg mb-4 pointer-events-auto">
                   <Heart size={28} className="text-[#FFC629] fill-[#FFC629]" />
                 </div>
                 <h3 className="text-[18px] font-bold text-white drop-shadow-md mb-2">See who likes you</h3>
                 <button className="px-6 py-2.5 bg-[#FFC629] text-[#1A1A1A] font-bold text-[15px] rounded-full shadow-lg pointer-events-auto active:scale-95 transition-transform">
                   Upgrade Now
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-10 text-center px-4">
      <div className="w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center mb-4">
        <Heart className="text-[#FFC629]" size={32} />
      </div>
      <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">No matches yet</h2>
      <p className="text-[15px] text-[#9CA3AF] mb-6">Keep swiping to find your match!</p>
      <Link href="/discover" className="px-6 py-2.5 rounded-full bg-[#FFC629] text-[#1A1A1A] font-bold text-[15px] hover:bg-[#FFD966] transition-colors">
        Start Swiping
      </Link>
    </div>
  );
}
