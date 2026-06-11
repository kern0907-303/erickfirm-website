import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';

const SERVICES = ['enterprise-doctor', 'life-number', 'personal-growth'];
const SERVICE_SUBTITLE = {
  'zh-TW': {
    all: '依服務分艙閱讀，快速找到最相關的實戰文章',
    'enterprise-doctor': '聚焦營運增長、流程優化與團隊執行力，提供可落地的企業診斷與策略。',
    'life-number': '聚焦決策偏好與角色對位，協助你在關鍵情境下做出更一致且有效的選擇。',
    'personal-growth': '聚焦行動力與決策力提升，透過 TimeWaver 分析找出核心卡點與優化方向。',
  },
  en: {
    all: 'Browse by service track to find the most relevant execution playbooks.',
    'enterprise-doctor': 'Practical insights to improve revenue performance, operating structure, and team execution.',
    'life-number': 'Business-focused guidance on decision patterns and role alignment for clearer, faster choices.',
    'personal-growth': 'Execution and decision-performance insights powered by TimeWaver-based core issue analysis.',
  },
};

const Insights = () => {
  const navigate = useNavigate();
  const { service: routeService } = useParams();
  const [locale, setLocale] = useState(getPreferredLocale());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const dict = i18n[locale];

  useEffect(() => onLocaleChange(setLocale), []);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/notion?lang=${encodeURIComponent(locale)}`);
        if (!res.ok) {
          throw new Error(`Notion function failed with status ${res.status}`);
        }

        const data = await res.json();
        const remotePosts = normalizePosts(data.posts || data.results || [], locale);
        if (!remotePosts.length) {
          throw new Error('Empty Notion posts');
        }

        setPosts(remotePosts);
        setIsUsingFallback(false);
      } catch (error) {
        console.error('Insights fetch error:', error);
        setPosts(normalizePosts(fallbackData.posts || [], locale));
        setIsUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [locale]);

  const [selectedTag, setSelectedTag] = useState(null);
  const activeService = SERVICES.includes(routeService) ? routeService : 'all';

  // Reset tag selection when service category changes
  useEffect(() => {
    setSelectedTag(null);
  }, [activeService]);

  const availableTags = useMemo(() => {
    const servicePosts = activeService === 'all' ? posts : posts.filter(p => p.service === activeService);
    const tagsSet = new Set();
    servicePosts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [posts, activeService]);

  const filteredPosts = useMemo(
    () => posts.filter((post) => {
      const matchesService = activeService === 'all' ? true : post.service === activeService;
      const matchesTag = !selectedTag ? true : (Array.isArray(post.tags) && post.tags.includes(selectedTag));
      return matchesService && matchesTag;
    }),
    [posts, activeService, selectedTag]
  );

  const sortedPosts = useMemo(
    () =>
      [...filteredPosts].sort((a, b) => {
        const aDate = Date.parse(a.publishDate || '') || 0;
        const bDate = Date.parse(b.publishDate || '') || 0;
        return bDate - aDate;
      }),
    [filteredPosts]
  );

  const handleServiceChange = (service) => {
    navigate(service === 'all' ? '/insights' : `/insights/${service}`);
  };

  const activeServiceName = activeService === 'all' ? dict.services.all : getServiceNameFromSlug(activeService, locale, i18n);
  const subtitle = SERVICE_SUBTITLE[locale]?.[activeService] || dict.insightsDesc;
  const pageTitle = `${activeServiceName} | ${dict.insights} | Erick Firm`;

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={subtitle} />
      </Helmet>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">{dict.insights}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">{subtitle}</p>
          {isUsingFallback && <p className="text-sm text-slate-500 mt-4">{dict.fallbackHint}</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => handleServiceChange('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
              activeService === 'all' ? 'bg-primary text-accent shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            {dict.services.all}
          </button>
          {SERVICES.map((service) => (
            <button
              key={service}
              onClick={() => handleServiceChange(service)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                activeService === service ? 'bg-primary text-accent shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {getServiceNameFromSlug(service, locale, i18n)}
            </button>
          ))}
        </div>

        {/* Tags filter list */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-16 max-w-3xl mx-auto border-t border-slate-200/60 pt-6">
            <span className="text-xs font-bold text-slate-400 mr-2 tracking-wider uppercase">
              {locale === 'en' ? 'Filter by Tag:' : '標籤篩選：'}
            </span>
            {availableTags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(active ? null : tag)}
                  className={`px-3 py-1 rounded text-xs font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-accent border-accent text-slate-900 shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 ml-2"
              >
                {locale === 'en' ? 'Clear' : '清除'}
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-slate-400 py-20 animate-pulse">{dict.loadingInsights}</div>
        ) : (
          sortedPosts.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold px-3 py-1 bg-slate-50 text-slate-600 rounded-sm">
                    {getServiceNameFromSlug(post.service, locale, i18n)}
                  </span>
                  <span className="text-xs text-slate-400">{post.publishDate}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-accent transition-colors line-clamp-2 font-display">{post.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{post.excerpt}</p>
                
                {/* Clickable tags in card */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedTag(selectedTag === tag ? null : tag);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          selectedTag === tag
                            ? 'bg-accent text-slate-900 font-bold'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <span className="text-sm font-bold text-accent">{post.format}</span>
                  <Link to={`/insights/${post.service}/${post.slug}`} className="text-slate-900 font-bold text-sm tracking-wider hover:text-accent transition-all">
                    {dict.readMore} →
                  </Link>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-20">{dict.noInsights}</div>
          )
        )}
      </div>
    </div>
  );
};

export default Insights;
