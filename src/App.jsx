import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HomeInsightsSection from './components/HomeInsightsSection';
import AboutErickSection from './components/AboutErickSection';
import Services from './components/Services';
import {
  PhilosophySection,
  WhyStuckSection,
  StuckTypesSection,
  AnalysisSection,
  ClaritySection,
  ClosingSection,
} from './components/HomeSections';
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
        description: '艾瑞克（Erick），二十年來陪個人與企業看見那個一直在影響結果、卻一直沒被看見的因素。加 LINE 回答 4 題，免費領取《事情卡住的三種樣子》初步卡點分析。',
        url: 'https://erickfirm.com/'
      });
    }
  }, [pathname]);
  return null;
};

const HOME_DESCRIPTION = '艾瑞克（Erick），二十年來陪個人與企業看見那個一直在影響結果、卻一直沒被看見的因素。加 LINE 回答 4 題，免費領取《事情卡住的三種樣子》初步卡點分析。';

// 首頁 9 段：每一個行動都回到官方 LINE。
const Home = () => (
  <>
    <SEOHead
      title="Erick Firm｜艾瑞克 - 事情卡住，通常不是因為不夠努力"
      description={HOME_DESCRIPTION}
    />
    <Hero />
    <PhilosophySection />
    <WhyStuckSection />
    <StuckTypesSection />
    <Services />
    <section aria-label="關於艾瑞克與文章精選">
      <AboutErickSection />
      <HomeInsightsSection />
    </section>
    <AnalysisSection />
    <ClaritySection />
    <ClosingSection />
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
      name: '初八信息顧問 I8｜企業醫生診斷',
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
