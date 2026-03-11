'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [gender, setGender] = useState('');
  
  const [photos, setPhotos] = useState(['', '', '', '', '', '']); // Array of 6 URL slots
  
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [location, setLocation] = useState('');

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    // Filter empty photo slots
    const validPhotos = photos.filter(p => p.trim() !== '');

    const payload = {
      email,
      password,
      firstName,
      dob: `${dobYear}-${dobMonth}-${dobDay}`,
      gender,
      imageUrls: validPhotos,
      bio,
      lookingFor,
      location,
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/discover');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = (index, url) => {
    const newPhotos = [...photos];
    newPhotos[index] = url;
    setPhotos(newPhotos);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    newPhotos.push(''); // add empty slot to end
    setPhotos(newPhotos);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center">
      {/* Top Bar for onboarding */}
      <div className="w-full bg-white px-6 py-4 flex items-center shadow-sm">
        {step > 1 ? (
          <button onClick={handleBack} className="text-[#6B7280] font-medium p-2 -ml-2">
            ← Back
          </button>
        ) : (
          <Link href="/splash" className="text-[#6B7280] font-medium p-2 -ml-2">
            Cancel
          </Link>
        )}
        <div className="flex-1 flex justify-center gap-2">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-6 bg-[#FFC629]' : s < step ? 'w-2 bg-[#FFC629]' : 'w-2 bg-[#E0E0E0]'}`} />
          ))}
        </div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      <div className="flex-1 w-full max-w-md p-6 flex flex-col">
        {error && (
          <div className="mb-6 bg-red-50 text-[#EF4444] p-4 rounded-[12px] border border-red-100 text-[14px]">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex-1 flex flex-col bg-white p-6 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-1">Join MATCHN'T</h1>
            <p className="text-[15px] text-[#9CA3AF] mb-8">Enter your email to get started</p>
            
            <div className="space-y-4 mb-8">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-[52px] bg-[#F0F0F0] rounded-[12px] px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629] placeholder:text-[#9CA3AF]"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-[52px] bg-[#F0F0F0] rounded-[12px] pl-4 pr-12 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629] placeholder:text-[#9CA3AF]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[13px] font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!email || password.length < 6}
              className="mt-auto w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full disabled:opacity-50 disabled:bg-[#F0F0F0] transition-colors"
            >
              Continue
            </button>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-[15px] font-bold text-[#FFC629]">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex-1 flex flex-col bg-white p-6 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8">Tell us about you</h2>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">First Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full h-[52px] bg-[#F0F0F0] rounded-[12px] px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">Date of Birth</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="DD" value={dobDay} onChange={e => setDobDay(e.target.value)} className="w-1/4 h-[52px] bg-[#F0F0F0] rounded-[12px] text-center focus:outline-none focus:ring-2 focus:ring-[#FFC629]" />
                  <input type="number" placeholder="MM" value={dobMonth} onChange={e => setDobMonth(e.target.value)} className="w-1/4 h-[52px] bg-[#F0F0F0] rounded-[12px] text-center focus:outline-none focus:ring-2 focus:ring-[#FFC629]" />
                  <input type="number" placeholder="YYYY" value={dobYear} onChange={e => setDobYear(e.target.value)} className="w-1/2 h-[52px] bg-[#F0F0F0] rounded-[12px] text-center focus:outline-none focus:ring-2 focus:ring-[#FFC629]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">Gender</label>
                <div className="flex flex-wrap gap-2">
                  {['Man', 'Woman', 'Non-binary', 'Other'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setGender(g)}
                      className={`px-6 py-2 rounded-full border border-[#E0E0E0] text-[15px] font-medium transition-colors ${gender === g ? 'bg-[#FFC629] border-[#FFC629]' : 'bg-white hover:bg-[#F5F5F5]'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!firstName || !dobDay || !dobMonth || !dobYear || !gender}
              className="mt-8 w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex-1 flex flex-col bg-white p-6 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-1">Add your photos</h2>
            <p className="text-[15px] text-[#9CA3AF] mb-6">Paste image URLs to add photos. Min 1, max 6.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              {photos.map((url, i) => (
                <div key={i} className={`relative rounded-[12px] overflow-hidden bg-[#F0F0F0] border-2 border-dashed border-[#E0E0E0] aspect-[2/3] flex items-center justify-center ${i === 0 ? 'col-span-2 aspect-[3/2]' : ''}`}>
                  {url ? (
                    <>
                      <img src={url} alt={`Photo ${i+1}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop'; e.target.className += " opacity-50 grayscale"; }} />
                      <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#EF4444] shadow-sm font-bold">
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <input 
                        type="text" 
                        placeholder={i === 0 ? "Paste photo URL here..." : "URL..."}
                        className="w-full text-center bg-transparent focus:outline-none text-[13px]"
                        onBlur={(e) => {
                          if (e.target.value) updatePhoto(i, e.target.value);
                          e.target.value = '';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            updatePhoto(i, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleNext}
              disabled={!photos[0]}
              className="mt-4 w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="flex-1 flex flex-col bg-white p-6 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8">About you</h2>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">Bio</label>
                <div className="relative">
                  <textarea
                    maxLength={300}
                    rows={4}
                    placeholder="Write something interesting..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-[#F0F0F0] rounded-[12px] p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] text-[#9CA3AF]">
                    {bio.length}/300
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">I'm interested in</label>
                <div className="flex gap-2">
                  {['Men', 'Women', 'Everyone'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setLookingFor(g)}
                      className={`flex-1 py-3 rounded-full border border-[#E0E0E0] text-[15px] font-medium transition-colors ${lookingFor === g ? 'bg-[#FFC629] border-[#FFC629]' : 'bg-white hover:bg-[#F5F5F5]'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  placeholder="City, Region"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full h-[52px] bg-[#F0F0F0] rounded-[12px] px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FFC629]"
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading || !lookingFor}
              className="mt-8 w-full h-[52px] bg-[#FFC629] text-[#1A1A1A] font-bold text-[17px] rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Finish & Start Matching'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
