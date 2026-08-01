import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';

const HomeInsightsSection = () => {
  const [locale, setLocale] = useState(getPreferredLocale());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => onLocaleChange(setLocale), []);
  const dict = i18n[locale];

  useEffect(() => {
    async function loadFeaturedPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/notion?lang=${encodeURIComponent(locale)}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        const normalized = normalizePosts(data.posts || data.results || [], locale);
        setPosts(normalized.slice(0, 3));
      } catch (error) {
        console.error('HomeInsightsSection fetch error:', error);
        const fallbackNormalized = normalizePosts(fallbackData.posts || [], locale);
        setPosts(fallbackNormalized.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedPosts();
  }, [locale]);

  return (
    <section className="py-24 bg-surface font-sans border-y border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-slate-200 bg-white text-xs font-bold tracking-widest text-slate-600 font-display">
              <span className="h-2 w-2 rounded-full bg-accent" />
              FEATURED INSIGHTS
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
              洞察智庫精選
            </h2>
          </div>
          <p className="text-slate-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-light">
            從第一性原理出發，分享可落地的企業診斷、生命藍圖與身心對位實戰洞察。
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200/60 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id || post.slug}
                className="bg-white rounded-2xl p-8 border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-accent/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {getServiceNameFromSlug(post.service, locale, i18n)}
                    </span>
                    <span className="text-xs text-slate-400">{post.publishDate}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors line-clamp-2 font-display leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={`/insights/${post.service}/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-slate-900 font-bold text-sm hover:text-accent transition-colors font-display"
                  >
                    閱讀完整文章 ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-accent hover:text-slate-900 transition-all duration-300 text-sm tracking-wide shadow-md hover:shadow-lg"
          >
            探索更多洞察智庫文章 ➔
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeInsightsSection;
