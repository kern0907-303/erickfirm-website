import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Insights from './pages/Insights'; // 這是我們剛新建的檔案

// 【首頁封裝】把原本 App 裡的內容全部包在這裡
const Home = () => (
  <>
    <Hero />
    <Services />
    {/* 如果你有 About 元件，請在這裡補上 <About /> */}
    <Contact />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Header 放在 Routes 外，保證全站可見 */}
        <Header />
        
        <Routes>
          {/* 當網址是 / 時顯示首頁內容 */}
          <Route path="/" element={<Home />} />
          
          {/* 當網址是 /insights 時顯示文章列表 */}
          <Route path="/insights" element={<Insights />} />
        </Routes>

        {/* Footer 放在 Routes 外，保證全站可見 */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
