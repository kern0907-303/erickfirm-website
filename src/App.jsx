import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Insights from './pages/Insights';
import PostDetail from './pages/PostDetail'; // 新增

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
    <Services />
    <Contact />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Helmet>
        <title>Erick Life Firm | 艾瑞克人生事務所</title>
        <meta name="description" content="Erick Life Firm - TimeWaver Frequency & Life Strategy" />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:id" element={<PostDetail />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
