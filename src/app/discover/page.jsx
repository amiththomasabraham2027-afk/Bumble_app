'use client';

import { useState, useEffect } from 'react';
import SwipeDeck from '@/components/SwipeDeck';
import TopBar from '@/components/layout/TopBar';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Search } from 'lucide-react';

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For MV redesign, we'll use placeholder mock data matching the new schema
    const mockProfiles = [
      {
        _id: '1',
        name: 'Sarah',
        age: 26,
        bio: 'Love hiking and good coffee. Looking for someone to explore the city with.',
        imageUrls: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop'],
        location: 'New York, NY',
        interests: ['Hiking', 'Coffee', 'Photography'],
        isVerified: true,
      },
      {
        _id: '2',
        name: 'Alex',
        age: 28,
        bio: 'Photographer and dog lover. Let\'s grab a drink.',
        imageUrls: ['https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=500&fit=crop'],
        location: 'Brooklyn, NY',
        interests: ['Dogs', 'Art', 'Breweries'],
        isVerified: false,
      },
      {
        _id: '3',
        name: 'Emma',
        age: 24,
        bio: 'Just moved here! Show me your favorite spots.',
        imageUrls: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop'],
        location: 'Jersey City, NJ',
        interests: ['Foodie', 'Travel', 'Baking', 'Museums'],
        isVerified: true,
      },
    ];

    setProfiles(mockProfiles);
    setLoading(false);
  }, []);

  const handleSwipe = async (profileId, direction) => {
    // direction is 'left' or 'right'
    // REVERSE MECHANICS: Left = Like, Right = Pass
    console.log(`Swiped ${direction} on ${profileId}`);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F5F5F5] overflow-hidden">
      <TopBar variant="logo-center" />

      <main className="flex-1 relative flex flex-col items-center justify-center pt-4 pb-4 overflow-hidden px-4">
        {loading ? (
          <div className="w-12 h-12 border-4 border-[#FFC629] border-t-transparent rounded-full animate-spin" />
        ) : profiles.length > 0 ? (
          <SwipeDeck profiles={profiles} onSwipe={handleSwipe} />
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
