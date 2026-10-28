import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import HeroTextReveal from '../components/HeroTextReveal';
import { DAILY_RELATION_COPY } from '../content/nasLifeNumberCopy';
import { relationForPaths } from '../lib/numerology/dailyGuidance';

const API_URL = '/api/ai_reading';

// '+22/4' → '22／4'（整條顯示，不丟掉後天數與 11／22 主數）
const chainOf = (raw) => {
  const c = String(raw || '').replace(/^[+-]/, '').split('/').filter(Boolean);
  return (!c.length || c.some((x) => x.includes('?'))) ? null : c.join('／');
};

// The shared guidance helper keeps this page's established daily messages intact.

// 19750909 → 1975/09/09（只用於顯示，送去計算的仍是原字串）
const prettyDate = (raw) => {
  const d = String(raw || '').replace(/\D/g, '');
  return d.length === 8 ? `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6)}` : raw;
};

// 2026-10-26：數字每曆併入 365 能量氣象台，不單獨販售；全年服務跟 2027 年度導航一起提供。
const FEATURES = [
  { name: '主命數、陽曆與陰曆雙盤（計算器）', free: true, paid: true },
  { name: '今天的流日', free: true, paid: true },
  { name: '前一天晚上，LINE 傳來明天的提醒', free: false, paid: true },
  { name: '隨時在 LINE 問今天、這個月或今年的狀態', free: false, paid: true },
  { name: '2027 年度導航報告（約 13 頁 PDF）', free: false, paid: true },
];

const NASDashboard = () => {
  const [birthdate, setBirthdate] = useState('');
  const [saved, setSaved] = useState('');        // 從計算頁帶過來的生日
  const [editing, setEditing] = useState(false); // 使用者按了「不是我」
  const [state, setState] = useState('idle');
  const [today, setToday] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  // 她在計算頁已經輸入過生日，這裡直接接過來，不要再問第二次。
  // 無痕模式讀不到會丟例外，忽略即可——就退回原本的輸入框。
  useEffect(() => {
    try {
      const b = localStorage.getItem('nas.birthdate');
      if (b && b.trim()) { setSaved(b.trim()); setBirthdate(b.trim()); }
    } catch { /* 讀不到就照原本流程輸入 */ }
  }, []);

  const useSaved = Boolean(saved) && !editing;

  const notMe = () => {
    setEditing(true);
    setBirthdate('');
    setToday(null);
    setState('idle');
    setErrMsg('');
    try { localStorage.removeItem('nas.birthdate'); } catch { /* 清不掉不影響 */ }
  };

  const run = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!birthdate.trim()) return;
    setState('loading');
    setErrMsg('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'report', birthdate: birthdate.trim() }),
      });
      if (!res.ok) throw new Error('連線失敗');
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || '生日格式看起來不對，請用西元年月日');
      setToday({
        icon: json.overall_icon,
        label: json.overall_label,
        percent: typeof json.overall_percent === 'number' ? json.overall_percent : null,
        solarDay: chainOf(json.parsed?.solarDay),
        lunarDay: chainOf(json.parsed?.lunarDay),
        solarRel: relationForPaths(json.parsed?.solarMain, json.parsed?.solarDay),
        lunarRel: relationForPaths(json.parsed?.lunarMain, json.parsed?.lunarDay),
      });
      setState('done');
    } catch (err) {
      setErrMsg(err.message || '出了點問題，稍後再試');
      setState('error');
    }
  };

  return (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead
      title="365 能量氣象台｜每天晚上，提醒你明天的天氣"
      description="主命數是氣候，是你的底層設定；流年、流月、流日是天氣，每天都不一樣。先免費看今天的流日；365 能量氣象台每天晚上用 LINE 提醒你明天，跟 2027 年度導航一起，付款日起一整年。"
    />

    <section className="pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <NASMark label="365 能量氣象台" />
        <HeroTextReveal
          title="你查一下天氣才出門。你的數字也是。"
          subtitle="每天晚上一則，提醒你明天的天氣。"
          titleClassName="text-3xl md:text-4xl font-bold leading-snug mb-4"
          subtitleClassName="text-sm font-semibold tracking-wide text-[#A8883F] mb-8"
        />
        <p className="text-[#55506B] leading-loose mb-5 max-w-2xl">
          主命數是<strong>氣候</strong>，是你的底層設定。
          數字本身不會換，但它在你身上跑成什麼樣子，是會變的，那正是可以動的地方。
          流年、流月、流日是<strong>天氣</strong>，今天會不會下雨，每天都不一樣。
        </p>
        <p className="text-[#55506B] leading-loose mb-5 max-w-2xl">
          多數人只知道自己的氣候，然後穿同一套衣服過每一天：該往前的時候收手，
          該休息的時候硬撐。那個落差，就是很多人「明明很努力卻一直不對」的原因。
        </p>
        <p className="text-[#55506B] leading-loose mb-10 max-w-2xl">
          365 能量氣象台每天晚上替你看一次明天。<strong>不用自己記、不用自己算，打開 LINE 看一眼就好。</strong>
        </p>
        {/* 直接把今天算給她看。只給今天，明天的提醒交給 365 能量氣象台。 */}
        <div className="p-6 rounded-2xl border border-[#E7E3F0] bg-[#F7F5FC]/50">
          <h2 className="font-bold mb-2">先免費看今天的流日</h2>

          {useSaved ? (
            <>
              <p className="text-sm text-[#6E6885] mb-5">
                用你剛才算過的生日
                <strong className="text-[#1F1A2E] tabular-nums mx-2">{prettyDate(saved)}</strong>
                直接看今天。
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-1">
                <button
                  type="button"
                  onClick={run}
                  disabled={state === 'loading'}
                  className="px-7 py-3 rounded-xl bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] disabled:opacity-50 transition"
                >
                  {state === 'loading' ? '計算中⋯' : '看今天的流日'}
                </button>
                <button
                  type="button"
                  onClick={notMe}
                  className="text-sm text-[#6E6885] underline underline-offset-4 hover:text-[#5B3A9E] transition"
                >
                  不是我，換一個生日
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[#6E6885] mb-5">輸入西元生日，馬上看今天你的流日。不用留資料。</p>
              <form onSubmit={run} className="flex flex-col sm:flex-row gap-3 mb-1">
                <input
                  id="meili-birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  inputMode="numeric"
                  placeholder="19750909"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#DAD4E8] bg-white tabular-nums focus:outline-none focus:border-[#5B3A9E] transition"
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="px-7 py-3 rounded-xl bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] disabled:opacity-50 transition"
                >
                  {state === 'loading' ? '計算中⋯' : '看今天'}
                </button>
              </form>
            </>
          )}
          {state === 'error' && <p className="text-sm text-red-700 mt-3">{errMsg}</p>}

          {state === 'done' && today && (
            <div className="mt-6 pt-6 border-t border-[#E7E3F0]">
              <p className="text-xs text-[#918BA6] mb-2">你今天的天氣</p>
              <p className="text-3xl font-bold mb-3 flex flex-wrap items-baseline gap-x-3">
                <span><span aria-hidden="true">{today.icon}</span> {today.label}</span>
                {today.percent != null && (
                  <span className="text-xl font-semibold tabular-nums text-[#6E6885]">
                    {today.percent}<span className="text-sm ml-0.5">%</span>
                  </span>
                )}
              </p>
              <p className="text-sm text-[#55506B] leading-relaxed mb-5">
                這個數字是你的生日跟今天的流日對出來的，所以每天都不一樣。
                天氣沒有好壞，下雨不是壞日子，只是今天適合做的事不一樣。
              </p>
              {/* 兩組數字要分得開，否則 26／8 24／6 會被讀成一串 268246 */}
              <p className="text-xs text-[#918BA6] mb-2">今天流日</p>
              <div className="flex flex-wrap gap-x-10 gap-y-3 mb-5">
                {today.solarDay && (
                  <span>
                    <span className="block text-xs text-[#918BA6] mb-0.5">陽曆</span>
                    <strong className="text-2xl font-bold text-[#1F1A2E] tabular-nums">{today.solarDay}</strong>
                  </span>
                )}
                {today.lunarDay && (
                  <span>
                    <span className="block text-xs text-[#918BA6] mb-0.5">陰曆</span>
                    <strong className="text-2xl font-bold text-[#1F1A2E] tabular-nums">{today.lunarDay}</strong>
                  </span>
                )}
              </div>

              {/* 只講她今天會遇到什麼。兩軌判斷相同就講一次，不同就分開講。 */}
              {(today.solarRel || today.lunarRel) && (
                <div className="mb-6 text-[#55506B] leading-loose">
                  {today.solarRel && today.solarRel === today.lunarRel ? (
                    <p>{DAILY_RELATION_COPY[today.solarRel]}</p>
                  ) : (
                    <>
                      {today.solarRel && (
                        <p className="mb-2">
                          <strong className="text-[#1F1A2E]">對外這一軌</strong>
                          ：{DAILY_RELATION_COPY[today.solarRel]}
                        </p>
                      )}
                      {today.lunarRel && (
                        <p>
                          <strong className="text-[#1F1A2E]">內在這一軌</strong>
                          ：{DAILY_RELATION_COPY[today.lunarRel]}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="p-5 rounded-xl border-l-2 border-[#D4B86A] bg-[#FBF7EE]/70">
                <p className="text-[#55506B] leading-loose mb-3">
                  <strong className="text-[#1F1A2E]">這是今天。明天的數字已經不一樣了。</strong>
                </p>
                <p className="text-[#55506B] leading-loose mb-3">
                  這裡只給你今天。問題是，等你察覺今天特別不順，這一天也已經過完了。
                </p>
                <p className="text-[#55506B] leading-loose">
                  365 能量氣象台會在<strong className="text-[#1F1A2E]">前一天晚上</strong>，用 LINE 把明天的提醒傳給你。
                  你多了一個晚上可以重新安排：那場難談的會要不要挪開、那通電話今天打還是明天打、
                  哪一天適合把心裡的話講出來。這些事，事前知道跟事後才懂，差很多。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* 免費與 365 對照 */}
    <section className="pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-[#E7E3F0] overflow-hidden">
          <div className="grid grid-cols-[1fr_88px_88px] bg-[#F7F5FC] text-xs text-[#6E6885]">
            <div className="px-5 py-3">內容</div>
            <div className="px-3 py-3 text-center">免費</div>
            <div className="px-3 py-3 text-center font-medium text-[#1F1A2E]">全年陪跑</div>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f.name}
              className={`grid grid-cols-[1fr_88px_88px] text-sm ${i % 2 ? 'bg-white' : 'bg-[#F7F5FC]/40'}`}
            >
              <div className="px-5 py-3.5 text-[#463F5C]">{f.name}</div>
              <div className="px-3 py-3.5 flex justify-center items-start">
                {f.free ? <Check size={16} className="text-[#1F1A2E]" /> : <Minus size={16} className="text-[#C4BDD6]" />}
              </div>
              <div className="px-3 py-3.5 flex justify-center items-start">
                <Check size={16} className="text-[#1F1A2E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-8">365 能量氣象台包含兩件事</h2>

        <h3 className="font-bold text-[#1F1A2E] mb-3">一、每天晚上，明天的提醒</h3>
        <p className="text-[#55506B] leading-loose mb-8">
          <strong className="text-[#1F1A2E]">前一天晚上，明天的提醒直接用 LINE 傳給你：</strong>
          適合推進什麼、先別碰什麼。不用打開網頁、不用自己記，你有一整個晚上可以重新安排。
        </p>

        <h3 className="font-bold text-[#1F1A2E] mb-3">二、想問的時候，隨時都能問</h3>
        <p className="text-[#55506B] leading-loose">
          想知道今天、這個月或今年的狀態，在 LINE 上直接問。年中迷路的時候，不用重新找方向。
        </p>
      </div>
    </section>

    {/* 取得方式：不單獨販售，跟年度導航一起 */}
    <section className="py-16 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">怎麼開始</h2>
        <p className="text-[#55506B] leading-loose mb-6">
          365 能量氣象台不單獨販售，它跟 2027 年度導航一起提供：報告是這一年的地圖，365 是每天的路況。
          期間從付款日起算，一整年。
        </p>
        <div className="p-7 rounded-2xl border-2 border-[#5B3A9E] bg-white">
          <p className="text-sm text-[#6E6885] mb-1">2027 年度導航＋全年陪跑</p>
          <p className="text-3xl font-bold tabular-nums mb-1">NT$1,280</p>
          <p className="text-sm font-semibold text-[#A8883F] mb-5">比只買報告多 300 元，一天不到一元，多了一整年的每日提醒。</p>
          <Link to="/nas/2027" className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition">
            看 2027 年度導航<ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* 與課程的關係 */}
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">看得懂天氣，跟知道該怎麼穿，是兩件事</h2>
        <p className="text-[#55506B] leading-loose mb-4">
          365 能量氣象台會告訴你明天是什麼天氣。但那代表什麼、你該怎麼調，
          那是另一件事，而且不是一段提醒講得完的。
        </p>
        <p className="text-[#55506B] leading-loose mb-8">
          如果你用了一陣子，開始覺得<strong>「我看得懂提醒了，但我不知道該怎麼用」</strong>，
          那就是課程要接手的地方。不急，先用著。
        </p>
        <Link to="/nas/course" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-[#5B3A9E] text-[#1F1A2E] hover:bg-[#5B3A9E] hover:text-white transition">
          看課程<ArrowRight size={16} />
        </Link>
      </div>
    </section>
  </main>
  );
};

export default NASDashboard;
