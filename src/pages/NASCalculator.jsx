import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import {
  calculateBirthNumbers,
  calculateFlows,
  calculateLunarFlows,
  getFlowMonthWindow,
} from '../lib/numerology';
import { relationForPaths } from '../lib/numerology/dailyGuidance';
import {
  DAILY_RELATION_COPY,
  FOCUS_OPTIONS,
  MAIN_NUMBER_PROFILES,
  NAS_LIFE_NUMBER_COPY as FLOW_COPY,
} from '../content/nasLifeNumberCopy';

const API_URL = '/api/ai_reading';
const MONTHLY_LETTER_API_URL = import.meta.env.VITE_NAS_MONTHLY_LETTER_WEBHOOK_URL;

function taipeiDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dateLabel(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  return match ? `${Number(match[2])}/${Number(match[3])}` : value;
}

function lunarBirthValue(value) {
  if (!value) return '';
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

/**
 * 生命功課等級——依先天數、後天數、主命數的有無判定，共七級。
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
  url: 'https://erickfirm.com/nas/calculator/',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
  provider: { '@type': 'Person', name: '艾瑞克', '@id': 'https://erickfirm.com/#erick' },
  description: '輸入西元生日，計算陽曆與陰曆雙軌主命數、生命功課等級、流年、流月與今日流日。',
};

const NASCalculator = () => {
  const [birthdate, setBirthdate] = useState('');
  const [lunarOverride, setLunarOverride] = useState('');
  const [name, setName] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState('idle');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [flowResult, setFlowResult] = useState(null);
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
    setSubscribeStatus('idle');
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
      const solarBirth = birthdate.trim();
      const lunarBirth = lunarOverride.trim();
      const target = taipeiDate();
      const numbers = calculateBirthNumbers(solarBirth, lunarBirth);
      const solarFlows = calculateFlows(solarBirth, target);
      const lunarFlows = numbers.lunarBirth
        ? calculateLunarFlows(numbers.lunarBirth, target)
        : null;
      const monthWindow = getFlowMonthWindow(solarBirth, target);
      const nextFlowMonth = calculateFlows(solarBirth, monthWindow.nextChange).flowMonth.num;
      // 記住生日，之後到數字每曆那頁就不用再輸入一次。
      // 只存生日字串，不存計算結果或月信聯絡資料；無痕模式會丟例外，忽略即可。
      try {
        localStorage.setItem('nas.birthdate', solarBirth);
        if (lunarBirth) localStorage.setItem('nas.lunar', lunarBirth);
        else localStorage.removeItem('nas.lunar');
      } catch { /* 存不了就算了，不影響計算 */ }
      setResult({
        ...json,
        parsed: {
          ...json.parsed,
          solarMain: numbers.solarMain.path,
          lunarMain: numbers.lunarMain?.path || '',
        },
      });
      setFlowResult({ target, numbers, solarFlows, lunarFlows, monthWindow, nextFlowMonth });
      setState('done');
    } catch (err) {
      setErrMsg(err.message || '出了點狀況，稍後再試一次');
      setState('error');
    }
  };

  const subscribe = async (e) => {
    e.preventDefault();
    if (e.currentTarget.elements.website.value) {
      setSubscribeStatus('error');
      return;
    }
    if (!MONTHLY_LETTER_API_URL) {
      setSubscribeStatus('unconfigured');
      return;
    }

    setSubscribeStatus('submitting');
    const params = new URLSearchParams(window.location.search);
    const payload = {
      form: 'nas_monthly_letter',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      solar_birth: birthdate.trim(),
      lunar_birth: lunarBirthValue(flowResult?.numbers.lunarBirth),
      birth_time: birthTime || '',
      focus,
      source: params.get('source') || params.get('utm_source') || window.location.pathname,
      source_path: window.location.pathname,
      consent_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(MONTHLY_LETTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Webhook request failed: ${response.status}`);
      setSubscribeStatus('success');
    } catch {
      setSubscribeStatus('error');
    }
  };

  const completeness = flowResult
    ? (birthTime ? 100 : flowResult.numbers.lunarBirth ? 85 : 60)
    : 60;
  const completenessLabel = completeness === 100
    ? '十成'
    : completeness === 85 ? '約八成五' : '約六成';

  const dailySolarRelation = flowResult
    ? relationForPaths(flowResult.numbers.solarMain.path, flowResult.solarFlows.flowDay.path)
    : null;
  const dailyLunarRelation = flowResult?.lunarFlows
    ? relationForPaths(flowResult.numbers.lunarMain.path, flowResult.lunarFlows.flowDay.path)
    : null;

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
        ? `生命功課等級兩邊都是 ${ss.n} 級，都在${ss.stage}這個階段的功課上。`
        : `生命功課等級也不同：對外像個${ss.stage}，內在還是個${ls.stage}。`;
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
        description="免費生命數字計算，呈現陽曆與陰曆雙軌結構、生命功課等級，以及依生日計算的流年、流月與今日流日。艾瑞克，二十年生命數字教學。"
      />

      {/* 輸入 */}
      <section className="pt-32 pb-14 px-6">
        <div className="max-w-2xl mx-auto">
          <NASMark label="生命數字計算" />
          <p className="text-sm font-semibold text-[#A8883F] mb-3">{FLOW_COPY.hook}</p>
          <h1 className="text-2xl md:text-4xl font-bold leading-snug mb-5">
            輸入生日，看你的雙軌結構
          </h1>
          <p className="text-[#55506B] leading-loose mb-9">
            免費計算，不需註冊或提交 Email。生日會送往計算服務，並保存在這台瀏覽器，供數字每曆讀取；想收每月流月信，再自行填寫訂閱資料。
            陽曆看你對外的展現，陰曆看你內在真正的需求——多數人的卡點，就落在這兩者不一致的地方。
          </p>
          <p className="text-sm text-[#6E6885] leading-loose mb-8">{FLOW_COPY.heroSupport}</p>

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
                <div key={t.label} className="card-flat p-6 bg-[#F8F6FC]">
                  <div className="flex items-center gap-2 text-[#918BA6] text-xs mb-1">
                    {t.icon} {t.label}
                  </div>
                  <p className="text-xs text-[#918BA6] mb-5">{t.hint}</p>

                  <p className="text-sm text-[#6E6885] mb-1">後天數 ／ 主命數</p>
                  {/* 整條都顯示：後天數、以及 11／22 這類主數的中間層都不省略，
                      化簡後的主命數用深色收尾，視覺上仍是主角。 */}
                  <p className="text-3xl md:text-4xl font-bold tabular-nums leading-none mb-2">
                    {t.m ? (
                      <>
                        {t.m.chain.slice(0, -1).map((n) => (
                          <span key={n} className="text-[#918BA6]">{n}／</span>
                        ))}
                        <span>{t.m.main}</span>
                      </>
                    ) : '—'}
                  </p>
                  {t.m && (
                    <p className="text-xs text-[#918BA6] mb-6">
                      生日數字相加是 {t.m.total}，再收到個位數就是 {t.m.main}
                    </p>
                  )}

                  <p className="text-sm text-[#6E6885] mb-1">生命功課等級</p>
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

                  {t.m && MAIN_NUMBER_PROFILES[t.m.main] && (
                    <dl className="mt-5 space-y-2 border-t border-[#E7E3F0] pt-4 text-sm leading-relaxed text-[#55506B]">
                      <div><dt className="inline font-semibold text-[#1F1A2E]">主題：</dt><dd className="inline">{MAIN_NUMBER_PROFILES[t.m.main].theme}</dd></div>
                      <div><dt className="inline font-semibold text-[#1F1A2E]">可運用：</dt><dd className="inline">{MAIN_NUMBER_PROFILES[t.m.main].strength}</dd></div>
                      <div><dt className="inline font-semibold text-[#1F1A2E]">可觀察：</dt><dd className="inline">{MAIN_NUMBER_PROFILES[t.m.main].watch}</dd></div>
                    </dl>
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

      {state === 'done' && flowResult && (
        <>
          <section className="px-6 pb-16" aria-label="計算完整度">
            <div className="mx-auto grid max-w-4xl gap-8 rounded-3xl border border-[#E7E3F0] p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
              <div>
                <p className="text-sm font-semibold text-[#A8883F]">你現在看到的完整度</p>
                <p className="mt-2 text-4xl font-bold text-[#5B3A9E]">{completenessLabel}</p>
                <p className="mt-3 text-sm leading-loose text-[#6E6885]">陽曆約六成；加入陰曆約八成五；再加出生時分為十成。</p>
              </div>
              <label className="text-sm font-medium">
                出生時分（選填）
                <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="mt-2 block w-full rounded-xl border border-[#DAD4E8] px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                <span className="mt-2 block font-normal leading-relaxed text-[#918BA6]">出生時間只用於完整度提示，不改變此頁顯示的主命數與流年、流月、流日。</span>
              </label>
            </div>
          </section>

          <section className="px-6 pb-16" id="current-flow-month">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#E7E3F0] bg-[#F7F5FC]/50 p-6 md:p-8">
              <p className="text-sm font-semibold text-[#A8883F]">本次個人流月</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">你現在走在流月 {flowResult.solarFlows.flowMonth.num}</h2>
              <p className="mt-3 text-[#55506B]">這個階段到 {dateLabel(flowResult.monthWindow.end)}，{dateLabel(flowResult.monthWindow.nextChange)} 進入流月 {flowResult.nextFlowMonth}。</p>
              <p className="mt-5 text-sm leading-loose text-[#6E6885]">流月逐日套用「當日 &gt;= 生日日取本月，否則取上個月」的公式，再依結果變化推導換期。生日 31 號時，1/31–2/28 取一月、3/1–3/30 取二月、3/31–4/30 取三月、5/1–5/30 取四月。</p>
              <p className="mt-3 text-sm leading-relaxed text-[#6E6885]">你現在走在流年 {flowResult.solarFlows.flowYear.num}。</p>

              <div className="mt-6 border-t border-[#E7E3F0] pt-6" id="monthly-signup">
                <h3 className="text-xl font-bold">訂閱每月流月信</h3>
                <p className="mt-2 text-sm leading-loose text-[#55506B]">留 Email 後立刻寄出當前這一封；之後在每個人自己的流月換日前一天寄。</p>
                <p className="mt-2 text-xs leading-relaxed text-[#918BA6]">每封信涵蓋即將開始的完整流月，並提供退訂方式。</p>
                {!MONTHLY_LETTER_API_URL && <p className="mt-4 rounded-xl bg-[#FBF7EE] p-4 text-sm text-[#6E6885]" role="status">月信訂閱服務尚未連接，這份表單不會送出資料。</p>}

                {subscribeStatus === 'success' ? (
                  <p className="mt-5 rounded-xl bg-white p-4 text-sm text-[#416147]" role="status">訂閱資料已送出。</p>
                ) : (
                  <form onSubmit={subscribe} className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium">
                      姓名
                      <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                    </label>
                    <label className="text-sm font-medium">
                      Email
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                    </label>
                    <label className="text-sm font-medium md:col-span-2">
                      你現在最想整理的是什麼？
                      <select required value={focus} onChange={(e) => setFocus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]">
                        <option value="">請選擇</option>
                        {FOCUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-[#55506B] md:col-span-2">
                      <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[#5B3A9E]" />
                      <span>我同意透過 Email 接收每月流月信，並了解每封信都可退訂。</span>
                    </label>
                    <label className="hidden" aria-hidden="true">
                      網站
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                    {subscribeStatus === 'unconfigured' && <p className="text-sm text-red-700 md:col-span-2" role="alert">月信訂閱服務目前尚未連接，資料沒有送出。</p>}
                    {subscribeStatus === 'error' && <p className="text-sm text-red-700 md:col-span-2" role="alert">送出時發生問題，請稍後再試。</p>}
                    <button type="submit" disabled={subscribeStatus === 'submitting' || !MONTHLY_LETTER_API_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D] disabled:opacity-50 md:col-span-2">
                      {subscribeStatus === 'submitting' ? '送出中…' : '訂閱每月流月信'}<ArrowRight size={17} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          <section className="px-6 pb-16" aria-labelledby="today-reminder-title">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#E7E3F0] p-6 md:p-8">
              <p className="text-sm font-semibold text-[#A8883F]">今日提醒｜{flowResult.target}</p>
              <h2 id="today-reminder-title" className="mt-2 text-2xl font-bold">今天的流日數字</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#F7F5FC] p-5">
                  <p className="text-xs text-[#918BA6]">陽曆流日</p>
                  <p className="mt-1 text-3xl font-bold">{flowResult.solarFlows.flowDay.num}</p>
                  {dailySolarRelation && <p className="mt-3 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailySolarRelation]}</p>}
                </div>
                {flowResult.lunarFlows && (
                  <div className="rounded-2xl bg-[#FBF7EE] p-5">
                    <p className="text-xs text-[#918BA6]">陰曆流日</p>
                    <p className="mt-1 text-3xl font-bold">{flowResult.lunarFlows.flowDay.num}</p>
                    {dailyLunarRelation && <p className="mt-3 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailyLunarRelation]}</p>}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
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
            <li><strong>生命功課等級</strong>——依先天數、後天數與主命數的有無判定，描述的是你目前在處理哪個階段的功課。</li>
            <li><strong>流年、流月與今日流日</strong>——依陽曆生日逐日計算當前週期；加入陰曆盤時，也會顯示陰曆流日。</li>
          </ul>

          <h3 className="font-bold mb-3 mt-10">生命功課等級的七個階段</h3>
          <p className="text-[#55506B] leading-loose mb-5">
            用求學階段來比喻最好懂。
            <strong className="text-[#1F1A2E]">級數不是分數，七級不比一級好</strong>——
            就像博士生不會比小學生「更厲害」，只是在學不一樣的東西。
          </p>
          <div className="card-flat bg-[#F8F6FC] overflow-hidden mb-6">
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

      <section className="px-6 py-16 border-t border-[#F0EDF7]">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <article>
            <h2 className="text-xl font-bold mb-5">為什麼看生命數字</h2>
            <p className="text-[#55506B] leading-loose mb-4">{FLOW_COPY.mainNumberDefinition}</p>
            <p className="text-[#55506B] leading-loose mb-4">{FLOW_COPY.stuck}</p>
            <p className="text-[#55506B] leading-loose">{FLOW_COPY.positioning}</p>
          </article>
          <article className="rounded-3xl bg-[#F7F5FC] p-6 md:p-8">
            <h2 className="text-xl font-bold mb-5">平衡空間與艾瑞克</h2>
            <p className="text-[#55506B] leading-loose">{FLOW_COPY.brand}</p>
          </article>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold mb-6">下一步</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#E7E3F0] p-5">
              <h3 className="font-bold">2027 流年報告</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{FLOW_COPY.annualReport}</p>
            </article>
            <Link to="/nas/course" className="rounded-2xl border border-[#E7E3F0] p-5 transition hover:border-[#5B3A9E]">
              <h3 className="font-bold">主課</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{FLOW_COPY.course}</p>
            </Link>
            <Link to="/nas/course" className="rounded-2xl border border-[#E7E3F0] p-5 transition hover:border-[#5B3A9E]">
              <h3 className="font-bold">一對一</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{FLOW_COPY.oneToOne}</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NASCalculator;
