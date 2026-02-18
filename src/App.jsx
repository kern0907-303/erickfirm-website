import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Erick Life Firm | 艾瑞克人生事務所</title>
        <meta name="description" content="Erick Life Firm - TimeWaver Frequency & Life Strategy" />
      </Helmet>
      
      {/* 強制亮色背景 bg-slate-50 */}
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
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
