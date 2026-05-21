import React, { useEffect, useState } from 'react';
import '../style/VerifyEmail.scss';
import { VanguardLoader } from '../../../components/loaders/VanguardLoader';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';

const VerifyEmail = () => {
  // Simulating an API verification delay to show both states beautifully
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Timeout simulates the time taken to hit the backend verification route
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="verify-container relative antialiased selection:bg-[#cafd00] selection:text-[#4a5e00]">
      
      {/* Background Graphic elements completely keeping the Vanguard brand */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#020202] via-[#050505] to-[#0a0a0a] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#CCFF00]/5 via-transparent to-transparent pointer-events-none opacity-50"></div>
      
      <div className="absolute z-10 top-8 left-8 md:px-12 pointer-events-none w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] flex justify-between items-center" style={{ pointerEvents: 'auto' }}>
        <span className="text-2xl font-black tracking-tighter text-[#CCFF00] font-headline cursor-pointer">SNITCH</span>
        <ThemeToggle />
      </div>

      <main className="verify-box w-full max-w-xl p-8 rounded-sm mx-auto z-20">
        
        {verifying ? (
           <div className="flex flex-col items-center justify-center animate-fade-up">
              <VanguardLoader size="large" />
              <h2 className="font-headline font-black text-2xl md:text-3xl text-white uppercase tracking-widest mt-12 mb-4 italic text-center">
                  Verifying Identity
              </h2>
              <p className="font-label text-xs tracking-[0.2em] text-white/40 uppercase animate-pulse">
                  Decrypting Secure Token...
              </p>
           </div>
        ) : (
           <>
              {/* Payment App Style Animated Tick */}
              <div className="mb-10 relative">
                <svg className="success-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="success-svg__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="success-svg__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>

              {/* Text Elements */}
              <h1 className="font-headline font-black text-4xl md:text-5xl text-white uppercase italic tracking-tighter mb-4 animate-fade-up delay-1000">
                  Access <span className="text-neon">Granted</span>
              </h1>
              
              <div className="h-[1px] w-12 bg-white/20 mb-6 animate-fade-up delay-1000"></div>

              <p className="font-body text-white/60 text-sm leading-relaxed max-w-sm mb-12 animate-fade-up delay-1200">
                  Your identity has been successfully verified across the network. All protocols are green. Welcome to the Vanguard.
              </p>

              {/* Secure Redirect Button */}
              <a href="/" className="group relative w-full max-w-sm bg-neon text-[#516700] font-headline font-black text-[13px] tracking-[0.3em] py-5 uppercase flex items-center justify-center gap-4 hover:bg-white transition-colors duration-500 overflow-hidden animate-fade-up delay-1400 shadow-[0_0_40px_-10px_rgba(204,255,0,0.4)]">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Enter Network</span>
                <span className="material-symbols-outlined relative z-10 transition-all duration-500 group-hover:translate-x-3 group-hover:text-black text-base">arrow_forward</span>
                <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out"></div>
              </a>
           </>
        )}
      </main>

      <div className="absolute bottom-8 right-8 md:right-12 pointer-events-none text-right z-10 opacity-50">
        <p className="font-headline font-black text-white/5 text-4xl italic tracking-tighter mb-1 select-none">VANGUARD_INTEL</p>
        <p className="font-label text-[8px] tracking-[0.4em] text-neon uppercase">Security Module 4.0</p>
      </div>

    </div>
  );
};

export default VerifyEmail;
