import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/20' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-[#D4AF37] tracking-tight cursor-pointer"
        >
          VERTEX
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('services')}
            className="text-slate-700 hover:text-[#00F0FF] transition-colors duration-300 font-medium"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-slate-700 hover:text-[#00F0FF] transition-colors duration-300 font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-6 py-2 bg-[#00F0FF] text-[#0A0A0A] rounded-sm font-semibold hover:bg-[#00F0FF]/90 transition-all duration-300 shadow-lg shadow-[#00F0FF]/20"
          >
            Book Consultation
          </button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#D4AF37]"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#0A0A0A] border-t border-[#D4AF37]/20"
        >
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('services')}
              className="text-left text-slate-700 hover:text-[#00F0FF] transition-colors duration-300 font-medium py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left text-slate-700 hover:text-[#00F0FF] transition-colors duration-300 font-medium py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 bg-[#00F0FF] text-[#0A0A0A] rounded-sm font-semibold hover:bg-[#00F0FF]/90 transition-all duration-300 text-center"
            >
              Book Consultation
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;