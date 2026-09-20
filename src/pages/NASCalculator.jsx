import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const API_URL = '/.netlify/functions/ai_reading';

/**
 * 靈魂等級——依先天數、後天數、主命數的有無判定，共七級。
 * 對外語言刻意只保留「學生階段」這個比喻與行為描述：
 * 原始資料裡的前世／乘願／年齡斷言都不放上公開頁面。
 * 級數不是分數，這件事必須跟著一起出現，否則一定被誤讀成分數高低。
 */
const SOUL_LEVELS = {
  1: { stage: '幼稚園生', work: '什麼都是新的，靠嘗試和犯錯在學，需要有人陪著。' },
  2: { stage: '小學生', work: '開始自己探索，需要有人帶著，也需要紀律。' },
  3: { stage: '國中生', work: '在團體裡找自己，最在意朋友怎麼看你。' },
  4: { stage: '高中生', work: '開始長出自己的一套想法，會挑戰權威。' },
  5: { stage: '大學生', work: '往內看，能反省自己的模式，也開始影響別人。' },
  6: { stage: '博士生', work: '專精在某個領域，把內在的東西真的做出來。' },
  7: { stage: '傑出校友', work: '很習慣把自己放到最後，力氣大多給了別人。' },
};

const soulOf = (raw) => {
  const n = parseInt(String(raw || '').replace(/\D/g, ''), 10);
  return SOUL_LEVELS[n] ? { n, ...SOUL_LEVELS[n] } : null;
};

// '+30/3' → { total: '30', main: '3', chain: ['30','3'] }
const mainOf = (raw) => {
  const chain = String(raw || '').replace(/^[+-]/, '').split('/').filter(Boolean);
  if (!chain.length || chain.some((x) => x.includes('?'))) return null;
  return { total: chain[0], main: chain[chain.length - 1], chain };
};

const STRUCTURED = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '生命數字計算',
  url: 'https://erickfirm.com/nas/calculator',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
  provider: { '@type': 'Person', name: '艾瑞克', '@id': 'https://erickfirm.com/#person' },
  description: '輸入西元生日，計算主命數與陽曆、陰曆雙軌生命數字結構。',
};

const NASCalculator = () => {
  const [birthdate, setBirthdate] = useState('');
  const [lunarOverride, setLunarOverride] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  React.useEffect(() => {
    let el = document.querySelector('#nas-calc-jsonld');
    if (!el) {
      el = document.createElement('script');
      el.id = 'nas-calc-jsonld';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(STRUCTURED);
    return () => { el?.remove(); };
  }, []);

  const run = async (e) => {
    e.preventDefault();
    if (!birthdate.trim()) return;
    setState('loading');
    setErrMsg('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'report',
          birthdate: birthdate.trim(),
          lunarBirthdate: lunarOverride.trim(),
        }),
      });
      if (!res.ok) throw new Error('連線失敗');
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || '生日格式看起來不對，請用西元年月日');
      setResult(json);
      setState('done');
    } catch (err) {
      setErrMsg(err.message || '出了點狀況，稍後再試一次');
      setState('error');
    }
  };

  const p = result?.parsed;

  // 兩軌的落差——這一塊才是免費計算器真正要交付的東西。
  // 數字本身網路上都查得到；「對外和對內不是同一個人」是這裡才看得見的。
  const gap = React.useMemo(() => {
    if (!p) return null;
    const sm = mainOf(p.solarMain);
    const lm = mainOf(p.lunarMain);
    const ss = soulOf(p.solarSoul);
    const ls = soulOf(p.lunarSoul);
    if (!sm || !lm) return null;

    const same = sm.main === lm.main;
    const mainLine = same
      ? `對外和內在的主命數都是 ${sm.main}。兩軌同向的人不算多——你要的和你做的，方向是一致的。`
      : `對外你走的是 ${sm.main}，內在要的是 ${lm.main}。這兩個不一樣。`;

    let soulLine = null;
    if (ss && ls) {
      soulLine = ss.n === ls.n
        ? `靈魂等級兩邊都是 ${ss.n} 級，都在${ss.stage}這個階段的功課上。`
        : `靈魂等級也不同：對外像個${ss.stage}，內在還是個${ls.stage}。`;
    }

    const closing = same && ss && ls && ss.n === ls.n
      ? '兩軌一致不代表沒有課題，只代表你的拉扯不在這裡——而是在別的地方。'
      : '這個落差不是你哪裡有問題。是你身上有兩股力量在往不同方向拉——你在做的很多決定，其實都是在這兩股之間妥協。';

    return { mainLine, soulLine, closing };
  }, [p]);

  return (
    <main className="bg-white text-[#1F1A2E]">
      <SEOHead
        title="生命數字計算｜輸入生日，看懂你的陽曆與陰曆雙軌結構"
        description="免費生命數字計算。輸入西元生日，算出主命數與陽曆、陰曆雙軌結構。不只給你一個數字——還告訴你為什麼同樣的數字會長成完全不同的人。艾瑞克，二十年生命數字教學。"
      />

      {/* 輸入 */}
      <section className="pt-32 pb-14 px-6">
        <div className="max-w-2xl mx-auto">
          <NASMark label="生命數字計算" />
          <h1 className="text-2xl md:text-4xl font-bold leading-snug mb-5">
            輸入生日，看你的雙軌結構
          </h1>
          <p className="text-[#55506B] leading-loose mb-9">
            三十秒算完，不用留任何資料。
            陽曆看你對外的展現，陰曆看你內在真正的需求——多數人的卡點，就落在這兩者不一致的地方。
          </p>

          <form onSubmit={run} className="space-y-4">
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium mb-2">
                西元出生年月日
              </label>
              <input
                id="birthdate"
                inputMode="numeric"
                placeholder="例如 19850312 或 1985-03-12"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#DAD4E8] focus:border-[#5B3A9E] focus:outline-none focus:ring-2 focus:ring-[#E7E3F0] text-base"
              />
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer text-[#6E6885] hover:text-[#1F1A2E] py-1">
                我知道自己的農曆生日，想自己填
              </summary>
              <div className="pt-3">
                <input
                  id="lunarBirthdate"
                  inputMode="numeric"
                  placeholder="農曆生日（可留空，系統會自動換算）"
                  value={lunarOverride}
                  onChange={(e) => setLunarOverride(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DAD4E8] focus:border-[#5B3A9E] focus:outline-none text-base"
                />
              </div>
            </details>

            <button
              type="submit"
              disabled={state === 'loading'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] disabled:opacity-50 transition"
            >
              {state === 'loading' ? '計算中⋯' : '開始計算'}
            </button>
          </form>

          {state === 'error' && (
            <p className="mt-4 text-sm text-red-700">{errMsg}</p>
          )}
        </div>
      </section>

      {/* 結果 */}
      {state === 'done' && p && (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="pb-14 px-6"
        >
          <div className="max-w-2xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { icon: <Sun size={15} />, label: '陽曆 · 對外的展現',
                  hint: '你習慣呈現出來的樣子', m: mainOf(p.solarMain), s: soulOf(p.solarSoul) },
                { icon: <Moon size={15} />, label: '陰曆 · 內在的需求',
                  hint: '你心裡真正在要的東西', m: mainOf(p.lunarMain), s: soulOf(p.lunarSoul) },
              ].map((t) => (
                <div key={t.label} className="p-6 rounded-2xl border border-[#E7E3F0]">
                  <div className="flex items-center gap-2 text-[#918BA6] text-xs mb-1">
                    {t.icon} {t.label}
                  </div>
                  <p className="text-xs text-[#918BA6] mb-5">{t.hint}</p>

                  <p className="text-sm text-[#6E6885] mb-1">主命數</p>
                  <p className="text-4xl font-bold tabular-nums leading-none mb-2">
                    {t.m ? t.m.main : '—'}
                  </p>
                  {t.m && (
                    <p className="text-xs text-[#918BA6] mb-6">
                      生日數字相加是 {t.m.total}，再收到個位數就是 {t.m.main}
                    </p>
                  )}

                  <p className="text-sm text-[#6E6885] mb-1">靈魂等級</p>
                  {t.s ? (
                    <>
                      <p className="text-lg font-semibold mb-1">
                        <span className="tabular-nums">{t.s.n}</span> 級 · {t.s.stage}
                      </p>
                      <p className="text-xs text-[#6E6885] leading-relaxed">{t.s.work}</p>
                    </>
                  ) : (
                    <p className="text-lg">—</p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-[#A8883F] font-semibold mb-6">
              級數不是分數。七級不比一級好，只是功課不同。
            </p>

            {gap && (
              <div className="p-6 rounded-2xl border-l-2 border-[#D4B86A] bg-[#FBF7EE]/60">
                <h3 className="font-bold mb-4 text-[#1F1A2E]">你的兩軌，差在哪裡</h3>
                {gap.mainLine && (
                  <p className="text-[#55506B] leading-loose mb-3">{gap.mainLine}</p>
                )}
                {gap.soulLine && (
                  <p className="text-[#55506B] leading-loose mb-3">{gap.soulLine}</p>
                )}
                <p className="text-[#55506B] leading-loose">{gap.closing}</p>
              </div>
            )}

            {result.lunar_birthday_text && (
              <p className="mt-5 text-xs text-[#918BA6]">
                農曆生日：{result.lunar_birthday_text}
              </p>
            )}
          </div>
        </motion.section>
      )}

      {/* 算完了，然後呢 — 唯一的轉換點 */}
      {state === 'done' && (
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="py-16 px-6 bg-[#F7F5FC]"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-5">算完了，然後呢？</h2>
            <p className="text-[#55506B] leading-loose mb-4">
              你剛才拿到的是一組數字。網路上查得到它的標準描述——但如果你看了覺得
              <strong className="text-[#1F1A2E]">「有點準，又不太像我」</strong>，
              那個感覺是對的，而且有原因。
            </p>
            <p className="text-[#55506B] leading-loose mb-8">
              那些描述只寫了對外那一軌。你內在要的東西不在上面，
              而你每天真正在消耗力氣的地方，是這兩軌互相拉扯的中間。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 按鈕的文字就是承諾，落點必須兌現它。
                  slug 由文章標題產生，所以 Supabase 上那篇的標題不能改，改了這個連結就斷。 */}
              <Link
                to={`/insights/life-number/${encodeURIComponent('為什麼算出來不像我')}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition"
              >
                為什麼算出來不像我
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/nas/meili"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4B86A] text-[#A8883F] hover:border-[#A8883F] hover:bg-[#FBF7EE] transition"
              >
                今天的數字呢？
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* 說明 — 未計算時也要有內容可讀，供爬蟲索引 */}
      <section className="py-16 px-6 border-t border-[#F0EDF7]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-5">這個計算器算什麼</h2>
          <p className="text-[#55506B] leading-loose mb-4">
            <strong>主命數</strong>是把西元出生年月日的每一位數字相加、收斂到個位數得到的。
            它描述的是你這一生最主要會反覆遇到的功課——注意，是<strong>題目</strong>，不是答案。
          </p>
          <p className="text-[#55506B] leading-loose mb-4">
            多數計算器算到這裡就停了。這裡多算兩件事：
          </p>
          <ul className="text-[#55506B] leading-loose space-y-2 mb-6 list-disc pl-5">
            <li><strong>陰曆盤</strong>——陽曆描述你對外的展現與思考方式，陰曆描述你內在的感受與真正的需求。兩邊不一致的地方，通常就是卡住的地方。</li>
            <li><strong>靈魂等級</strong>——依先天數、後天數與主命數的有無判定，描述的是你目前在處理哪個階段的功課。</li>
          </ul>

          <h3 className="font-bold mb-3 mt-10">靈魂等級的七個階段</h3>
          <p className="text-[#55506B] leading-loose mb-5">
            用求學階段來比喻最好懂。
            <strong className="text-[#1F1A2E]">級數不是分數，七級不比一級好</strong>——
            就像博士生不會比小學生「更厲害」，只是在學不一樣的東西。
          </p>
          <div className="rounded-2xl border border-[#E7E3F0] overflow-hidden mb-6">
            {Object.entries(SOUL_LEVELS).map(([n, v], i) => (
              <div
                key={n}
                className={`grid grid-cols-[52px_84px_1fr] gap-2 px-4 py-3 text-sm ${
                  i % 2 ? 'bg-white' : 'bg-[#F7F5FC]/50'
                }`}
              >
                <span className="text-[#A8883F] font-semibold tabular-nums">{n} 級</span>
                <span className="font-semibold text-[#1F1A2E]">{v.stage}</span>
                <span className="text-[#55506B] leading-relaxed">{v.work}</span>
              </div>
            ))}
          </div>
          <p className="text-[#55506B] leading-loose">
            算出來的數字不會決定你是誰。它只告訴你要處理什麼題目——怎麼答，還是你自己的事。
          </p>
        </div>
      </section>
    </main>
  );
};

export default NASCalculator;
