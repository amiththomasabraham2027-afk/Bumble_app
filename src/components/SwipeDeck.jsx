'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart, X, RotateCcw, Zap, Star, MapPin, CheckCircle, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SwipeDeck({ profiles, onSwipe, currentUser }) {
  const router = useRouter();
  const [cards, setCards] = useState(profiles);
  const [undoHistory, setUndoHistory] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);

  const handleSwipeComplete = (id, direction) => {
    onSwipe(id, direction);
    
    // If user swiped LEFT (Liked), check if genders are opposite to trigger a match
    if (direction === 'left') {
      const swipedCard = cards.find(card => card._id === id);
      
      // Match if they have defined genders and they are different
      if (swipedCard?.gender && currentUser?.gender && swipedCard.gender !== currentUser.gender) {
        setCurrentMatch(swipedCard);
        // Don't remove card from deck immediately if matched, so background stays the same
        return;
      }
    }

    setCards((prev) => {
      const swipedCard = prev.find(card => card._id === id);
      setUndoHistory(history => [...history, swipedCard].slice(-1)); // Keep only 1 undo
      return prev.filter(card => card._id !== id);
    });
  };

  const closeMatch = () => {
    if (currentMatch) {
      setCards((prev) => prev.filter(card => card._id !== currentMatch._id));
      setCurrentMatch(null);
    }
  };

  const undoLastSwipe = () => {
    if (undoHistory.length === 0) return;
    const lastCard = undoHistory[undoHistory.length - 1];
    setCards(prev => [lastCard, ...prev]);
    setUndoHistory([]);
  };

  return (
    <div className="relative w-full max-w-[400px] h-full max-h-[600px] flex flex-col justify-end items-center pb-[100px] mt-4">
      <div className="relative w-full h-[calc(100vh-240px)] max-h-[500px] flex justify-center items-center">
        {cards.map((profile, i) => (
          <ProfileCard 
            key={profile._id} 
            profile={profile} 
            onSwipeComplete={(direction) => handleSwipeComplete(profile._id, direction)}
            index={i}
          />
        ))}
      </div>
      
      {/* SWIPE ACTION BUTTONS */}
      {cards.length > 0 && !currentMatch && (
        <div className="absolute bottom-6 w-full flex justify-center items-center gap-3 z-50">
          <button 
            onClick={undoLastSwipe}
            disabled={undoHistory.length === 0}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#9CA3AF] disabled:opacity-50 transition-transform active:scale-95"
            aria-label="Undo"
          >
            <RotateCcw size={20} strokeWidth={2.5} />
          </button>
          
          <button 
             onClick={() => handleSwipeComplete(cards[0]._id, 'right')}
             className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#EF4444] hover:bg-red-50 transition-transform active:scale-95"
             aria-label="Pass (Right)"
          >
            <X size={32} strokeWidth={3} />
          </button>
          
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#3B82F6] hover:bg-blue-50 transition-transform active:scale-95">
            <Star size={20} strokeWidth={2.5} className="fill-[#3B82F6]" />
          </button>

          <button 
            onClick={() => handleSwipeComplete(cards[0]._id, 'left')}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#22C55E] hover:bg-green-50 transition-transform active:scale-95"
            aria-label="Like (Left)"
          >
            <Heart size={32} strokeWidth={3} className="fill-[#22C55E]" />
          </button>
          
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-[#FFC629] hover:bg-[#FFF9E6] transition-transform active:scale-95">
            <Zap size={20} strokeWidth={2.5} className="fill-[#FFC629]" />
          </button>
        </div>
      )}

      {/* IT'S A MATCH OVERLAY */}
      <AnimatePresence>
        {currentMatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-6 pb-20 pt-10"
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[320px]">
              <motion.h2 
                initial={{ scale: 0.5, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="font-display font-bold text-[40px] text-[#FFC629] mb-2 tracking-tight drop-shadow-lg italic text-center"
              >
                It's a Match!
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-[15px] mb-8 text-center"
              >
                You and {currentMatch.name} have liked each other.
              </motion.p>

              <div className="flex items-center justify-center gap-4 mb-12">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                  className="w-24 h-24 rounded-full border-4 border-[#FFC629] overflow-hidden shadow-[0_0_20px_rgba(255,198,41,0.5)] z-10"
                >
                  <img src={currentUser?.imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop"} alt="You" className="w-full h-full object-cover" />
                </motion.div>
                
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                  className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl -ml-6 z-0"
                >
                  <img src={currentMatch.imageUrls[0]} alt={currentMatch.name} className="w-full h-full object-cover" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full space-y-3"
              >
                <button 
                  onClick={() => router.push(`/matches/${currentMatch._id}`)}
                  className="w-full py-3.5 bg-[#FFC629] text-[#1A1A1A] rounded-full font-bold text-[16px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(255,198,41,0.4)] hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle size={20} className="fill-[#1A1A1A] border-none" />
                  Message {currentMatch.name}
                </button>
                
                <button 
                  onClick={closeMatch}
                  className="w-full py-3.5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-[16px] hover:bg-white/10 transition-colors"
                >
                  Keep Swiping
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileCard({ profile, onSwipeComplete, index }) {
  const [imgIndex, setImgIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // REVERSE MECHANIC OPACITIES
  // Drag Left (x < 0) = LIKE (Green)
  const likeOpacity = useTransform(x, [-120, -20], [1, 0]);
  // Drag Right (x > 0) = NOPE (Red)
  const nopeOpacity = useTransform(x, [20, 120], [0, 1]);
  
  const controls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;
    const swipeThreshold = 120;
    
    // REVERSE SWIPE: swipeLeft = Like, swipeRight = Pass
    // After action: card flies off in drag direction
    if (offset < -swipeThreshold) {
      await controls.start({ x: -400, opacity: 0, transition: { duration: 0.3 } });
      onSwipeComplete('left'); // LIKE
    } else if (offset > swipeThreshold) {
      await controls.start({ x: 400, opacity: 0, transition: { duration: 0.3 } });
      onSwipeComplete('right'); // PASS
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const isFront = index === 0;

  const handleTapImg = (e) => {
    if (!isFront) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percentX = (e.clientX - rect.left) / rect.width;
    if (percentX > 0.5) {
      setImgIndex(prev => Math.min(prev + 1, profile.imageUrls.length - 1));
    } else {
      setImgIndex(prev => Math.max(prev - 1, 0));
    }
  };

  // Stack styling logic: Card 2 slightly smaller and lower, Card 3 barely visible
  let stackStyle = {};
  if (index === 0) {
    stackStyle = { scale: 1, y: 0, zIndex: 10 };
  } else if (index === 1) {
    stackStyle = { scale: 0.96, y: 8, zIndex: 9 };
  } else {
    stackStyle = { scale: 0.92, y: 16, zIndex: 8 };
  }

  return (
    <motion.div
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{
        x,
        rotate,
        ...stackStyle
      }}
      animate={controls}
      className={`absolute w-full h-full bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-grab active:cursor-grabbing flex flex-col`}
    >
      <div 
        className="w-full h-full relative" 
        onClick={handleTapImg}
      >
        <img 
          src={profile.imageUrls[imgIndex] || 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=500&fit=crop'} 
          alt={profile.name} 
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
        
        {/* Bottom Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        
        {/* Swipe Indicators */}
        <motion.div 
          className="absolute top-8 left-6 border-[3px] border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E] font-bold text-3xl px-3 py-1 rounded-[8px] -rotate-[15deg] z-20 shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div 
          className="absolute top-8 right-6 border-[3px] border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] font-bold text-3xl px-3 py-1 rounded-[8px] rotate-[15deg] z-20 shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>

        {/* Image Carousel Indicators */}
        {profile.imageUrls.length > 1 && (
          <div className="absolute top-3 inset-x-0 flex justify-center gap-1.5 px-3 z-10 pointer-events-none">
            {profile.imageUrls.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full bg-white transition-all duration-300 ${i === imgIndex ? 'flex-1 opacity-100' : 'w-1.5 opacity-30 shadow-sm'}`}
              />
            ))}
          </div>
        )}

        {/* Profile Content */}
        <div className="absolute bottom-4 left-4 right-4 text-white text-left pointer-events-none">
          {/* Row 1: Name, Age, Verified */}
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[28px] font-bold font-display leading-none">{profile.name}</h2>
            <span className="text-[28px] text-white/80 leading-none">{profile.age}</span>
            {profile.isVerified && <CheckCircle size={20} className="text-[#FFC629] fill-[#FFC629] ml-1" />}
          </div>
          
          {/* Row 2: Location */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <MapPin size={14} strokeWidth={2.5} className="text-white/70" />
            <span className="text-[13px] text-white/70 font-medium tracking-wide">
              {profile.location || 'Nearby'}
            </span>
          </div>
          
          {/* Row 3: Bio preview */}
          {profile.bio && (
            <p className="text-[13px] text-white/80 line-clamp-2 leading-snug mb-3">
              {profile.bio}
            </p>
          )}

          {/* Row 4: Interest Pills */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 3).map((interest, idx) => (
                <div key={idx} className="bg-[#FFC629]/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-medium border border-[#FFC629]/30">
                  {interest}
                </div>
              ))}
              {profile.interests.length > 3 && (
                <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-full text-white/90 text-[11px] font-medium border border-white/20">
                  +{profile.interests.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Button */}
        <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto transition-colors z-20 border border-white/30">
          <span className="font-bold text-[18px] leading-none mb-0.5">i</span>
        </button>
      </div>
    </motion.div>
  );
}
