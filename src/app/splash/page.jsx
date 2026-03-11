import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SplashPage() {
  return (
    <div className="relative w-full min-h-[100dvh] bg-[#1A1A1A] text-white overflow-hidden flex flex-col">
      {/* Top 60% blob */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] rounded-full opacity-15 pointer-events-none blur-3xl z-0"
        style={{ background: 'radial-gradient(circle, #FFC629 0%, transparent 70%)' }}
      />
      
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-16 pb-8">
        
        {/* Core Brand */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-[42px] font-bold text-[#FFC629] tracking-tight leading-none mb-3">
            MATCHN'T
          </h1>
          <p className="text-[17px] italic text-white/90 text-center max-w-[280px]">
            Where singles find their match
          </p>
        </div>

        {/* Decorative Cards */}
        <div className="relative w-full max-w-[280px] h-[300px] mb-12 flex items-center justify-center">
          {/* Card 3 (Back) */}
          <div className="absolute w-[220px] h-[280px] rounded-[20px] bg-white/10 border border-white/20 transform -rotate-12 -translate-x-8 translate-y-4 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop" alt="demo" className="w-full h-full object-cover opacity-50" />
          </div>
          {/* Card 2 (Middle) */}
          <div className="absolute w-[220px] h-[280px] rounded-[20px] bg-white/20 border border-white/30 transform rotate-6 translate-x-8 translate-y-2 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop" alt="demo" className="w-full h-full object-cover opacity-70" />
          </div>
          {/* Card 1 (Front) */}
          <div className="absolute w-[220px] h-[280px] rounded-[20px] bg-white border border-white/40 shadow-2xl z-10 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop" alt="demo" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="font-bold text-lg">Alex, 24</div>
             </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto w-full flex flex-col items-center gap-4">
          <Link 
            href="/register" 
            className="w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full flex items-center justify-center hover:bg-[#FFD966] transition-colors"
          >
            Create Account
          </Link>
          
          <Link 
            href="/login" 
            className="text-white font-medium text-[14px] py-2 hover:text-[#FFC629] transition-colors"
          >
            I already have an account
          </Link>

          <p className="text-[#9CA3AF] text-[11px] text-center mt-6">
            By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
