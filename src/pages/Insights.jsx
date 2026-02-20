import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TABS = ['全部', '企業醫生', '能量氣象站', '個人頻率校準', '生命數字'];

const Insights = () => {
  const [activeTab, setActiveTab] = useState('全部');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/.netlify/functions/notion')
      .then(res => res.json())
      .then(data => {
        if (data.results) setArticles(data.results);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter(article => {
    if (activeTab === '全部') return true;
    const project = article.properties?.Project?.select?.name || '';
    return project === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">洞察智庫</h1>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">重塑企業治理結構與個人頻率的專業指南</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                activeTab === tab ? 'bg-slate-900 text-[#D4AF37] shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-20 animate-pulse">正在從 Notion 載入最新洞察...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => {
              const title = article.properties?.Title?.title[0]?.plain_text || '未命名文章';
              const excerpt = article.properties?.Excerpt?.rich_text[0]?.plain_text || '';
              const format = article.properties?.Format?.select?.name || '📝 圖文';
              const project = article.properties?.Project?.select?.name || '通用';
              const date = article.properties?.['Publish Date']?.date?.start || '';

              return (
                <div key={article.id} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold px-3 py-1 bg-slate-50 text-slate-600 rounded-sm">{project}</span>
                    <span className="text-xs text-slate-400">{date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">{excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <span className="text-sm font-bold text-[#D4AF37]">{format}</span>
                    {/* 改為使用 Link 連結到動態路徑 */}
                    <Link to={`/insights/${article.id}`} className="text-slate-900 font-bold text-sm tracking-wider hover:text-[#D4AF37] transition-all">
                      READ MORE →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
