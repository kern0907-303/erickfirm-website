import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, LayoutDashboard, ArrowRight, Check, X } from 'lucide-react';
import fallbackData from '../data/insights.fallback.json';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';
import { getPostPath, normalizePosts } from '../lib/insights-adapter';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const SERVICE = 'life-number';

const copy = {
  'zh-TW': {
    badge: '平衡空間 NAS ｜ 生命數字',
    h1a: '你算過很多次，',
    h1b: '但沒有一次讓你真的改變。',
    lede:
      '你查到的解析總是有點準，又不太像你。那不是算錯——是你跟那段描述，不在同一個位置上。二十年來我看過太多人卡在這裡：不是資訊不夠，是看自己的方式沒換過。',
    ctaPrimary: '先免費算一次',
    ctaSecondary: '那到底是卡在哪？',

    diffTitle: '你不是做不到',
    diffLede:
      '道理你都懂，方法你也試過。卡住的是心裡那一塊怎麼都過不去的地方——然後你開始怪自己不夠堅強。',
    conflicts: [
      '我知道該把話講開，但每次話到嘴邊就吞回去。',
      '我知道孩子大了該放手，可是他不需要我的時候，我心裡空一塊。',
      '我知道休息不是偷懶，但一停下來就覺得自己沒用。',
    ],
    diffHit: '這三句裡，通常至少有一句是你。',
    diffNote:
      '這不是意志力的問題。是你的道理和你的感受站在兩邊——你一直只聽道理那一邊，另一邊就從來沒被處理過。它不會自己消失，只會在你最累的時候跳出來。',
    diffClose:
      '那些過不去的地方是有形狀的，也有解法。這堂課教的，就是怎麼把它們一個一個找出來。',

    toolTitle: '先看看你的數字',
    toolDesc: '輸入生日，三十秒算完。不用留資料，算完就能看。',
    toolCta: '開始計算',

    articlesTitle: '在你決定之前，先讀這些',
    articlesDesc: '這裡不寫「幾號人適合什麼職業」——那種文章網路上已經夠多了。這裡寫的是照著做之後，為什麼還是卡住。',
    articlesMore: '看全部文章',

    courseTitle: '你查一下天氣才出門。你的數字也是。',
    courseDesc:
      '主命數是氣候——你住在哪個氣候帶，一輩子不變。流年、流月、流日是天氣——今天會不會下雨，每天都不一樣。多數人只知道自己的氣候，然後穿同一套衣服過每一天：該往前的時候收手，該休息的時候硬撐。那個落差，就是很多人「明明很努力卻一直不對」的原因。',
    courseCta: '看數字每曆',

    honestTitle: '什麼時候你不需要找我',
    honestLede: '先講清楚，可以省下你的時間和錢。',
    honestNo: [
      '你只是好奇自己是幾號人 — 上面的免費計算就夠了，不用花錢。',
      '你現在的狀態是「真的沒有多餘的一格可以撥出去」 — 那要先處理現實負擔，不是先來上課。',
      '你有持續影響到日常生活的睡眠或情緒狀況 — 先找醫療專業，我不做也不取代醫療判斷。',
    ],
    honestYesTitle: '什麼時候這裡幫得上你',
    honestYes: [
      '你知道問題在哪，也試過了，但還是反覆回到原點。',
      '你查過自己的數字，覺得有點準又不太像，說不上來哪裡怪。',
      '你學過不少東西，但生活沒有真正改變。',
    ],
  },
};

const NAS = () => {
  const [locale, setLocale] = useState(getPreferredLocale());
  const [posts, setPosts] = useState([]);
  const t = copy[locale] || copy['zh-TW'];

  useEffect(() => onLocaleChange(setLocale), []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/.netlify/functions/notion?lang=${encodeURIComponent(locale)}`);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        const list = normalizePosts(data.posts || data.results || [], locale);
        if (!list.length) throw new Error('empty');
        setPosts(list);
      } catch {
        setPosts(normalizePosts(fallbackData.posts || [], locale));
      }
    }
    load();
  }, [locale]);

  const nasPosts = useMemo(
    () => posts.filter((p) => p.service === SERVICE).slice(0, 6),
    [posts]
  );

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': 'https://erickfirm.com/nas#service',
          name: '平衡空間 NAS｜生命數字',
          alternateName: ['生命數字', '生命靈數', '艾瑞克 生命數字'],
          serviceType: 'Numerology-based self-understanding education',
          provider: { '@id': 'https://erickfirm.com/#person' },
          areaServed: 'TW',
          description:
            '以生命數字為工具的自我理解教學。核心不是判斷準不準，而是找出道理與感受互相拉扯的地方——知道該怎麼做、心裡卻有一塊過不去，那一塊才是真正卡住的原因。',
          audience: {
            '@type': 'Audience',
            audienceType: '對自我理解、關係模式與人生方向感到卡住的成年人',
          },
        },
        {
          '@type': 'WebPage',
          '@id': 'https://erickfirm.com/nas',
          name: '平衡空間 NAS｜生命數字',
          isPartOf: { '@type': 'WebSite', name: 'Erick Firm', url: 'https://erickfirm.com' },
          about: { '@id': 'https://erickfirm.com/nas#service' },
        },
      ],
    }),
    []
  );

  useEffect(() => {
    let el = document.querySelector('#nas-jsonld');
    if (!el) {
      el = document.createElement('script');
      el.id = 'nas-jsonld';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(structuredData);
    return () => { el?.remove(); };
  }, [structuredData]);

  return (
    <main className="bg-white text-[#1F1A2E]">
      <SEOHead
        title="生命數字｜你算過很多次，但沒有一次讓你真的改變 - 平衡空間 NAS"
        description="為什麼你查到的生命數字解析總是有點準又不太像你？那不是算錯。這裡談的是道理都懂、心裡卻有一塊過不去的那種卡住——我知道該把話講開但話到嘴邊就吞回去、我知道休息不是偷懶但一停下來就覺得自己沒用。艾瑞克，二十年生命數字教學。"
      />

      {/* 1. HERO — 命題，不是服務介紹 */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white via-[#F4F0FB]/60 to-white">
        <div className="max-w-4xl mx-auto">
          <NASMark label="生命數字" />
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-3xl md:text-5xl font-bold leading-snug mb-8"
          >
            {t.h1a}
            <br />
            <span className="text-[#6E6885]">{t.h1b}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-[#55506B] leading-loose mb-10 max-w-3xl"
          >
            {t.lede}
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/nas/calculator"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition"
            >
              <Calculator size={18} />
              {t.ctaPrimary}
            </Link>
            <a
              href="#difference"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4B86A] text-[#A8883F] hover:border-[#A8883F] hover:bg-[#FBF7EE] transition"
            >
              {t.ctaSecondary}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 2. 差異化 — 內在與外在的矛盾。
          刻意不講四階：那是課堂裡拆矛盾的工具，不是門口的招牌。
          這一段的任務是讓她認出自己一直在硬撐，不是讓她學會一套架構。 */}
      <section id="difference" className="py-20 px-6 border-t border-[#F0EDF7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">{t.diffTitle}</h2>
          <p className="text-[#55506B] text-base md:text-lg leading-loose mb-12">
            {t.diffLede}
          </p>

          <div className="mb-6">
            {t.conflicts.map((line, i) => (
              <p
                key={line}
                className={`text-lg md:text-xl leading-relaxed text-[#1F1A2E] py-5 ${
                  i === 0 ? '' : 'border-t border-[#F0EDF7]'
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          <p className="text-sm font-semibold text-[#A8883F] mb-12">{t.diffHit}</p>

          <p className="text-[#55506B] leading-loose mb-8 border-l-2 border-[#D4B86A] pl-6">
            {t.diffNote}
          </p>

          <p className="text-lg font-medium leading-relaxed text-[#1F1A2E]">
            {t.diffClose}
          </p>
        </div>
      </section>

      {/* 3. 免費計算器 — 主要轉換行動 */}
      <section className="py-20 px-6 bg-[#F7F5FC]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.toolTitle}</h2>
          <p className="text-[#55506B] mb-8">{t.toolDesc}</p>
          <Link
            to="/nas/calculator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition"
          >
            <Calculator size={18} />
            {t.toolCta}
          </Link>
        </div>
      </section>

      {/* 4. 文章 SILO HUB */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.articlesTitle}</h2>
          <p className="text-[#55506B] mb-10 max-w-3xl leading-relaxed">{t.articlesDesc}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {nasPosts.map((post) => (
              <Link
                key={post.id}
                to={getPostPath(post)}
                className="group p-6 rounded-2xl border border-[#E7E3F0] hover:border-[#5B3A9E] transition"
              >
                <h3 className="font-semibold mb-2 group-hover:underline leading-snug">{post.title}</h3>
                <p className="text-sm text-[#6E6885] line-clamp-2 leading-relaxed">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          <Link
            to={`/insights/${SERVICE}`}
            className="inline-flex items-center gap-2 text-[#1F1A2E] font-medium hover:underline"
          >
            {t.articlesMore}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. 課程 */}
      <section className="py-20 px-6 border-t border-[#F0EDF7]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayoutDashboard size={22} className="text-[#918BA6]" />
            <h2 className="text-2xl md:text-3xl font-bold">{t.courseTitle}</h2>
          </div>
          <p className="text-[#55506B] leading-loose mb-8 max-w-3xl">{t.courseDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/nas/meili"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#5B3A9E] text-[#1F1A2E] hover:bg-[#5B3A9E] hover:text-white transition"
            >
              {t.courseCta}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/nas/course"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#DAD4E8] text-[#55506B] hover:border-[#5B3A9E] transition"
            >
              想真的看懂？看課程
            </Link>
          </div>
        </div>
      </section>

      {/* 6. 誠實排除 — 信任訊號 */}
      <section className="py-20 px-6 bg-[#F7F5FC]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold mb-2">{t.honestTitle}</h2>
            <p className="text-sm text-[#6E6885] mb-6">{t.honestLede}</p>
            <ul className="space-y-4">
              {t.honestNo.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[#55506B] leading-relaxed">
                  <X size={16} className="shrink-0 mt-1 text-[#918BA6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">{t.honestYesTitle}</h2>
            <p className="text-sm text-[#6E6885] mb-6">&nbsp;</p>
            <ul className="space-y-4">
              {t.honestYes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[#55506B] leading-relaxed">
                  <Check size={16} className="shrink-0 mt-1 text-[#1F1A2E]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NAS;
