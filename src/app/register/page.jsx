'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

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
              onClick={() => signIn('google', { callbackUrl: '/discover' })}
              className="w-full h-[52px] bg-white border border-[#E0E0E0] text-[#1A1A1A] font-medium text-[15px] rounded-[12px] flex items-center justify-center gap-3 hover:bg-[#F5F5F5] transition-colors shadow-sm mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-[#E0E0E0]"></div>
              <span className="text-[#9CA3AF] text-[13px] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#E0E0E0]"></div>
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
