import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import HomeFAQ, { FAQS } from './components/HomeFAQ';
import QuickAssessment from './components/QuickAssessment';
import ProofSection from './components/ProofSection';
import BookmarkSection from './components/BookmarkSection';
import ProblemAnswersSection from './components/ProblemAnswersSection';
import Insights from './pages/Insights';
import PostDetail from './pages/PostDetail'; // 新增
import { getPreferredLocale, onLocaleChange } from './lib/i18n';

// 換頁時自動捲動到頂部
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <ProblemAnswersSection />
    <QuickAssessment />
    <Services />
    <ProofSection />
    <BookmarkSection />
    <HomeFAQ />
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
        ? 'Three service tracks: Enterprise Doctor, Numerology, and Personal Growth.'
        : '提供企業醫生、生命數字、個人成長三大核心服務，協助決策者建立可持續成長系統。',
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
      name: locale === 'en' ? 'Numerology' : '生命數字',
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
    {
      '@type': 'FAQPage',
      mainEntity: (FAQS[locale] || []).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
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
        <title>{locale === 'en' ? 'Erick Firm | Enterprise Doctor, Numerology, Personal Growth' : 'Erick Firm | 企業醫生・生命數字・個人成長顧問'}</title>
        <meta name="description" content={locale === 'en' ? 'Find your best next step with Enterprise Doctor, Numerology, and Personal Growth. Built for practical execution and better decisions.' : '首次來訪也能快速判斷：企業醫生、生命數字、個人成長該先看哪一個。30 秒自評、方法流程、可收藏指南一次完整提供。'} />
        <meta name="keywords" content={locale === 'en' ? 'business growth, decision making, execution, leadership advisory, timewaver' : '企業醫生,生命數字,個人成長,決策優化,組織治理,成長顧問'} />
        <script type="application/ld+json">{JSON.stringify(homeStructuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:service" element={<Insights />} />
          <Route path="/insights/:service/:slug" element={<PostDetail />} />
          <Route path="/insights/:id" element={<PostDetail />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
