import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPostPath } from '../lib/insights-adapter';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';
import { CardRise, CardRiseItem, MaskHeading } from './Motion';

// 首頁專欄規則：取最新 6 篇，每個品牌最多 2 篇，讓四個品牌輪流露出，不被單一系列洗版。
// 發佈新文章後不需要改程式，首頁會自動更新（文章列表快取約 60 秒）。
const HOME_POST_COUNT = 6;
const MAX_PER_SERVICE = 2;

function pickHomePosts(posts) {
  const sorted = posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => {
      const aDate = Date.parse(a.post.publishDate || '') || 0;
      const bDate = Date.parse(b.post.publishDate || '') || 0;
      return bDate - aDate || a.index - b.index;
    })
    .map((item) => item.post);

  const counts = {};
  const picked = [];
  for (const post of sorted) {
    if (picked.length >= HOME_POST_COUNT) break;
    const key = post.service || 'other';
    if ((counts[key] || 0) >= MAX_PER_SERVICE) continue;
    counts[key] = (counts[key] || 0) + 1;
    picked.push(post);
  }

  // 文章總數不足以湊滿 6 篇時，用剩下最新的補齊
  if (picked.length < HOME_POST_COUNT) {
    const already = new Set(picked);
    for (const post of sorted) {
      if (picked.length >= HOME_POST_COUNT) break;
      if (!already.has(post)) picked.push(post);
    }
  }

  // 一律依日期新到舊顯示
  const pickedSet = new Set(picked);
  return sorted.filter((post) => pickedSet.has(post));
}

const HomeInsightsSection = () => {
  const [locale, setLocale] = useState(getPreferredLocale());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => onLocaleChange(setLocale), []);
  const dict = i18n[locale];

  useEffect(() => {
    async function loadLatestPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/notion?lang=${encodeURIComponent(locale)}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        const allNormalized = normalizePosts(data.posts || data.results || [], locale);
        setPosts(pickHomePosts(allNormalized));
      } catch (error) {
        console.error('HomeInsightsSection fetch error:', error);
        const fallbackNormalized = normalizePosts(fallbackData.posts || [], locale);
        setPosts(pickHomePosts(fallbackNormalized));
      } finally {
        setLoading(false);
      }
    }

    loadLatestPosts();
  }, [locale]);

  return (
    <div id="insights-preview" className="py-20 bg-[#f7f6f2] font-sans md:py-28">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* 標題與說明 */}
        <div className="max-w-3xl mb-16">
          <p className="mb-5 text-xs tracking-[0.22em] text-slate-500">SELECTED WRITING</p>
          <MaskHeading
            lines={['不是給你答案，', '是先讓你看見問題長什麼樣']}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 font-display tracking-tight leading-tight"
            rule
          />
          <p className="mt-7 text-slate-600 text-base md:text-lg font-light leading-relaxed">
            這些是我平常在想的事。挑一篇跟你現在最像的看看。
          </p>
        </div>

        {/* 6 篇文章卡片三欄網格 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-slate-200/60 rounded-2xl" />
            ))}
          </div>
        ) : (
          <CardRise className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <CardRiseItem key={post.id || post.slug} className="h-full">
              <Link
                to={getPostPath(post)}
                className="card-soft group bg-white p-7 flex flex-col justify-between h-full"
              >
                <div>
                  {/* 分類標籤與發佈日期 */}
                  <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-sans">
                      {getServiceNameFromSlug(post.service, locale, i18n)}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">{post.publishDate}</span>
                  </div>

                  {/* 完整不截斷的文章標題 */}
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-slate-600 transition-colors font-display leading-snug">
                    {post.title}
                  </h3>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                    閱讀完整文章 →
                  </span>
                </div>
              </Link>
              </CardRiseItem>
            ))}
          </CardRise>
        )}

        {/* 底部文字連結 */}
        <div className="mt-16 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-slate-600 font-bold text-base md:text-lg tracking-wide transition-all group font-display"
          >
            看全部文章 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeInsightsSection;
