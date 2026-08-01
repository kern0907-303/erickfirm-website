import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
import MobileStickyBar from './components/MobileStickyBar';
import { getPreferredLocale, onLocaleChange } from './lib/i18n';

// 換頁時自動捲動到頂部
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 重構後的 8 個首頁 Section 順序
const Home = () => (
  <>
    {/* 1. Hero */}
    <Hero />
    {/* 2. START HERE 三題自評 (id=assessment) */}
    <QuickAssessment />
    {/* 3. 洞察智庫精選 (新增) */}
    <HomeInsightsSection />
    {/* 4. 關於 Erick (新增) */}
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

const buildHomeStructuredData = (locale) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Erick Firm',
      url: 'https://erickfirm.com',
      description: locale === 'en'
        ? 'Three service tracks: Enterprise Doctor, Life Blueprint Planning, and Personal Growth.'
        : '提供企業醫生、生命藍圖規劃、個人成長三大核心服務，協助決策者建立可持續成長系統。',
    },
    { '@type': 'WebSite', name: 'Erick Firm', url: 'https://erickfirm.com' },
    {
      '@type': 'Service',
      name: locale === 'en' ? 'Enterprise Doctor' : '企業醫生',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Business Structure Optimization',
      description: locale === 'en'
        ? 'Diagnose growth bottlenecks and reduce internal friction with structured execution.'
        : '針對企業內耗、決策效率與成長瓶頸進行結構化診斷與優化。',
    },
    {
      '@type': 'Service',
      name: locale === 'en' ? 'Life Blueprint Planning' : '生命藍圖規劃',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Decision Pattern & Role Alignment',
      description: locale === 'en'
        ? 'Map decision patterns and role alignment to improve clarity and collaboration.'
        : '透過決策偏好盤點與角色對位分析，協助釐清方向、提升決策品質與合作效率。',
    },
    {
      '@type': 'Service',
      name: locale === 'en' ? 'Personal Growth' : '個人成長',
      provider: { '@type': 'Organization', name: 'Erick Firm' },
      serviceType: 'Execution & Decision Performance',
      description: locale === 'en'
        ? 'Use TimeWaver analysis to find core blockers and improve execution and decision quality.'
        : '以 TimeWaver 分析定位核心問題，提升行動力與決策力。',
    },
  ],
});

function App() {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const homeStructuredData = buildHomeStructuredData(locale);

  return (
    <Router>
      <ScrollToTop />
      <Helmet>
        <title>{locale === 'en' ? 'Erick Firm | Enterprise Doctor, Life Blueprint Planning, Personal Growth' : 'Erick Firm | 企業醫生・生命藍圖規劃・個人成長顧問'}</title>
        <meta name="description" content={locale === 'en' ? 'Find your best next step with Enterprise Doctor, Life Blueprint Planning, and Personal Growth. Built for practical execution and better decisions.' : '首次來訪也能快速判斷：企業醫生、生命藍圖規劃、個人成長該先看哪一個。30 秒自評、方法流程、可收藏指南一次完整提供。'} />
        <meta name="keywords" content={locale === 'en' ? 'business growth, decision making, execution, leadership advisory, timewaver' : '企業醫生,生命藍圖規劃,個人成長,決策優化,組織治理,成長顧問'} />
        <script type="application/ld+json">{JSON.stringify(homeStructuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 font-sans relative">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
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
