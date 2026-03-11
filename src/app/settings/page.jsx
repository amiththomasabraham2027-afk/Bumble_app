'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';

export default function Settings() {
  const router = useRouter();
  
  const [preferences, setPreferences] = useState({
    showMe: 'Everyone',
    maxDistance: 40,
    showMeOnMatchnt: true,
    newMatchesPush: true,
    messagesPush: true,
    likesPush: false,
    showDistance: true,
    showAge: true,
  });

  const togglePref = (key) => setPreferences(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F5F5F5]">
      <TopBar variant="title-center" title="Settings" />
      
      <div className="flex-1 overflow-y-auto pb-8">
        
        {/* ACCOUNT SECTION */}
        <div className="mt-6 mb-8">
          <h3 className="px-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-2">Account</h3>
          <div className="bg-white border-y border-[#E0E0E0] flex flex-col">
            <SettingsRow label="Email" value="amithrhomas2005@gmail.com" />
            <SettingsRow label="Change Password" isLink />
            <SettingsRow label="Phone Number" value="+1 (555) 019-2834" isLink />
            <SettingsRow label="Connected accounts" isLink />
          </div>
        </div>

        {/* DISCOVERY PREFERENCES SECTION */}
        <div className="mb-8">
          <h3 className="px-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-2">Discovery Preferences</h3>
          <div className="bg-white border-y border-[#E0E0E0] flex flex-col">
            
            <div className="px-4 py-4 border-b border-[#F0F0F0]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[17px] text-[#1A1A1A]">Show me</span>
              </div>
              <div className="flex gap-2">
                {['Men', 'Women', 'Everyone'].map(g => (
                  <button 
                    key={g} 
                    onClick={() => setPreferences({...preferences, showMe: g})}
                    className={`flex-1 py-1.5 rounded-full border border-[#E0E0E0] text-[15px] font-medium transition-colors ${preferences.showMe === g ? 'bg-[#FFC629] border-[#FFC629] text-[#1A1A1A]' : 'bg-white text-[#6B7280]'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-4 border-b border-[#F0F0F0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[17px] text-[#1A1A1A]">Age range</span>
                <span className="text-[15px] font-bold text-[#1A1A1A]">22 - 35</span>
              </div>
              {/* Mocking a dual slider with a simple visual line for MV */}
              <div className="w-full h-1 bg-[#E0E0E0] rounded-full my-3 relative">
                 <div className="absolute left-[20%] right-[40%] h-full bg-[#FFC629] rounded-full"></div>
                 <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-[#E0E0E0] rounded-full shadow-sm -ml-2.5"></div>
                 <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-[#E0E0E0] rounded-full shadow-sm -mr-2.5"></div>
              </div>
            </div>

            <div className="px-4 py-4 border-b border-[#F0F0F0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[17px] text-[#1A1A1A]">Maximum distance</span>
                <span className="text-[15px] font-bold text-[#1A1A1A]">{preferences.maxDistance} km</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="160" 
                value={preferences.maxDistance} 
                onChange={e => setPreferences({...preferences, maxDistance: parseInt(e.target.value)})}
                className="w-full accent-[#FFC629] mt-2 mb-1"
              />
            </div>

            <SettingsToggleRow 
              label="Show me on MATCHN'T" 
              isOn={preferences.showMeOnMatchnt}
              onToggle={() => togglePref('showMeOnMatchnt')}
              desc="If off, you lose your spot in the queue and won't be shown to anyone."
            />
          </div>
        </div>

        {/* NOTIFICATIONS SECTION */}
        <div className="mb-8">
          <h3 className="px-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-2">Notifications</h3>
          <div className="bg-white border-y border-[#E0E0E0] flex flex-col">
            <SettingsToggleRow label="New matches" isOn={preferences.newMatchesPush} onToggle={() => togglePref('newMatchesPush')} />
            <SettingsToggleRow label="Messages" isOn={preferences.messagesPush} onToggle={() => togglePref('messagesPush')} />
            <SettingsToggleRow label="Likes" isOn={preferences.likesPush} onToggle={() => togglePref('likesPush')} />
          </div>
        </div>

        {/* PRIVACY SECTION */}
        <div className="mb-8">
          <h3 className="px-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-2">Privacy</h3>
          <div className="bg-white border-y border-[#E0E0E0] flex flex-col">
            <SettingsToggleRow label="Show my distance" isOn={preferences.showDistance} onToggle={() => togglePref('showDistance')} />
            <SettingsToggleRow label="Show my age" isOn={preferences.showAge} onToggle={() => togglePref('showAge')} />
            <SettingsRow label="Blocked Contacts" isLink />
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="mt-8 mb-12">
          <div className="bg-white border-y border-[#E0E0E0] flex flex-col">
             <button className="w-full px-4 py-4 flex items-center justify-between active:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0]">
                <span className="text-[17px] text-[#EF4444] font-medium">Log out</span>
             </button>
             <button className="w-full px-4 py-4 flex items-center justify-between active:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0]">
                <span className="text-[17px] text-[#EF4444] font-medium">Deactivate Account</span>
             </button>
             <button className="w-full px-4 py-4 flex items-center justify-between active:bg-[#F5F5F5] transition-colors">
                <span className="text-[17px] text-white font-bold bg-[#EF4444] w-full text-center py-2.5 rounded-full">Delete Account</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function SettingsRow({ label, value, isLink, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`px-4 py-4 flex flex-col justify-center border-b border-[#F0F0F0] last:border-0 ${isLink || onClick ? 'cursor-pointer active:bg-[#F5F5F5] transition-colors' : ''}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[17px] text-[#1A1A1A]">{label}</span>
        <div className="flex items-center gap-2">
          {value && <span className="text-[15px] text-[#6B7280]">{value}</span>}
          {isLink && <span className="text-[#E0E0E0] font-bold rotate-180 -mr-1">{"<"}</span>}
        </div>
      </div>
    </div>
  );
}

function SettingsToggleRow({ label, isOn, onToggle, desc }) {
  return (
    <div className="px-4 py-4 border-b border-[#F0F0F0] last:border-0 flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <span className="text-[17px] text-[#1A1A1A]">{label}</span>
        
        {/* iOS style toggle */}
        <button 
          onClick={onToggle}
          className={`w-[50px] h-[30px] rounded-full p-0.5 transition-colors relative ${isOn ? 'bg-[#FFC629]' : 'bg-[#E0E0E0]'}`}
        >
          <div className={`w-[26px] h-[26px] bg-white rounded-full shadow-sm transition-transform ${isOn ? 'translate-x-[20px]' : 'translate-x-0'}`} />
        </button>
      </div>
      {desc && <p className="text-[13px] text-[#9CA3AF] mt-1 leading-snug pr-12">{desc}</p>}
    </div>
  );
}
