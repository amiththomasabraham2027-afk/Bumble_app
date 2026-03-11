'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import TopBar from '@/components/layout/TopBar';
import { Smile, SendHorizonal, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatThread({ params }) {
  const unwrappedParams = use(params);
  const matchId = unwrappedParams.id;
  const router = useRouter();
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}/message`);
      if (res.ok) {
        const data = await res.json();
        const match = data.match;
        setCurrentUserId(data.currentUserId);

        // Find other user
        const other = match.users?.find(u => u._id !== data.currentUserId);
        if (other) setOtherUser(other);

        setMessages(match.messages || []);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      pollRef.current = setInterval(fetchMessages, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [session, matchId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await fetch(`/api/matches/${matchId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        // Refresh messages immediately
        await fetchMessages();
      } else {
        const data = await res.json();
        console.error('Send error:', data.error);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-white items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FFC629] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      {/* Chat Header */}
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => router.back()} className="text-[#1A1A1A] p-1">
          <ChevronLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={otherUser?.imageUrls?.[0] || 'https://placehold.co/100x100/eeeeee/999999?text=User'} 
            className="w-full h-full object-cover" 
            alt={otherUser?.firstName || 'User'} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-semibold text-[#1A1A1A] truncate">
            {otherUser?.firstName || otherUser?.name?.split(' ')[0] || 'Match'}
          </h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#FFC629]">
              <img 
                src={otherUser?.imageUrls?.[0] || 'https://placehold.co/100x100/eeeeee/999999?text=User'} 
                className="w-full h-full object-cover" 
                alt={otherUser?.firstName || 'User'}
              />
            </div>
            <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-1">
              You matched with {otherUser?.firstName || otherUser?.name?.split(' ')[0] || 'someone'}!
            </h3>
            <p className="text-[14px] text-[#9CA3AF]">Say hello to start the conversation 👋</p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.sender?.toString() === currentUserId || msg.sender?._id?.toString() === currentUserId;
          const showDate = idx === 0 || formatDate(msg.createdAt) !== formatDate(messages[idx - 1]?.createdAt);
          
          return (
            <div key={msg._id || idx} className="flex flex-col">
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="h-px flex-1 bg-[#E0E0E0] mx-4"></div>
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide">{formatDate(msg.createdAt)}</span>
                  <div className="h-px flex-1 bg-[#E0E0E0] mx-4"></div>
                </div>
              )}
              
              <div className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'} mb-1`}>
                <div 
                  className={`px-4 py-2.5 text-[15px] leading-snug ${
                    isMe 
                      ? 'bg-[#FFC629] text-[#1A1A1A] rounded-[18px_18px_4px_18px]' 
                      : 'bg-[#F0F0F0] text-[#1A1A1A] rounded-[18px_18px_18px_4px]'
                  }`}
                >
                  {msg.text}
                </div>
                
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[11px] text-[#9CA3AF]">{formatTime(msg.createdAt)}</span>
                  {isMe && (
                    <span className={`text-[12px] font-bold ${msg.read ? 'text-[#FFC629]' : 'text-[#9CA3AF]'}`}>
                      {msg.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="w-full bg-white border-t border-[#E0E0E0] px-4 py-3 pb-safe flex items-center gap-3 relative z-10 bottom-0">
        <button className="text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors p-1">
          <Smile size={24} />
        </button>
        
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 h-[40px] bg-[#F0F0F0] rounded-full px-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FFC629]"
        />
        
        <button 
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            newMessage.trim() && !sending ? 'bg-[#FFC629] text-[#1A1A1A] hover:bg-[#FFD966]' : 'bg-[#E0E0E0] text-[#9CA3AF]'
          }`}
        >
          <SendHorizonal size={20} strokeWidth={2.5} className={newMessage.trim() ? "ml-0.5" : ""} />
        </button>
      </div>
    </div>
  );
}
