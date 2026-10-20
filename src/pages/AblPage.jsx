import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import fallbackData from '../data/insights.fallback.json';
import { LINE_CONFIG } from '../lib/constants';
import { getPostPath, normalizePosts } from '../lib/insights-adapter';
import SEOHead from '../components/SEOHead';
import Services from '../components/Services';
import HeroTextReveal from '../components/HeroTextReveal';
import AblLegalFooter from '../components/AblLegalFooter';
import './AblPage.css';

const TITLE = '艾伯林量子調頻｜最近我到底怎麼了';
const DESCRIPTION = '努力很久，狀態卻回不來。艾伯林量子調頻從你現在的狀態開始看，先找到力氣從哪裡漏掉，再決定調整什麼。';

const sortByDate = (posts) => [...posts].sort((a, b) => {
  const dateA = new Date(a.publishDate || a.publish_date || a.createdAt || a.created_at || 0).getTime();
  const dateB = new Date(b.publishDate || b.publish_date || b.createdAt || b.created_at || 0).getTime();
  return dateB - dateA;
});

const getAblPosts = (posts) => sortByDate(
  normalizePosts(posts || [], 'zh-TW').filter((post) => post.service === 'personal-growth')
).slice(0, 6);

const ABLPage = () => {
  const [posts, setPosts] = useState(() => getAblPosts(fallbackData.posts || []));
  const [logoFailed, setLogoFailed] = useState(false);

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://erickfirm.com/abl#service',
        name: '艾伯林量子調頻',
        url: 'https://erickfirm.com/abl',
        provider: { '@id': 'https://erickfirm.com/#erick' },
        serviceType: 'Personal State Support',
        description: DESCRIPTION,
        areaServed: 'TW',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://erickfirm.com/abl',
        name: TITLE,
        url: 'https://erickfirm.com/abl',
        inLanguage: 'zh-Hant',
        about: { '@id': 'https://erickfirm.com/abl#service' },
      },
    ],
  }), []);

  useEffect(() => {
    let active = true;
    async function loadPosts() {
      try {
        const response = await fetch('/api/notion?lang=zh-TW');
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();
        const nextPosts = getAblPosts(data.posts || data.results || []);
        if (!nextPosts.length) throw new Error('empty');
        if (active) setPosts(nextPosts);
      } catch {
        if (active) setPosts(getAblPosts(fallbackData.posts || []));
      }
    }
    loadPosts();
    return () => { active = false; };
  }, []);

  const scrollToArticles = () => {
    document.getElementById('abl-articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="theme-abl bg-white text-slate-900">
      <SEOHead title={TITLE} description={DESCRIPTION} exactTitle />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="abl-hero bg-[#fbfaf7] px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="abl-logo-card">
            {!logoFailed ? (
              <img
                src="/brand/abl-logo.png"
                alt="艾伯林量子調頻"
                width="500"
                height="500"
                loading="eager"
                className="abl-logo"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="abl-logo-text">艾伯林量子調頻</span>
            )}
          </div>
          <HeroTextReveal
            title="最近我到底怎麼了"
            subtitle="艾伯林量子調頻，從你現在的狀態開始看，陪你把長期撐住的狀態，慢慢調回來。"
            titleClassName="abl-heading text-4xl font-bold leading-tight text-slate-900 md:text-6xl"
            subtitleClassName="mt-7 max-w-3xl text-base leading-loose text-slate-600 md:text-xl"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900 md:text-4xl">艾伯林量子調頻在看什麼</h2>
          <div className="mt-8 space-y-5 text-base leading-loose text-slate-600 md:text-lg">
            <p>同一件事，狀態不同，走出來的結果就不同。</p>
            <p>想做的事能不能走得下去，常常取決於現在的狀態。</p>
            <p>所以我們先看這個：你現在的狀態，在哪裡。</p>
          </div>
        </div>
      </section>

      <section className="abl-section-muted bg-[#f3f4f1] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900 md:text-4xl">你可能正在這樣</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['活得很努力，卻看不到未來', '每天都在做該做的事，往前看，卻看不清楚路。'],
              ['一直以來都沒有不好，總覺得可以更好', '沒有出大問題，也說不出哪裡不對，只是知道自己還有空間。'],
              ['休完假還是累，是老了，還是提不起勁', '睡也睡了，假也放了，力氣卻沒有回來。'],
            ].map(([title, body]) => (
              <button
                key={title}
                type="button"
                onClick={scrollToArticles}
                aria-controls="abl-articles"
                className="abl-card card-soft h-full p-7 text-left transition-transform hover:-translate-y-1 md:p-9"
              >
                <h3 className="text-xl font-bold leading-relaxed text-slate-900">{title}</h3>
                <p className="mt-5 text-sm leading-loose text-slate-600">{body}</p>
              </button>
            ))}
          </div>
          <div className="mt-10 space-y-2 text-sm leading-loose text-slate-600 md:text-base">
            <p>你一路扛起來的角色，是你自己認可的，也是你自己願意扛的。</p>
            <p>只是扛得久了，身體和狀態開始出現訊號。</p>
            <p>這些訊號是身體在說話，值得被好好理解。</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900 md:text-4xl">訊號值得被理解</h2>
          <div className="mt-8 space-y-5 text-base leading-loose text-slate-600 md:text-lg">
            <p>訊號可以被處理，但它為什麼會出現，常常不是單一原因。</p>
            <p>我們從多個角度、多個層次，把你當成一個完整的人來看。</p>
          </div>
        </div>
      </section>

      <section className="abl-section-muted bg-[#eef1ef] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900 md:text-4xl">我們怎麼看這件事</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['先看現在的狀態', '先把你現在的樣子看清楚，再談下一步。'],
              ['找到力氣從哪裡漏掉', '是長期撐著，是反覆出現的模式，還是環境與關係裡的消耗。'],
              ['再決定調整什麼', '看清楚了，才知道哪裡值得調，哪裡先維持原樣。'],
            ].map(([title, body]) => (
              <article key={title} className="abl-card card-soft h-full p-7 md:p-9">
                <h3 className="abl-heading text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-5 text-sm leading-loose text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl leading-loose text-slate-800 md:text-2xl">這樣的時刻，你也有過。先加 LINE，我們從你現在的狀態開始。</p>
          <a
            href={LINE_CONFIG.LINE_ADD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="abl-cta mt-8 inline-flex items-center justify-center px-7 py-4 text-sm font-bold transition-opacity hover:opacity-90"
          >
            加 LINE
          </a>
        </div>
      </section>

      <section id="abl-articles" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900 md:text-4xl">持續更新的文章</h2>
          {posts.length > 0 && (
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <Link key={post.id || post.slug} to={getPostPath(post)} className="card-soft group bg-[#f5f6f3] p-6">
                  <h3 className="abl-heading font-semibold leading-snug text-slate-900 group-hover:underline">{post.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
          <Link to="/insights/personal-growth" className="mt-8 inline-flex items-center gap-2 font-medium text-slate-900 hover:underline">
            看全部文章 <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Services linked current="abl" />

      <section className="bg-[#fbfaf7] px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="abl-heading text-2xl font-bold text-slate-900">2027 年度頻率支持</h2>
          <p className="mt-3 text-sm leading-loose text-slate-600">團體與個人年度方案，十一月陸續開放</p>
          <Link to="/abl/2027" className="abl-cta mt-6 inline-flex items-center justify-center px-7 py-4 text-sm font-bold transition-opacity hover:opacity-90">
            了解方案內容
          </Link>
        </div>
      </section>

      <section className="bg-white px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-600">
          <span>年度頻率支持 即將開放</span>
          <span>空間調頻 即將開放</span>
          <span>2027 年度導航 即將開放</span>
          <Link to="/about" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-950">認識艾瑞克</Link>
        </div>
        <p className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-6 text-xs leading-loose text-slate-500">
          艾伯林量子調頻提供的是狀態理解與支持，不是醫療、診斷或療效保證。
        </p>
      </section>
      <AblLegalFooter />
    </main>
  );
};

export default ABLPage;
