import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const API_URL = '/.netlify/functions/ai_reading';

// '+22/4' → '22／4'（整條顯示，不丟掉後天數與 11／22 主數）
const chainOf = (raw) => {
  const c = String(raw || '').replace(/^[+-]/, '').split('/').filter(Boolean);
  return (!c.length || c.some((x) => x.includes('?'))) ? null : c.join('／');
};

// 19750909 → 1975/09/09（只用於顯示，送去計算的仍是原字串）
const prettyDate = (raw) => {
  const d = String(raw || '').replace(/\D/g, '');
  return d.length === 8 ? `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6)}` : raw;
};

const FEATURES = [
  { name: '主命數、先天數、後天數', free: true, paid: true },
  { name: '陽曆／陰曆雙盤對照', free: true, paid: true },
  { name: '強數與缺數', free: true, paid: true },
  { name: '靈魂等級', free: false, paid: true },
  { name: '流年 · 流月 · 流日', free: false, paid: true },
  { name: '加入家人、伴侶、同事的盤', free: false, paid: true },
  { name: '關係對照與互動判讀', free: false, paid: true },
  { name: '歷史紀錄與回顧', free: false, paid: true },
  { name: '每月狀態提醒', free: false, paid: true },
  { name: '每天早上 LINE 推播今天的流日', free: false, paid: true },
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
      title="數字每曆｜每天更新一次的生命數字"
      description="主命數是氣候，是你的底層設定；流年、流月、流日是天氣，每天都不一樣。數字每曆每天替你更新一次，打開看一眼就知道今天該注意什麼。免費算，訂閱看完整版。"
    />

    <section className="pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <NASMark label="數字每曆" />
        <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
          你查一下天氣才出門。<br />
          <span className="text-[#6E6885]">你的數字也是。</span>
        </h1>
        <p className="text-sm font-semibold tracking-wide text-[#A8883F] mb-8">
          每天一曆，每天美麗。
        </p>
        <p className="text-[#55506B] leading-loose mb-5 max-w-2xl">
          主命數是<strong>氣候</strong>——你的底層設定。
          數字本身不會換，但它在你身上跑成什麼樣子，是會變的——那正是可以動的地方。
          流年、流月、流日是<strong>天氣</strong>——今天會不會下雨，每天都不一樣。
        </p>
        <p className="text-[#55506B] leading-loose mb-5 max-w-2xl">
          多數人只知道自己的氣候，然後穿同一套衣服過每一天：該往前的時候收手，
          該休息的時候硬撐。那個落差，就是很多人「明明很努力卻一直不對」的原因。
        </p>
        <p className="text-[#55506B] leading-loose mb-10 max-w-2xl">
          數字每曆每天替你更新一次。<strong>不用自己記、不用自己算，打開看一眼就好。</strong>
        </p>
        {/* 直接把今天算給她看。只給今天——明天想看就得再回來輸入一次，
            那個不方便本身就是訂閱的理由，不需要用文案說服。 */}
        <div className="p-6 rounded-2xl border border-[#E7E3F0] bg-[#F7F5FC]/50">
          <h2 className="font-bold mb-2">先看今天的流日數字</h2>

          {useSaved ? (
            <>
              <p className="text-sm text-[#6E6885] mb-5">
                用你剛才算過的生日
                <strong className="text-[#1F1A2E] tabular-nums mx-2">{prettyDate(saved)}</strong>
                ——直接看今天。
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
                天氣沒有好壞——下雨不是壞日子，只是今天適合做的事不一樣。
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mb-6">
                {today.solarDay && (
                  <span className="text-[#6E6885]">
                    今天流日　陽曆<strong className="text-[#1F1A2E] tabular-nums ml-2">{today.solarDay}</strong>
                  </span>
                )}
                {today.lunarDay && (
                  <span className="text-[#6E6885]">
                    陰曆<strong className="text-[#1F1A2E] tabular-nums ml-2">{today.lunarDay}</strong>
                  </span>
                )}
              </div>
              <div className="p-5 rounded-xl border-l-2 border-[#D4B86A] bg-[#FBF7EE]/70">
                <p className="text-[#55506B] leading-loose mb-2">
                  <strong className="text-[#1F1A2E]">這是今天。明天這個數字會變。</strong>
                </p>
                <p className="text-[#55506B] leading-loose">
                  你可以每天回來這裡按一次——也可以訂閱，
                  <strong className="text-[#1F1A2E]">每天早上 LINE 直接推給你</strong>，
                  連打開網站都不用。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* 功能對照 */}
    <section className="pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-[#E7E3F0] overflow-hidden">
          <div className="grid grid-cols-[1fr_88px_88px] bg-[#F7F5FC] text-xs text-[#6E6885]">
            <div className="px-5 py-3">每曆內容</div>
            <div className="px-3 py-3 text-center">免費</div>
            <div className="px-3 py-3 text-center font-medium text-[#1F1A2E]">訂閱</div>
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

    {/* 定價 */}
    <section className="py-16 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        <div className="p-7 rounded-2xl border border-[#E7E3F0] bg-white">
          <p className="text-sm text-[#6E6885] mb-1">月訂閱</p>
          <p className="text-3xl font-bold tabular-nums mb-1">NT$299</p>
          <p className="text-sm font-semibold text-[#A8883F] mb-1">一天不到 10 元</p>
          <p className="text-sm text-[#6E6885] mb-6">每月 · 隨時可停</p>
          <p className="text-sm text-[#55506B] leading-relaxed">先試試看適不適合你。</p>
        </div>
        <div className="p-7 rounded-2xl border-2 border-[#5B3A9E] bg-white relative">
          <span className="absolute -top-3 left-7 text-xs px-3 py-1 rounded-full bg-[#5B3A9E] text-white">省兩個月</span>
          <p className="text-sm text-[#6E6885] mb-1">年訂閱</p>
          <p className="text-3xl font-bold tabular-nums mb-1">NT$2,880</p>
          <p className="text-sm font-semibold text-[#A8883F] mb-1">一天不到 8 元</p>
          <p className="text-sm text-[#6E6885] mb-6">每年 · 等於每月 240</p>
          <p className="text-sm text-[#55506B] leading-relaxed">
            天氣要看過一整年，才知道自己的四季長什麼樣子。
          </p>
        </div>
      </div>
    </section>

    {/* 最黏的功能單獨講 */}
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-5">把身邊的人也放進來</h2>
        <p className="text-[#55506B] leading-loose mb-4">
          訂閱之後可以加入家人、伴侶、同事的盤。
        </p>
        <p className="text-[#55506B] leading-loose mb-4">
          很多人是為了自己來的，最後停留最久的卻是<strong>關係</strong>那一頁——
          因為「我為什麼跟他處不來」這個問題，比「我是誰」更急。
        </p>
        <p className="text-[#55506B] leading-loose">
          兩個人的數字放在一起，你會看到一些平常感覺得到、但講不出來的東西。
        </p>
      </div>
    </section>

    {/* 與課程的關係 */}
    <section className="py-16 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">看得懂天氣，跟知道該怎麼穿，是兩件事</h2>
        <p className="text-[#55506B] leading-loose mb-4">
          數字每曆會告訴你「今天的流年是 3」。但那代表什麼、你該怎麼調，
          那是另一件事——而且不是一段說明文字講得完的。
        </p>
        <p className="text-[#55506B] leading-loose mb-8">
          如果你用了一陣子，開始覺得<strong>「我看得懂數字了，但我不知道該怎麼用」</strong>，
          那就是課程要接手的地方。不急，工具先用著。
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
