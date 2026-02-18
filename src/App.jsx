import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

// Updated at: 2026-02-18 FORCE WHITE THEME
function App() {
  return (
    <>
      <Helmet>
        <title>Erick Life Firm | 艾瑞克人生事務所</title>
        <meta name="description" content="Erick Life Firm - TimeWaver Frequency & Life Strategy" />
      </Helmet>
      
      {/* ⚠️ 強制設定白色背景 bg-white，文字深色 text-slate-900 */}
      <div 
        className="min-h-screen bg-white text-slate-900 font-sans overflow-hidden"
        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
      >
        <Header />
        <Hero />
        <Services />
        <About />
        <Contact />
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
