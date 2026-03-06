import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, i18n, onLocaleChange } from '../lib/i18n';
import { findPostByRoute, getServiceNameFromSlug, normalizePosts } from '../lib/insights-adapter';

const PostDetail = () => {
  const { service, slug, id } = useParams();
  const navigate = useNavigate();
  const [locale, setLocale] = useState(getPreferredLocale());
  const [post, setPost] = useState(null);
  const [blocks, setBlocks] = useState([]);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-slate-400">{dict.loadingPost}</div>;
  if (!normalizedPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>{dict.postNotFound}</p>
        <Link to="/insights" className="text-slate-700 font-bold hover:text-[#D4AF37]">
          {dict.backToInsights}
        </Link>
      </div>
    );
  }

  const backPath = normalizedPost.service ? `/insights/${normalizedPost.service}` : '/insights';
  const pageTitle = `${normalizedPost.title} | ${dict.insights} | Erick Firm`;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={post?.excerpt || normalizedPost.title} />
      </Helmet>
      <article className="container mx-auto px-6 max-w-3xl">
        <Link to={backPath} className="text-slate-400 hover:text-[#D4AF37] transition-colors mb-8 inline-block font-bold text-sm tracking-widest">
          ← {dict.backToInsights}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{normalizedPost.title}</h1>
          {isUsingFallback && <p className="text-sm text-slate-500 mb-4">{dict.fallbackHint}</p>}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="bg-slate-50 px-3 py-1 rounded text-slate-600 font-bold italic">
              {getServiceNameFromSlug(normalizedPost.service, locale, i18n)}
            </span>
            <span>{normalizedPost.publishDate}</span>
          </div>
        </header>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg">
          {blocks.map((block) => {
            const type = block.type;
            const content = block?.[type]?.rich_text?.[0]?.plain_text || block.text;
            if (!content) return null;

            switch (type) {
              case 'heading_1':
                return <h1 key={block.id} className="text-3xl font-bold mt-12 mb-6 text-slate-900">{content}</h1>;
              case 'heading_2':
                return <h2 key={block.id} className="text-2xl font-bold mt-10 mb-4 text-slate-900 border-l-4 border-[#D4AF37] pl-4">{content}</h2>;
              case 'heading_3':
                return <h3 key={block.id} className="text-xl font-bold mt-8 mb-4 text-slate-900">{content}</h3>;
              case 'bulleted_list_item':
                return <li key={block.id} className="ml-4 mb-2 list-disc">{content}</li>;
              default:
                return <p key={block.id} className="mb-6">{content}</p>;
            }
          })}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
