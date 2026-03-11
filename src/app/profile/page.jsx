'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { CheckCircle, MapPin, Briefcase, GraduationCap, Languages, Sparkles, Coffee, Dog, ChevronLeft, Edit2, X, Plus, LogOut } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // User Profile Data Map
  const [profile, setProfile] = useState({
    name: '',
    dob: '',
    isVerified: true,
    location: '',
    distance: '2',
    job: '',
    school: '',
    bio: '',
    interests: [],
    lookingFor: '',
    languages: '',
    starSign: '',
    drinks: '',
    smokes: '',
    pets: '',
    imageUrls: [],
    gender: '',
  });

  useEffect(() => {
    async function fetchMyProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...profile,
            name: data.firstName || data.name?.split(' ')[0] || '',
            dob: data.dob ? data.dob.split('T')[0] : '',
            bio: data.bio || '',
            location: data.location || '',
            job: data.job || '',
            school: data.school || '',
            interests: data.interests || [],
            imageUrls: data.imageUrls?.length > 0 ? data.imageUrls : [session?.user?.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'],
            gender: data.gender || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session) {
      fetchMyProfile();
    }
  }, [session]);

  const completionPercentage = Math.round((profile.imageUrls.length / 6) * 100);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, reader.result]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (indexToRemove) => {
    setProfile((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove)
    }));
    if (currentPhotoIdx >= indexToRemove && currentPhotoIdx > 0) {
      setCurrentPhotoIdx(currentPhotoIdx - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profile.name,
          dob: profile.dob || undefined,
          bio: profile.bio,
          location: profile.location,
          job: profile.job,
          school: profile.school,
          interests: profile.interests,
          imageUrls: profile.imageUrls,
          gender: profile.gender,
        })
      });
      if (res.ok) {
        setIsEditing(false);
      } else {
        console.error("Failed to save");
      }
    } catch (err) {
       console.error(err);
    } finally {
       setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex bg-[#F5F5F5] min-h-screen items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#FFC629] border-t-transparent animate-spin"/></div>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F5F5F5] pb-[80px]">
      
      {/* SECTION A - PHOTO HEADER */}
      <div className="relative w-full h-[65vh] bg-black rounded-b-[20px] shadow-sm">
        <img 
          src={profile.imageUrls[currentPhotoIdx] || 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=400&h=600&fit=crop'} 
          className="w-full h-full object-cover rounded-b-[20px]"
          alt="Profile Cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/400x600/eeeeee/999999?text=Invalid+Image';
          }}
        />
        
        {/* Top Controls Overlay */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start pt-safe">
          <button 
            onClick={() => isEditing ? setIsEditing(false) : router.back()} 
            className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white"
          >
            {isEditing ? <X size={24} /> : <ChevronLeft size={28} className="-ml-1" />}
          </button>
          
          {!isEditing && (
            <div className="flex gap-2">
              <button 
                onClick={() => signOut({ callbackUrl: '/splash' })}
                className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <LogOut size={14} className="text-[#EF4444]" />
                <span className="text-[13px] font-bold text-[#EF4444]">Log Out</span>
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <Edit2 size={14} className="text-[#1A1A1A]" />
                <span className="text-[13px] font-bold text-[#1A1A1A]">Edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/65 to-transparent rounded-b-[20px] pointer-events-none" />
      </div>

      {/* Photo Strip */}
      <div className="w-full -mt-6 relative z-10 px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {profile.imageUrls.map((url, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentPhotoIdx(idx)}
              className={`relative flex-shrink-0 w-[64px] h-[84px] rounded-[8px] overflow-hidden shadow-sm transition-all ${idx === currentPhotoIdx ? 'ring-2 ring-[#FFC629] ring-offset-2 ring-offset-[#F5F5F5]' : 'opacity-80'}`}
            >
              <img 
                src={url} 
                className="w-full h-full object-cover" 
                alt={`Thumb ${idx}`} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/400x600/eeeeee/999999?text=Invalid+Image';
                }}
              />
              {isEditing && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-[#EF4444] shadow-sm"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
          {profile.imageUrls.length < 6 && (
            <label className={`flex-shrink-0 w-[64px] h-[84px] rounded-[8px] border-2 border-dashed ${isEditing ? 'border-[#FFC629] bg-[#FFF9E6] cursor-pointer' : 'border-[#CBD5E1] bg-white cursor-not-allowed'} flex items-center justify-center text-[#9CA3AF]`}>
              <Plus size={24} className={isEditing ? 'text-[#FFC629]' : ''} />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                disabled={!isEditing}
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {isEditing && profile.imageUrls.length < 6 && (
        <div className="px-4 mb-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Paste direct image URL (ending in .jpg, .png)" 
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 bg-white border border-[#E0E0E0] rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:border-[#FFC629]"
            />
            <button 
              onClick={() => {
                if (imageUrlInput && imageUrlInput.startsWith('http')) {
                  // Basic check to remind users to use direct image links
                  if (imageUrlInput.includes('instagram.com/p/')) {
                    alert('Please provide a direct image link (ending in .jpg or .png), not a webpage link like Instagram.');
                    return;
                  }
                  setProfile(prev => ({ ...prev, imageUrls: [...prev.imageUrls, imageUrlInput] }));
                  setImageUrlInput('');
                } else {
                  alert('Please enter a valid HTTP/HTTPS URL.');
                }
              }}
              className="bg-[#1A1A1A] text-white px-4 py-2 rounded-[8px] text-[14px] font-medium active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
          <p className="text-[11px] text-[#9CA3AF] px-1">Note: Some websites like Instagram block direct image linking. Try using Imgur, Unsplash, or uploading from your device!</p>
        </div>
      )}

      {/* Profile Completion */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[13px] font-bold text-[#1A1A1A]">Profile strength</span>
          <span className="text-[13px] font-bold text-[#1A1A1A]">{completionPercentage}%</span>
        </div>
        <div className="w-full h-[6px] bg-[#E0E0E0] rounded-full overflow-hidden mb-1">
          <div className="h-full bg-[#FFC629] rounded-full" style={{ width: `${completionPercentage}%` }} />
        </div>
        {completionPercentage < 100 && (
          <p className="text-[12px] text-[#9CA3AF] italic">Add {6 - profile.imageUrls.length} more photos to boost your visibility</p>
        )}
      </div>

      {/* SECTION B - IDENTITY BLOCK */}
      <div className="bg-white rounded-t-[20px] px-6 py-5 shadow-sm mb-3">
        <div className="flex items-center gap-2 mb-2">
          {isEditing ? (
            <input type="text" value={profile.name} className="text-[24px] font-bold text-[#1A1A1A] border-b border-[#E0E0E0] focus:outline-none focus:border-[#FFC629] w-auto max-w-[120px]" onChange={e=>setProfile({...profile, name: e.target.value})} />
          ) : (
            <h1 className="text-[24px] font-bold text-[#1A1A1A] leading-none">{profile.name}</h1>
          )}
          {isEditing ? (
            <input type="date" value={profile.dob} className="text-[16px] text-[#6B7280] border-b border-[#E0E0E0] focus:outline-none focus:border-[#FFC629] bg-transparent" onChange={e=>setProfile({...profile, dob: e.target.value})} />
          ) : (
            <span className="text-[24px] text-[#6B7280] leading-none">{profile.dob ? Math.floor((Date.now() - new Date(profile.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : ''}</span>
          )}
          {profile.isVerified && <CheckCircle size={20} className="text-[#FFC629] fill-[#FFC629] ml-1" />}
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 opacity-90">
            <MapPin size={16} strokeWidth={2.5} className="text-[#9CA3AF] flex-shrink-0" />
            <span className="text-[15px] text-[#6B7280] truncate">{profile.location}</span>
            <span className="text-[15px] text-[#E0E0E0] mx-1">•</span>
            <span className="text-[15px] text-[#6B7280] whitespace-nowrap">{profile.distance} km away</span>
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full mt-2">
               <span className="text-[#9CA3AF] flex-shrink-0 text-[16px] font-bold">👤</span>
               <select 
                 value={profile.gender || ''} 
                 onChange={e=>setProfile({...profile, gender: e.target.value})}
                 className="w-full text-[15px] border-b border-[#E0E0E0] focus:outline-none focus:border-[#FFC629] bg-transparent pb-1"
               >
                 <option value="" disabled>Select Gender</option>
                 <option value="Woman">Woman</option>
                 <option value="Man">Man</option>
                 <option value="Non-binary">Non-binary</option>
                 <option value="Other">Other</option>
               </select>
            </div>
          ) : profile.gender ? (
            <div className="flex items-center gap-1.5 opacity-90 mt-2">
              <span className="text-[#9CA3AF] flex-shrink-0 text-[14px]">👤</span>
              <span className="text-[15px] text-[#1A1A1A] truncate">{profile.gender}</span>
            </div>
          ) : null}
          
          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full mt-2">
               <Briefcase size={16} strokeWidth={2.5} className="text-[#9CA3AF] flex-shrink-0" />
               <input type="text" placeholder="Add Job Title" value={profile.job || ''} className="w-full text-[15px] border-b border-[#E0E0E0] focus:outline-none focus:border-[#FFC629]" onChange={e=>setProfile({...profile, job: e.target.value})} />
            </div>
          ) : profile.job ? (
            <div className="flex items-center gap-1.5 opacity-90 mt-2">
              <Briefcase size={16} strokeWidth={2.5} className="text-[#9CA3AF] flex-shrink-0" />
              <span className="text-[15px] text-[#1A1A1A] truncate">{profile.job}</span>
            </div>
          ) : null}

          {isEditing ? (
            <div className="flex items-center gap-1.5 w-full mt-2">
               <GraduationCap size={16} strokeWidth={2.5} className="text-[#9CA3AF] flex-shrink-0" />
               <input type="text" placeholder="Add School" value={profile.school || ''} className="w-full text-[15px] border-b border-[#E0E0E0] focus:outline-none focus:border-[#FFC629]" onChange={e=>setProfile({...profile, school: e.target.value})} />
            </div>
          ) : profile.school ? (
            <div className="flex items-center gap-1.5 opacity-90 mt-2">
              <GraduationCap size={16} strokeWidth={2.5} className="text-[#9CA3AF] flex-shrink-0" />
              <span className="text-[15px] text-[#1A1A1A] truncate">{profile.school}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* SECTION C - ABOUT ME */}
      <div className="bg-white mx-4 rounded-[12px] p-5 shadow-sm mb-3">
        <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-[0.05em] mb-3">About Me</h3>
        {isEditing ? (
          <textarea 
            value={profile.bio} 
            onChange={e=>setProfile({...profile, bio: e.target.value})}
            className="w-full bg-[#F0F0F0] rounded-[8px] p-3 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FFC629] text-[#1A1A1A] min-h-[100px]"
          />
        ) : profile.bio ? (
          <p className="text-[15px] text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
        ) : (
          <div className="w-full border-2 border-dashed border-[#E0E0E0] rounded-[8px] p-4 text-center">
             <span className="text-[14px] text-[#9CA3AF] italic">+ Add a bio</span>
          </div>
        )}
      </div>

      {/* SECTION D - INTERESTS */}
      <div className="bg-white mx-4 rounded-[12px] p-5 shadow-sm mb-3">
        <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-[0.05em] mb-3">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, idx) => (
            <div key={idx} className="bg-[#FFF3CD] border border-[#FFC629]/20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[#1A1A1A] text-[13px] font-medium">
              {interest}
              {isEditing && <X size={14} className="text-[#9CA3AF] ml-1" />}
            </div>
          ))}
          {isEditing && (
            <div className="border border-dashed border-[#9CA3AF] flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[#9CA3AF] text-[13px] font-medium">
              <Plus size={14} /> Add Interest
            </div>
          )}
        </div>
      </div>

      {/* SECTION E - BASICS */}
      <div className="bg-white mx-4 rounded-[12px] p-5 shadow-sm mb-3">
        <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-[0.05em] mb-4">The Basics</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <BasicChip icon={<Languages/>} label={profile.languages} isEdit={isEditing} />
          <BasicChip icon={<Sparkles/>} label={profile.starSign} isEdit={isEditing} />
          <BasicChip icon={<Coffee/>} label={profile.drinks} isEdit={isEditing} />
          <BasicChip icon={<Dog/>} label={profile.pets} isEdit={isEditing} />
        </div>
      </div>

      {/* SECTION F - LOOKING FOR */}
      <div className="bg-white mx-4 rounded-[12px] p-5 shadow-sm mb-6">
        <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-[0.05em] mb-3">I'm Looking For</h3>
        <div className={`w-full ${isEditing ? 'bg-[#F0F0F0]' : 'bg-[#FFF3CD]'} rounded-[12px] p-4 flex items-center justify-center`}>
           <span className="text-[15px] font-medium text-[#1A1A1A]">{profile.lookingFor}</span>
        </div>
      </div>

      {/* Sticky Save Bar for Edit Mode */}
      {isEditing && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-[#E0E0E0] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
          <button 
            onClick={handleSave}
            className="w-full h-[52px] rounded-full bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] active:scale-95 transition-transform"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Only show BottomNavBar when not editing mode */}
      {!isEditing && <BottomNavBar />}
    </div>
  );
}

function BasicChip({ icon, label, isEdit }) {
  if (!label && !isEdit) return null;
  return (
    <div className={`flex items-center gap-2 ${isEdit ? 'bg-[#F0F0F0] px-3' : ''} py-1.5 rounded-[8px]`}>
      <div className="text-[#FFC629] flex-shrink-0 pb-0.5 [&_svg]:w-[18px] [&_svg]:h-[18px]">
        {icon}
      </div>
      <span className={`text-[13px] text-[#1A1A1A] truncate ${isEdit && !label ? 'text-[#9CA3AF] italic' : ''}`}>
        {label || 'Add'}
      </span>
    </div>
  );
}
