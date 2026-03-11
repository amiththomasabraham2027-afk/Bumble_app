'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, User as UserIcon, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

  // Static Mock Data
  const stats = [
    { label: 'Total Users', value: '1,248' },
    { label: 'Active Today', value: '342' },
    { label: 'New Matches', value: '89' },
    { label: 'Reports Pending', value: '5' },
  ];

  const users = [
    { id: 1, name: 'Alex M.', email: 'alex@example.com', joined: 'Mar 10, 2026', status: 'Active' },
    { id: 2, name: 'Jessica T.', email: 'jess@test.com', joined: 'Mar 09, 2026', status: 'Pending' },
    { id: 3, name: 'David B.', email: 'dbroad@domain.com', joined: 'Feb 28, 2026', status: 'Banned' },
  ];

  const allowlist = [
    { email: 'amithrhomas2005@gmail.com', status: 'Active', added: 'Mar 10, 2026' },
    { email: 'founder@matchnt.com', status: 'Active', added: 'Jan 15, 2026' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F5F5F5]">
      
      {/* Admin TopBar */}
      <header className="w-full h-[64px] bg-white border-b border-[#E0E0E0] px-4 flex items-center justify-between sticky top-0 z-40 max-w-[480px]">
        <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">MATCHN'T Admin</h1>
        <button onClick={() => router.push('/splash')} className="p-2 text-[#EF4444] hover:bg-red-50 rounded-full transition-colors">
           <LogOut size={22} strokeWidth={2.5} />
        </button>
      </header>

      {/* Tabs */}
      <div className="w-full bg-white px-4 border-b border-[#E0E0E0] overflow-x-auto hide-scrollbar sticky top-[64px] z-30">
        <div className="flex gap-6 min-w-max">
          {['Overview', 'Users', 'Allowlist', 'Reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-[14px] font-semibold tracking-[0.02em] transition-colors relative ${activeTab === tab ? 'text-[#1A1A1A]' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FFC629] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 p-4 pb-8 overflow-y-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#F0F0F0]">
                 <div className="text-[24px] font-bold text-[#FFC629] mb-1">{stat.value}</div>
                 <div className="text-[13px] font-medium text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'Users' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-white h-[44px] rounded-[12px] pl-10 pr-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#FFC629] border border-[#E0E0E0] shadow-sm"
              />
            </div>
            
            <div className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-[#E0E0E0]">
               {users.map((user, i) => (
                 <div key={user.id} className={`p-4 flex flex-col gap-3 ${i !== users.length-1 ? 'border-b border-[#F0F0F0]' : ''}`}>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-[#F0F0F0] rounded-full flex items-center justify-center text-[#9CA3AF]">
                         <UserIcon size={20} />
                       </div>
                       <div>
                         <div className="flex items-center gap-2">
                           <span className="text-[15px] font-bold text-[#1A1A1A] leading-tight">{user.name}</span>
                           <StatusBadge status={user.status} />
                         </div>
                         <span className="text-[13px] text-[#6B7280] block">{user.email}</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex justify-between items-center pl-13 pt-1">
                      <span className="text-[11px] text-[#9CA3AF]">Joined {user.joined}</span>
                      <div className="flex gap-2">
                         <button className="px-3 py-1.5 rounded-full border border-[#E0E0E0] text-[12px] font-medium text-[#1A1A1A] hover:bg-[#F5F5F5]">View</button>
                         {user.status !== 'Banned' ? (
                           <button className="px-3 py-1.5 rounded-full bg-red-50 text-[#EF4444] text-[12px] font-bold hover:bg-red-100">Ban</button>
                         ) : (
                           <button className="px-3 py-1.5 rounded-full bg-[#FFF9E6] text-[#FFC629] text-[12px] font-bold">Unban</button>
                         )}
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* ALLOWLIST TAB */}
        {activeTab === 'Allowlist' && (
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-[16px] shadow-sm border border-[#E0E0E0] flex flex-col gap-3">
               <h3 className="text-[15px] font-bold text-[#1A1A1A]">Add New Email</h3>
               <div className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder="Enter email address" 
                   className="flex-1 bg-[#F0F0F0] h-[44px] rounded-[12px] px-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-[#FFC629]"
                 />
                 <button className="bg-[#FFC629] text-[#1A1A1A] font-bold px-4 rounded-[12px] text-[14px] shadow-sm">Add</button>
               </div>
               <button className="w-full py-2.5 mt-1 border-2 border-dashed border-[#CBD5E1] rounded-[12px] text-[#6B7280] text-[13px] font-medium hover:bg-[#F8FAFC]">
                 + Bulk Import CSV
               </button>
            </div>

            <div className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-[#E0E0E0]">
               <div className="px-4 py-3 bg-[#F9FAFB] border-b border-[#E0E0E0] text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">
                 Allowed Emails
               </div>
               {allowlist.map((item, i) => (
                 <div key={i} className={`p-4 flex items-center justify-between ${i !== allowlist.length-1 ? 'border-b border-[#F0F0F0]' : ''}`}>
                   <div className="flex flex-col">
                     <span className="text-[14px] font-semibold text-[#1A1A1A] mb-0.5">{item.email}</span>
                     <span className="text-[11px] text-[#9CA3AF]">Added: {item.added}</span>
                   </div>
                   <button className="p-2 text-[#EF4444] hover:bg-red-50 rounded-full transition-colors">
                     <ShieldAlert size={18} />
                   </button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'Reports' && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[16px] shadow-sm border border-[#E0E0E0]">
             <div className="w-16 h-16 bg-[#FFF9E6] rounded-full flex items-center justify-center mb-4">
               <ShieldAlert className="text-[#FFC629]" size={32} />
             </div>
             <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">No pending reports</h3>
             <p className="text-[14px] text-[#6B7280]">All flagged profiles have been reviewed.</p>
          </div>
        )}

      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Active: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    Pending: 'bg-[#FFC629]/10 text-[#FFC629] border-[#FFC629]/20',
    Banned: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${colors[status]}`}>
      {status}
    </span>
  );
}
