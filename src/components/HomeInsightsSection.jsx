import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPostPath } from '../lib/insights-adapter';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';
import { fetchSupabasePosts, isSupabaseInsightsConfigured } from '../lib/supabase-insights';

// Erick 指定的 6 篇精選文章標題（嚴格依序）
const TARGET_TITLES = [
  '你不是不夠努力，而是還沒看見真正決定成敗的隱性因素',
  '【老闆的深夜真心話】為什麼你拼盡全力，公司卻卡在瓶頸動彈不得？',
  '【你不是不夠努力，而是你已經用「撐住」的方式活太久了：給三十歲後，那個對一切感到疲憊的你】',
  '【為什麼有些人天生敢衝，而有些人總是想很多？】',
  '【企業成長的隱形煞車：為什麼你的營運策略總是卡在最後一哩路？】',
  '你以為你在選擇，其實你只是一直在重複同一個自己',
];

const HomeInsightsSection = () => {
  const [locale, setLocale] = useState(getPreferredLocale());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => onLocaleChange(setLocale), []);
  const dict = i18n[locale];

  useEffect(() => {
    async function loadTargetPosts() {
      setLoading(true);
      try {
        const allNormalized = isSupabaseInsightsConfigured()
          ? await fetchSupabasePosts(locale)
          : normalizePosts((await (await fetch(`/.netlify/functions/notion?lang=${encodeURIComponent(locale)}`)).json()).posts || [], locale);

        // 依據 TARGET_TITLES 順序比對與排序 6 篇文章
        const matched = [];
        TARGET_TITLES.forEach((targetTitle) => {
          const found = allNormalized.find((p) => {
            const cleanP = (p.title || '').trim().replace(/^💡\s*/, '');
            const cleanT = targetTitle.trim().replace(/^💡\s*/, '');
            return cleanP === cleanT || cleanP.includes(cleanT) || cleanT.includes(cleanP);
          });
          if (found) {
            matched.push(found);
          }
        });

        // 若部分文章未比對到，用剩餘最新文章補足至 6 篇
        if (matched.length < 6) {
          const matchedIds = new Set(matched.map((p) => p.id || p.slug));
          const remain = allNormalized.filter((p) => !matchedIds.has(p.id || p.slug));
          matched.push(...remain.slice(0, 6 - matched.length));
        }

        setPosts(matched);
      } catch (error) {
        console.error('HomeInsightsSection fetch error:', error);
        const fallbackNormalized = normalizePosts(fallbackData.posts || [], locale);
        setPosts(fallbackNormalized.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    loadTargetPosts();
  }, [locale]);

  return (
    <section id="insights-preview" className="py-24 bg-surface font-sans border-y border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* 標題與說明 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold tracking-[0.2em] text-slate-600 font-display shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            LATEST INSIGHTS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 font-display tracking-tight leading-tight">
            不是給你答案，是先讓你看見問題長什麼樣
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id || post.slug}
                to={getPostPath(post)}
                className="group bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-accent/60 transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1"
              >
                <div>
                  {/* 分類標籤與發佈日期 */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-md font-sans">
                      {getServiceNameFromSlug(post.service, locale, i18n)}
                    </span>
                    <span className="text-xs text-slate-400 font-sans">{post.publishDate}</span>
                  </div>

                  {/* 完整不截斷的文章標題 */}
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-accent transition-colors font-display leading-snug">
                    {post.title}
                  </h3>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                    閱讀完整文章 ➔
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 底部文字連結 */}
        <div className="mt-16 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-accent font-bold text-base md:text-lg tracking-wide transition-all group font-display"
          >
            看全部 20 篇 <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeInsightsSection;
