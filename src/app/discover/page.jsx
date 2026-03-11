'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SwipeDeck from '@/components/SwipeDeck';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Search } from 'lucide-react';

export default function Discover() {
  const { data: session } = useSession();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        } else {
          console.error("Failed to fetch profiles");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchProfiles();
    }
  }, [session]);

  const handleSwipe = async (profileId, direction) => {
    // direction is 'left' or 'right'
    // REVERSE MECHANICS: Left = Like, Right = Pass
    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profileId, direction }),
      });
      const data = await res.json();
      if (data.match && data.matchData) {
        // Return match info so SwipeDeck can show overlay
        return data;
      }
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F5F5F5] overflow-hidden">
      <TopBar variant="logo-center" />

      <main className="flex-1 relative flex flex-col items-center justify-center pt-4 pb-4 overflow-hidden px-4">
        {loading ? (
          <div className="w-12 h-12 border-4 border-[#FFC629] border-t-transparent rounded-full animate-spin" />
        ) : profiles.length > 0 ? (
          <SwipeDeck 
            profiles={profiles} 
            onSwipe={handleSwipe} 
            currentUser={{ 
              name: session?.user?.name?.split(' ')[0] || 'User', 
              gender: session?.user?.dbProfile?.gender || 'unspecified', 
              imageUrl: session?.user?.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' 
            }} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Search className="text-[#FFC629]" size={36} />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2 leading-tight">You've seen everyone!</h2>
            <p className="text-[15px] text-[#9CA3AF] mb-8 leading-relaxed">Check back later for new profiles.</p>
            <button className="px-8 py-3 rounded-full border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold text-[15px] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Adjust Filters
            </button>
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
}
