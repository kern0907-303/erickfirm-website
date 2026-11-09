import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { lineAddUrlFor } from '../lib/constants';

const MobileStickyBar = () => {
  const { pathname } = useLocation();
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

  const normalizedPath = pathname.replace(/\/+$/, '');
  // 首頁與 /i8 的加 LINE 只在頁面後段出現一次，不放浮動列
  if (normalizedPath === '' || normalizedPath === '/i8' || normalizedPath === '/about' || normalizedPath === '/three' || normalizedPath === '/abl' || normalizedPath === '/nas/quiz' || normalizedPath === '/nas/calculator' || normalizedPath === '/nas/2027' || normalizedPath === '/nas/about' || normalizedPath === '/abl/about') return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[var(--ef-shadow-bar)] px-4 py-2.5 transition-[opacity,transform] duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center h-11">
        <a
          href={lineAddUrlFor(pathname)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer font-sans"
        >
          加 LINE，找到適合你的方向
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

export default MobileStickyBar;
