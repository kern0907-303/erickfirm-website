import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { HelpCircle, ChevronDown } from 'lucide-react';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { findPostByRoute, getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';

const renderFormattedText = (text) => {
  if (typeof text !== 'string') return text;
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
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
  const [blocks, setBlocks] = useState([]);
  const [faqBlocks, setFaqBlocks] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const canonicalKeyRef = useRef('');
  const dict = i18n[locale];

  useEffect(() => onLocaleChange(setLocale), []);

  useEffect(() => {
    canonicalKeyRef.current = post?.canonicalKey || '';
  }, [post]);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ lang: locale });
        if (id && !slug) {
          query.set('postId', id);
        } else {
          query.set('service', service || '');
          query.set('slug', slug || '');
          if (canonicalKeyRef.current) {
            query.set('canonicalKey', canonicalKeyRef.current);
          }
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
        if (!id && remotePost.service && remotePost.slug && (remotePost.service !== service || remotePost.slug !== slug)) {
          navigate(`/insights/${remotePost.service}/${remotePost.slug}`, { replace: true });
        }
      } catch (error) {
        console.error('Post detail fetch error:', error);
        const fallbackPosts = normalizePosts(fallbackData.posts || [], locale);
        const fallbackPost = findPostByRoute(fallbackPosts, { service, slug, id });
        setPost(fallbackPost);
        setBlocks(Array.isArray(fallbackPost?.blocks) ? fallbackPost.blocks : []);
        setFaqBlocks([]);
        setIsUsingFallback(!!fallbackPost);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [service, slug, id, locale, navigate]);

  const normalizedPost = useMemo(() => {
    if (!post) return null;
    return {
      id: post.id,
      title: post.title || 'Untitled',
      service: post.service || service || 'personal-growth',
      publishDate: post.publishDate || '',
    };
  }, [post, service]);

  const aeoJsonString = useMemo(() => {
    if (!post?.aeoSchema) return null;
    const match = post.aeoSchema.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    return match ? match[1].trim() : post.aeoSchema.trim();
  }, [post]);

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
  const pageTitle = `${normalizedPost.title} | ${dict.insights} | Erick Firm`;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={post?.excerpt || normalizedPost.title} />
        {aeoJsonString && (
          <script type="application/ld+json">
            {aeoJsonString}
          </script>
        )}
      </Helmet>
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
      </article>
    </div>
  );
};

export default PostDetail;
