import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services'; // 這裡藏著你的三大支柱
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        {/* 1. 修正標題：建立第一眼權威 */}
        <title>Erick Life Firm | 艾瑞克人生事務所</title>
        
        {/* 2. 修正描述：中英文雙語，強調核心價值 */}
        <meta name="description" content="不教你定義成功，只與你攻略人生。Erick Life Firm 整合商業戰略、意識科技與內在導航，為你打造人生峰值體驗。" />
      </Helmet>
      
      {/* 3. 視覺修正：背景色改 #121212，文字改 #E0E0E0，防止視覺疲勞 */}
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] overflow-hidden">
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