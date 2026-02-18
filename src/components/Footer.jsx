import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#333] py-12 text-center relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          
          {/* Logo / Brand Name */}
          <h3 className="text-2xl font-bold text-[#D4AF37] tracking-widest">ERICK LIFE FIRM</h3>
          
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Initial8 · Abliene · NAS
            <br />
            Business Strategy & Consciousness Architecture
          </p>

          <div className="w-12 h-[1px] bg-[#333] my-4" />

          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} Erick Life Firm. All rights reserved.
            <br />
            Designed with Peak Experience Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;