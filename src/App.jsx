import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import QuickAssessment from './components/QuickAssessment';
import HomeInsightsSection from './components/HomeInsightsSection';
import AboutErickSection from './components/AboutErickSection';
import ProblemAnswersSection from './components/ProblemAnswersSection';
import Services from './components/Services';
import ProofSection from './components/ProofSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Insights from './pages/Insights';
import PostDetail from './pages/PostDetail';
import AblPage from './pages/AblPage';
import MobileStickyBar from './components/MobileStickyBar';
import SEOHead, { updateMetaTags } from './components/SEOHead';

// 換頁時自動捲動到頂部並確保全站 Meta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname === '/') {
      updateMetaTags({
        title: 'Erick Frim | 奧斯學長 - 初八企業顧問 I8・平衡空間 NAS・艾伯林 ABL',
        description: '奧斯學長（Erick）擁有 20 年以上企業營運與個人狀態對位經驗，提供初八企業顧問 I8、平衡空間 NAS 與艾伯林 ABL 服務，協助創辦人與高管釐清商業與生命卡點。',
        url: 'https://erickfirm.com/'
      });
    } else if (pathname === '/abl') {
      updateMetaTags({
        title: 'ABL 信息調和｜20 年底層承接力重置與線上狀態校準 - Erick Frim',
        description: '為面臨意志力過度強撐、內在耗竭與莫名阻力的高管、創業者與女性個體，提供 100% 線上遠距信息調和與承接力重塑。填寫資料立即觀看 10 分鐘深度解說影片。',
        url: 'https://erickfirm.com/abl'
      });
    }
  }, [pathname]);
  return null;
};

// 8 個首頁 Section 順序
const Home = () => (
  <>
    <SEOHead
      title="Erick Frim | 奧斯學長 - 初八企業顧問 I8・平衡空間 NAS・艾伯林 ABL"
      description="奧斯學長（Erick）擁有 20 年以上企業營運與個人狀態對位經驗，提供初八企業顧問 I8、平衡空間 NAS 與艾伯林 ABL 服務，協助創辦人與高管釐清商業與生命卡點。"
    />
    {/* 1. Hero */}
    <Hero />
    {/* 2. START HERE 三題自評 (id=assessment) */}
    <QuickAssessment />
    {/* 3. 洞察智庫精選 */}
    <HomeInsightsSection />
    {/* 4. 關於 Erick */}
    <AboutErickSection />
    {/* 5. FIRST PRINCIPLES 第一性原理 */}
    <ProblemAnswersSection />
    {/* 6. THREE CORE SERVICES 三大服務 */}
    <Services />
    {/* 7. PROOF & PROCESS 四步流程 */}
    <ProofSection />
    {/* 8. LINE & CONTACT 聯絡 */}
    <Contact />
  </>
);

const buildHomeStructuredData = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Erick Firm',
      url: 'https://erickfirm.com',
      description: '提供初八企業顧問 I8（企業醫生專案）、平衡空間 NAS、艾伯林 ABL 三大核心服務，協助決策者建立可持續成長系統。',
    },
    { '@type': 'WebSite', name: 'Erick Firm', url: 'https://erickfirm.com' },
    {
      '@type': 'Service',
      name: '初八企業顧問 I8（企業醫生專案）',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Business Structure Optimization',
      description: '針對企業內耗、決策效率與成長瓶頸進行結構化診斷與優化。',
    },
    {
      '@type': 'Service',
      name: '平衡空間 NAS',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Decision Pattern & Role Alignment',
      description: '透過決策偏好盤點與角色對位分析，協助釐清方向、提升決策品質與合作效率。',
    },
    {
      '@type': 'Service',
      name: '艾伯林 ABL',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Execution & State Harmonization',
      description: '提供個人狀態調和與週期支持，協助創辦人與高管釐清身心與狀態瓶頸。',
    },
  ],
});

function App() {
  const homeStructuredData = buildHomeStructuredData();

  useEffect(() => {
    // 注入全站通用的 JSON-LD 結構化資料
    let script = document.querySelector('#structured-data-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(homeStructuredData);
  }, []);

  return (
    <Router>
      <ScrollToTop />

      <div className="min-h-screen bg-white text-slate-900 font-sans relative">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/abl" element={<AblPage />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:service" element={<Insights />} />
          <Route path="/insights/:service/:slug" element={<PostDetail />} />
          <Route path="/insights/:id" element={<PostDetail />} />
        </Routes>

        <Footer />
        <MobileStickyBar />
      </div>
    </Router>
  );
}

export default App;
