import React, { useEffect, useState } from 'react';
import { LINE_CONFIG } from '../lib/constants';

const MobileStickyBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 捲動超過第一屏 (300px) 後淡入顯示
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-2.5 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center h-11">
        <a
          href={LINE_CONFIG.LINE_MESSAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center active:scale-[0.98] transition-transform cursor-pointer font-sans"
        >
          加 LINE，找到適合你的方向 →
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
