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
import NAS from './pages/NAS';
import NASCalculator from './pages/NASCalculator';
import NASCourse from './pages/NASCourse';
import NASDashboard from './pages/NASDashboard';
import AblPage from './pages/AblPage';
import I8Page from './pages/I8Page';
import MobileStickyBar from './components/MobileStickyBar';
import SEOHead, { updateMetaTags } from './components/SEOHead';

// 換頁時自動捲動到頂部並確保全站 Meta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname === '/') {
      updateMetaTags({
        title: 'Erick Firm｜艾瑞克 - 事情卡住，通常不是因為不夠努力',
        description: '卡住的真正原因，往往是還沒看見那個一直在影響結果的關鍵因素。艾瑞克以二十年跨領域實務，從生命數字的自我理解、個人狀態調和到企業決策校準，陪你把那個因素找出來。',
        url: 'https://erickfirm.com/'
      });
    }
  }, [pathname]);
  return null;
};

// 8 個首頁 Section 順序
const Home = () => (
  <>
    <SEOHead
      title="Erick Firm｜艾瑞克 - 事情卡住，通常不是因為不夠努力"
      description="卡住的真正原因，往往是還沒看見那個一直在影響結果的關鍵因素。艾瑞克以二十年跨領域實務，從生命數字的自我理解、個人狀態調和到企業決策校準，陪你把那個因素找出來。"
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
      '@type': 'Person',
      '@id': 'https://erickfirm.com/#person',
      name: '艾瑞克',
      alternateName: ['Erick', 'Erick Lin'],
      url: 'https://erickfirm.com',
      jobTitle: '顧問',
      description:
        '二十年以上跨領域實務經驗，橫跨生命數字教學、個人狀態調和與企業決策顧問。核心命題：事情卡住，通常不是因為不夠努力，而是還沒看見真正影響結果的關鍵因素。',
      knowsAbout: [
        '生命數字', '生命靈數', '自我理解', '認知架構',
        '個人狀態調和', '企業決策', '組織承載力',
      ],
      worksFor: { '@id': 'https://erickfirm.com/#org' },
      sameAs: [
        'https://www.facebook.com/NAS448',
        'https://www.instagram.com/noagespace/',
        'https://www.youtube.com/@ageoldnew9449',
        'https://www.threads.net/@koi54889101',
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://erickfirm.com/#org',
      name: 'Erick Firm',
      url: 'https://erickfirm.com',
      founder: { '@id': 'https://erickfirm.com/#person' },
      description: '協助個人與企業看見影響結果的關鍵因素——從自我理解、狀態調和到經營決策。',
    },
    { '@type': 'WebSite', '@id': 'https://erickfirm.com/#website', name: 'Erick Firm', url: 'https://erickfirm.com' },
    {
      '@type': 'Service',
      '@id': 'https://erickfirm.com/nas#service',
      name: '平衡空間 NAS｜生命數字',
      alternateName: ['生命數字', '生命靈數'],
      url: 'https://erickfirm.com/nas',
      provider: { '@id': 'https://erickfirm.com/#person' },
      serviceType: 'Numerology-based self-understanding education',
      description:
        '以生命數字為工具的自我理解教學。核心不是判斷準不準，而是更新看待自己的認知架構——同一個數字在四個認知層次會長成完全不同的樣子。',
    },
    {
      '@type': 'Service',
      '@id': 'https://erickfirm.com/abl#service',
      name: '艾伯林 ABL｜個人狀態調和',
      url: 'https://erickfirm.com/abl',
      provider: { '@id': 'https://erickfirm.com/#person' },
      serviceType: 'Personal State Harmonization',
      description: '協助個人穩定情緒、校準狀態，走出反覆卡住的生命模式。',
    },
    {
      '@type': 'Service',
      '@id': 'https://erickfirm.com/i8#service',
      name: '初八企業顧問 I8｜企業醫生專案',
      url: 'https://erickfirm.com/i8',
      provider: { '@id': 'https://erickfirm.com/#person' },
      serviceType: 'Business Structure Optimization',
      description: '協助企業主看見影響經營結果的關鍵因素，校準決策、團隊與成長方向。',
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
          {/* 第二主頁 — 流量入口 */}
          <Route path="/nas" element={<NAS />} />
          <Route path="/nas/calculator" element={<NASCalculator />} />
          <Route path="/nas/meili" element={<NASDashboard />} />
          <Route path="/nas/course" element={<NASCourse />} />
          <Route path="/abl" element={<AblPage />} />
          <Route path="/i8" element={<I8Page />} />

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
