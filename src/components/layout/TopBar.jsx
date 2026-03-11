'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, SlidersHorizontal, Info, MoreVertical, Flame } from 'lucide-react';

export default function TopBar({ variant = 'logo-center', title = '', onInfoClick, onBackClick }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  // A. Logo-center (Discover)
  if (variant === 'logo-center') {
    return (
      <header className="w-full h-[56px] bg-white border-b border-[#E0E0E0] px-4 flex items-center justify-between sticky top-0 z-40 max-w-[480px]">
        <Flame className="text-[#FFC629] fill-[#FFC629]" size={24} />
        <h1 className="text-[18px] font-bold text-[#1A1A1A] tracking-tight">MATCHN'T</h1>
        <SlidersHorizontal className="text-[#6B7280]" size={24} />
      </header>
    );
  }

  // B. Title-center (Matches, Settings)
  if (variant === 'title-center') {
    return (
      <header className="w-full h-[56px] bg-white border-b border-[#E0E0E0] px-4 flex items-center justify-between sticky top-0 z-40 max-w-[480px]">
        <button onClick={handleBack} className="p-1 -ml-1 text-[#1A1A1A]">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">{title}</h1>
        <div className="w-[28px]" /> {/* Spacer for centering */}
      </header>
    );
  }

  // C. Chat header: back + avatar + name + status + info/kebab
  if (variant === 'chat-header') {
    // expecting title prop to be an object: { name, avatarUrl, onlineStatus }
    return (
      <header className="w-full h-[64px] bg-white border-b border-[#E0E0E0] px-4 flex items-center justify-between sticky top-0 z-40 max-w-[480px]">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1 text-[#1A1A1A]">
            <ChevronLeft size={28} />
          </button>
          <img src={title.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'} alt={title.name} className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-[#1A1A1A] leading-tight">{title.name}</span>
            <span className="text-[11px] text-[#6B7280]">{title.onlineStatus || 'Active now'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onInfoClick} className="p-2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
            <Info size={24} />
           </button>
           <button className="p-2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors -mr-2">
            <MoreVertical size={24} />
           </button>
        </div>
      </header>
    );
  }

  return null;
}
