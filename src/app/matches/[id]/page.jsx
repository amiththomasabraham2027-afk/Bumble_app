'use client';

import { useState, useRef, useEffect, use } from 'react';
import TopBar from '@/components/layout/TopBar';
import { Smile, SendHorizonal } from 'lucide-react';

export default function ChatThread({ params }) {
  const unwrappedParams = use(params);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const allChats = [
    { 
      id: 'chat1', 
      user: { name: 'Alex', avatarUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=100&h=100&fit=crop', onlineStatus: 'Active now' },
      initiationPending: false,
      messages: [ { id: 'm1', text: 'That sounds like fun! What time?', sender: 'them', timestamp: '2m ago', date: 'Today' } ]
    },
    { 
      id: 'chat2', 
      user: { name: 'Jessica', avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop', onlineStatus: 'Active 1h ago' },
      initiationPending: true,
      timeLeft: '18h left',
      messages: []
    },
    { 
      id: 'chat3', 
      user: { name: 'David', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop', onlineStatus: 'Active Yesterday' },
      initiationPending: false,
      messages: [ { id: 'm1', text: 'Haha absolutely not 🤣', sender: 'them', timestamp: 'Yesterday', date: 'Yesterday' } ]
    },
    {
      id: '1', // New Match
      user: { name: 'Sarah', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', onlineStatus: 'Active now' },
      initiationPending: false,
      messages: []
    },
    {
      id: '2', // New Match
      user: { name: 'Emma', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', onlineStatus: 'Active 2h ago' },
      initiationPending: false,
      messages: []
    },
    {
      id: '3', // New Match
      user: { name: 'Chloe', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', onlineStatus: 'Active now' },
      initiationPending: false,
      messages: []
    },
    {
      id: '4', // New Match
      user: { name: 'Mia', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', onlineStatus: 'Active yesterday' },
      initiationPending: false,
      messages: []
    }
  ];

  // Find the specific thread or default to a generic one
  const threadId = unwrappedParams.id;
  const foundThread = allChats.find(c => c.id === threadId);
  const thread = foundThread || {
    id: threadId,
    user: { 
      name: 'Unknown User', 
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      onlineStatus: 'Offline' 
    },
    initiationPending: false,
    messages: []
  };

  const [messages, setMessages] = useState(thread.messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered' // or 'read'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after 1.5s
    setTimeout(() => {
       setMessages(prev => [...prev.map(m => m.id === newMsg.id ? {...m, status: 'read'} : m), {
         id: Date.now().toString() + 'r',
         text: "That's great to hear! Let's chat more later.",
         sender: 'them',
         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <TopBar 
        variant="chat-header" 
        title={thread.user} 
        onInfoClick={() => console.log('Open Profile Sheet')} 
      />

      {/* Match Expiry Banner */}
      {thread.initiationPending && messages.filter(m => m.sender === 'me').length === 0 && (
        <div className="w-full bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center justify-center">
          <span className="text-[13px] font-medium text-[#1A1A1A]">
            ⏳ You have {thread.timeLeft} to say hello!
          </span>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {messages.map((msg, idx) => {
          const showDate = idx === 0 || messages[idx-1].date !== msg.date;
          const isMe = msg.sender === 'me';
          
          return (
            <div key={msg.id} className="flex flex-col">
              {showDate && msg.date && (
                <div className="flex items-center justify-center my-4">
                  <div className="h-px flex-1 bg-[#E0E0E0] mx-4"></div>
                  <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide">{msg.date}</span>
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
                  <span className="text-[11px] text-[#9CA3AF]">{msg.timestamp}</span>
                  {isMe && (
                    <span className={`text-[12px] font-bold ${msg.status === 'read' ? 'text-[#FFC629]' : 'text-[#9CA3AF]'}`}>
                      {msg.status === 'read' ? '✓✓' : '✓'}
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
          disabled={!newMessage.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            newMessage.trim() ? 'bg-[#FFC629] text-[#1A1A1A] hover:bg-[#FFD966]' : 'bg-[#E0E0E0] text-[#9CA3AF]'
          }`}
        >
          <SendHorizonal size={20} strokeWidth={2.5} className={newMessage.trim() ? "ml-0.5" : ""} />
        </button>
      </div>
    </div>
  );
}
