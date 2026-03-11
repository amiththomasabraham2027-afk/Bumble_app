'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Heart } from 'lucide-react';

export default function Matches() {
  const [activeTab, setActiveTab] = useState('matches');

  // Mock data for Matches Tab
  const newMatches = [
    { id: '1', name: 'Sarah', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isOnline: true },
    { id: '2', name: 'Emma', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', isOnline: false, unread: true },
    { id: '3', name: 'Chloe', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', isOnline: true },
    { id: '4', name: 'Mia', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isOnline: false },
  ];

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

  // Mock data for Beeline Tab
  const beelineCount = 12;

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
          <>
            {/* New Matches Horizontal List */}
            {newMatches.length > 0 && (
              <div className="mb-6">
                <h2 className="px-4 text-[15px] font-bold text-[#1A1A1A] mb-3">New Matches</h2>
                <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar">
                  {newMatches.map(match => (
                    <Link key={match.id} href={`/matches/${match.id}`} className="snap-start flex flex-col items-center gap-1 min-w-[72px]">
                      <div className={`relative w-[72px] h-[72px] rounded-full p-[2px] ${match.unread ? 'bg-[#FFC629]' : 'bg-transparent'}`}>
                        <img src={match.imageUrl} className="w-full h-full rounded-full object-cover border-2 border-white" alt={match.name} />
                        {match.isOnline && (
                          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full z-10" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-[#1A1A1A] truncate w-full text-center">{match.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Call to action for chat tab */}
            <div className="px-4 mt-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center mb-4">
                <Heart className="text-[#FFC629]" size={32} />
              </div>
              <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-1">Your Matches</h2>
              <p className="text-[15px] text-[#9CA3AF] mb-6">Head over to the Chat tab to start a conversation!</p>
              <Link href="/chat" className="px-6 py-2.5 rounded-full bg-[#FFC629] text-[#1A1A1A] font-bold text-[15px] hover:bg-[#FFD966] transition-colors">
                View Conversations
              </Link>
            </div>
          </>
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
