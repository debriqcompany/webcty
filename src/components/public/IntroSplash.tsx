import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

export const IntroSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(15);
  const { settings } = useData();

  useEffect(() => {
    // Only play once per session
    const hasSeen = sessionStorage.getItem('debriq_intro_viewed');
    if (!hasSeen) {
      setVisible(true);
      sessionStorage.setItem('debriq_intro_viewed', 'true');

      // Animate progress smoothly
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => setVisible(false), 600);
            }, 250);
            return 100;
          }
          return prev + Math.floor(Math.random() * 25) + 15;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setFadeOut(true);
    setTimeout(() => setVisible(false), 400);
  };

  const logoSrc = settings?.logoUrl || '/favicon.svg';

  return (
    <div 
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0F10] text-white transition-all duration-600 cursor-pointer select-none ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle CAD Blueprint Background Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Central Engineering Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md px-6">
        
        {/* Animated Isometric Logo */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 p-2 bg-[#18181A] border border-[#333] shadow-2xl flex items-center justify-center rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F27D26]/20 to-transparent opacity-60" />
          <img 
            src={logoSrc} 
            alt="DEBRIQ" 
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain animate-pulse"
          />
        </div>

        {/* Brand Titles */}
        <div className="space-y-1.5">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            DEBRIQ
          </h1>
          <p className="font-mono-tech text-[11px] sm:text-xs text-[#F27D26] tracking-[0.2em] uppercase font-bold">
            ENGINEERING BEHIND THE BUILD
          </p>
        </div>

        {/* Progress Bar & Tech Spec */}
        <div className="w-64 space-y-2 pt-2">
          <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden border border-[#333]">
            <div 
              className="h-full bg-[#F27D26] transition-all duration-150 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#777]">
            <span>INITIALIZING ENGINE...</span>
            <span className="text-[#F27D26] font-bold">{Math.min(progress, 100)}%</span>
          </div>
        </div>

        <span className="text-[10px] font-mono-tech text-[#555] tracking-wider pt-4 hover:text-[#888] transition-colors">
          [ NHẤN ĐỂ VÀO TRANG / CLICK TO ENTER ]
        </span>
      </div>
    </div>
  );
};
