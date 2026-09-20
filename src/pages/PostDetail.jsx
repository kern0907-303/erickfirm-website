import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, ChevronDown } from 'lucide-react';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { findPostByRoute, getPostImage, getPostPath, getPostUrl, getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';
import SEOHead, { updateMetaTags } from '../components/SEOHead';

// 四大服務分類所對應的專屬 CTA 引流文案與按鈕配置
const CATEGORY_CTA_CONFIG = {
  'personal-growth': {
    title: '如果這篇讓你想到自己',
    desc: '狀態的事，通常不是再撐一下就會過去。與其繼續猜，不如先看清楚自己現在卡在哪一層。',
    btn1Text: '做 30 秒自評',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: 'https://line.me/R/oaMessage/U4744aca9737a23e3b6c3ef5a038cdf4e/?168',
  },
  'life-number': {
    title: '你自己的那一套，是怎麼運作的？',
    desc: '每個人的節奏、判斷方式與卡點位置本來就不同。硬套別人的方法會累，先看懂自己這一套比較快。',
    btn1Text: '做 30 秒自評',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: 'https://line.me/R/oaMessage/U4744aca9737a23e3b6c3ef5a038cdf4e/?168',
  },
  'enterprise-doctor': {
    title: '如果你的公司也卡在同一個地方',
    desc: '多數瓶頸不是策略不夠好，而是結構裡有一段一直沒被看見。先確認該從哪一段查起，比急著改策略有用。',
    btn1Text: '做 30 秒盤點',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '預約聯繫',
    btn2Url: 'https://line.me/R/oaMessage/U4744aca9737a23e3b6c3ef5a038cdf4e/?168',
  },
  'erick-column': {
    title: '想知道你現在該先解哪一題？',
    desc: '問題通常不只一個，但真正該先動的永遠只有一個。',
    btn1Text: '做 30 秒自評',
    btn1Url: 'https://erickfirm.com/#assessment',
    btn2Text: '加 LINE 輸入【168】',
    btn2Url: 'https://line.me/R/oaMessage/U4744aca9737a23e3b6c3ef5a038cdf4e/?168',
  },
};

// 連結樣式：站內用 Link（不重新載入整頁），站外用 a 並開新分頁。
const InlineLink = ({ href, children }) => {
  const external = /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  const cls = 'text-accent font-bold underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition';
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  }
  return <Link to={href} className={cls}>{children}</Link>;
};

const renderFormattedText = (text) => {
  if (typeof text !== 'string') return text;
  // 順序有意義：連結要排在粗體之前，否則網址裡的符號會先被吃掉。
  const regex = /(\[[^\]]+\]\([^)\s]+\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    const link = typeof part === 'string' ? part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) : null;
    if (link) {
      return <InlineLink key={index} href={link[2]}>{link[1]}</InlineLink>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={index} className="italic text-slate-800">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-slate-100 rounded text-sm font-mono text-accent font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const PostDetail = () => {
  const { service, slug, id } = useParams();
  const navigate = useNavigate();
  const [locale, setLocale] = useState(getPreferredLocale());
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [faqBlocks, setFaqBlocks] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const dict = i18n[locale];

  useEffect(() => onLocaleChange(setLocale), []);

  useEffect(() => {
    async function loadPostAndList() {
      setLoading(true);
      try {
        // 1. 載入當前文章詳情
        const query = new URLSearchParams({ lang: locale });
        if (id && !slug) {
          query.set('postId', id);
        } else {
          query.set('service', service || '');
          query.set('slug', slug || '');
        }

        const res = await fetch(`/.netlify/functions/notion?${query.toString()}`);
        if (!res.ok) {
          throw new Error(`Notion function failed with status ${res.status}`);
        }

        const data = await res.json();
        const remotePost = data.page;
        if (!remotePost) {
          throw new Error('Invalid post payload');
        }

        setPost(remotePost);
        setBlocks(Array.isArray(data.blocks) ? data.blocks : []);
        setFaqBlocks(Array.isArray(data.faqBlocks) ? data.faqBlocks : []);
        setIsUsingFallback(false);

        // 實時更新真實 DOM Head 標籤
        const postTitle = remotePost.title || '洞察文章';
        const postExcerpt = remotePost.excerpt || postTitle;
        const postUrl = getPostUrl(remotePost);
        
        updateMetaTags({
          title: postTitle,
          description: postExcerpt,
          image: getPostImage(remotePost),
          url: postUrl,
          type: 'article'
        });

        if (!id && remotePost.service && remotePost.slug && (remotePost.service !== service || remotePost.slug !== slug)) {
          navigate(getPostPath(remotePost), { replace: true });
        }

        // 2. 載入全站文章清單供「你可能也會想看」計算
        const listRes = await fetch(`/.netlify/functions/notion?lang=${encodeURIComponent(locale)}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          const normalized = normalizePosts(listData.posts || listData.results || [], locale);
          setAllPosts(normalized);
        }
      } catch (error) {
        console.error('Post detail fetch error:', error);
        const fallbackPosts = normalizePosts(fallbackData.posts || [], locale);
        const fallbackPost = findPostByRoute(fallbackPosts, { service, slug, id });
        setPost(fallbackPost);
        setAllPosts(fallbackPosts);
        setBlocks(Array.isArray(fallbackPost?.blocks) ? fallbackPost.blocks : []);
        setFaqBlocks([]);
        setIsUsingFallback(!!fallbackPost);

        if (fallbackPost) {
          const postTitle = fallbackPost.title || '洞察文章';
          const postExcerpt = fallbackPost.excerpt || postTitle;
          updateMetaTags({
            title: postTitle,
            description: postExcerpt,
            image: getPostImage(fallbackPost),
            url: getPostUrl(fallbackPost),
            type: 'article'
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadPostAndList();
  }, [service, slug, id, locale, navigate]);

  const normalizedPost = useMemo(() => {
    if (!post) return null;
    return {
      id: post.id,
      title: post.title || 'Untitled',
      service: post.service || service || 'personal-growth',
      publishDate: post.publishDate || '',
      slug: post.slug || slug || '',
    };
  }, [post, service, slug]);

  // 取得當前分類對應的 CTA 引流卡片配置
  const ctaConfig = useMemo(() => {
    const s = normalizedPost?.service || 'personal-growth';
    return CATEGORY_CTA_CONFIG[s] || CATEGORY_CTA_CONFIG['personal-growth'];
  }, [normalizedPost]);

  // 計算「你可能也會想看」的 3 篇文章
  const relatedPosts = useMemo(() => {
    if (!normalizedPost || !allPosts.length) return [];

    const otherPosts = allPosts.filter(
      (p) => p.id !== normalizedPost.id && p.slug !== normalizedPost.slug
    );

    const sameCategoryPosts = otherPosts.filter((p) => p.service === normalizedPost.service);

    let selected = sameCategoryPosts.slice(0, 3);
    if (selected.length < 3) {
      const needed = 3 - selected.length;
      const selectedIds = new Set(selected.map((p) => p.id || p.slug));
      const fillPosts = otherPosts.filter((p) => !selectedIds.has(p.id || p.slug)).slice(0, needed);
      selected = [...selected, ...fillPosts];
    }

    return selected;
  }, [normalizedPost, allPosts]);

  const faqGroups = useMemo(() => {
    const groups = [];
    let currentGroup = null;
    
    faqBlocks.forEach(block => {
      const type = block.type;
      const content = block?.[type]?.rich_text?.[0]?.plain_text || block.text || "";
      
      if (type === 'heading_3' && (content.startsWith('Q:') || content.includes('Q:'))) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          question: content.replace(/^Q:\s*/i, '').trim(),
          blocks: []
        };
      } else if (currentGroup) {
        currentGroup.blocks.push(block);
      }
    });
    
    if (currentGroup) {
      groups.push(currentGroup);
    }
    return groups;
  }, [faqBlocks]);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400 font-sans">{dict.loadingPost}</div>;
  if (!normalizedPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans">
        <p>{dict.postNotFound}</p>
        <Link to="/insights" className="text-slate-700 font-bold hover:text-accent">
          {dict.backToInsights}
        </Link>
      </div>
    );
  }

  const backPath = normalizedPost.service ? `/insights/${normalizedPost.service}` : '/insights';

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-sans">
      <SEOHead
        title={normalizedPost.title}
        description={post?.excerpt || normalizedPost.title}
        type="article"
      />
      <article className="container mx-auto px-6 max-w-3xl">
        <Link to={backPath} className="text-slate-400 hover:text-accent transition-colors mb-8 inline-block font-bold text-sm tracking-widest">
          ← {dict.backToInsights}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight font-display">{normalizedPost.title}</h1>
          {isUsingFallback && <p className="text-sm text-slate-500 mb-4">{dict.fallbackHint}</p>}
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
            <span className="bg-slate-50 px-3 py-1 rounded text-slate-600 font-bold font-sans">
              {getServiceNameFromSlug(normalizedPost.service, locale, i18n)}
            </span>
            <span>{normalizedPost.publishDate}</span>
          </div>
          {Array.isArray(post?.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 文章正文區塊 */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
          {blocks.map((block) => {
            const type = block.type;
            if (type === 'image') {
              return (
                <figure key={block.id} className="my-10 flex flex-col items-center">
                  <img
                    src={block.image?.url}
                    alt={block.image?.alt}
                    className="rounded-lg shadow-md max-w-full h-auto border border-slate-100 hover:shadow-lg transition-shadow duration-300"
                  />
                  {block.image?.alt && (
                    <figcaption className="text-sm text-slate-400 mt-3 font-sans italic text-center">
                      {block.image.alt}
                    </figcaption>
                  )}
                </figure>
              );
            }

            const content = block?.[type]?.rich_text?.[0]?.plain_text || block.text;
            if (!content) return null;

            switch (type) {
              case 'heading_1':
                return <h1 key={block.id} className="text-3xl font-bold mt-12 mb-6 text-slate-900 font-display">{renderFormattedText(content)}</h1>;
              case 'heading_2':
                return <h2 key={block.id} className="text-2xl font-bold mt-10 mb-4 text-slate-900 border-l-4 border-accent pl-4 font-display">{renderFormattedText(content)}</h2>;
              case 'heading_3':
                return <h3 key={block.id} className="text-xl font-bold mt-8 mb-4 text-slate-900 font-display">{renderFormattedText(content)}</h3>;
              case 'bulleted_list_item':
                return <li key={block.id} className="ml-4 mb-2 list-disc">{renderFormattedText(content)}</li>;
              default:
                return <p key={block.id} className="mb-6">{renderFormattedText(content)}</p>;
            }
          })}
        </div>

        {/* 常見問題 FAQ (若有) */}
        {faqGroups.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-100 font-sans">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display flex items-center gap-3">
              <span className="p-1.5 bg-accent/10 text-accent rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </span>
              常見問題 (FAQ)
            </h2>
            <div className="space-y-4">
              {faqGroups.map((group, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left text-slate-900 font-bold hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="text-base md:text-lg pr-4 font-display flex items-start gap-3">
                        <span className="text-accent font-semibold font-mono">Q.</span>
                        {group.question}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-accent' : ''
                        }`} 
                      />
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-[1000px] border-t border-slate-50' : 'max-h-0'
                      }`}
                    >
                      <div className="p-5 bg-slate-50/30 prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm md:text-base">
                        {group.blocks.map((block) => {
                          const type = block.type;
                          const content = block?.[type]?.rich_text?.[0]?.plain_text || block.text;
                          if (!content) return null;
                          
                          const cleanContent = (type === 'paragraph' && content.startsWith('A:')) 
                            ? content.replace(/^A:\s*/i, '') 
                            : content;

                          switch (type) {
                            case 'heading_1':
                              return <h1 key={block.id} className="text-2xl font-bold mt-6 mb-4 text-slate-900 font-display">{renderFormattedText(cleanContent)}</h1>;
                            case 'heading_2':
                              return <h2 key={block.id} className="text-xl font-bold mt-5 mb-3 text-slate-900 border-l-4 border-accent pl-3 font-display">{renderFormattedText(cleanContent)}</h2>;
                            case 'heading_3':
                              return <h3 key={block.id} className="text-lg font-bold mt-4 mb-2 text-slate-900 font-display">{renderFormattedText(cleanContent)}</h3>;
                            case 'bulleted_list_item':
                              return <li key={block.id} className="ml-4 mb-1.5 list-disc">{renderFormattedText(cleanContent)}</li>;
                            default:
                              return <p key={block.id} className="mb-4">{renderFormattedText(cleanContent)}</p>;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 相關文章區塊：「你可能也會想看」 */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200/80 font-sans">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 font-display flex items-center gap-2">
              <span className="text-accent">💡</span> 你可能也會想看
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id || rPost.slug}
                  to={getPostPath(rPost)}
                  className="group bg-surface hover:bg-white p-5 rounded-xl border border-slate-200/60 hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 bg-slate-200/60 text-slate-700 rounded-sm mb-3 inline-block">
                      {getServiceNameFromSlug(rPost.service, locale, i18n)}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-3 font-display">
                      {rPost.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-sans pt-2 border-t border-slate-100">
                    {rPost.publishDate}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 統一的頁尾 CTA 引流區塊 */}
        {ctaConfig && (
          <section className="mt-12 pt-8 border-t border-slate-200 font-sans">
            <div className="bg-surface rounded-2xl p-8 md:p-10 border border-slate-200/70 shadow-sm text-left">
              <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 font-display">
                {ctaConfig.title}
              </h4>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-2xl font-light">
                {ctaConfig.desc}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={ctaConfig.btn1Url}
                  className="w-full sm:w-auto px-7 py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-secondary hover:shadow-md transition-all duration-200 text-center text-base cursor-pointer"
                >
                  {ctaConfig.btn1Text} ➔
                </a>
                <a
                  href={ctaConfig.btn2Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-lg hover:border-accent hover:text-accent hover:shadow-sm transition-all duration-200 text-center text-base cursor-pointer"
                >
                  {ctaConfig.btn2Text} ↗
                </a>
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default PostDetail;
