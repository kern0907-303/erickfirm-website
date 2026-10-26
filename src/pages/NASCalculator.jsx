import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import HeroTextReveal from '../components/HeroTextReveal';
import NASMark from '../components/NASMark';
import {
  calculateBirthNumbers,
  calculateFlows,
  calculateLunarFlows,
  getFlowMonthWindow,
} from '../lib/numerology';
import { relationForPaths } from '../lib/numerology/dailyGuidance';
import { lifeStages } from '../lib/numerology/stages';
import {
  OUTER, INNER, SAME_MAIN, GAP_CLOSING, LEVEL_INTRO, LEVEL_OUTER, LEVEL_INNER, LEVEL_GAP, STAGES, FLOW_YEAR, FLOW_MONTH,
} from '../content/nasCalculatorReading';
import {
  DAILY_RELATION_COPY,
  MAIN_NUMBER_PROFILES,
  NAS_LIFE_NUMBER_COPY as FLOW_COPY,
} from '../content/nasLifeNumberCopy';

const API_URL = '/api/ai_reading';

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

// 後天數與中間層用金色，最後收斂的數字用紫色，一看就分得出來。
const Chain = ({ chain }) => (
  <>
    {chain.slice(0, -1).map((n, i) => (
      <span key={`${n}-${i}`} className="text-[#C9921E]">{n}<span className="text-[#C4BDD6]">／</span></span>
    ))}
    <span className="text-[#5B3A9E]">{chain[chain.length - 1]}</span>
  </>
);

const flowChain = (path) => String(path || '').replace(/^[+-]/, '').split('/').filter(Boolean);

const FlowNum = ({ label, chain }) => (
  <span>
    <span className="block text-xs text-[#918BA6] mb-0.5">{label}</span>
    <strong className="text-2xl font-bold tabular-nums"><Chain chain={chain} /></strong>
  </span>
);

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
  const [birthTime, setBirthTime] = useState('');
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
      const nextFlowMonth = calculateFlows(solarBirth, monthWindow.nextChange).flowMonth;
      // 記住生日，之後到 365 能量氣象台那頁就不用再輸入一次。
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

  // 兩軌的落差：這一塊是免費計算器真正要交付的東西，要讓她看懂對自己的影響。
  const reading = React.useMemo(() => {
    if (!p) return null;
    const sm = mainOf(p.solarMain);
    const lm = mainOf(p.lunarMain);
    if (!sm || !lm) return null;
    const ss = soulOf(p.solarSoul);
    const ls = soulOf(p.lunarSoul);
    const so = OUTER[sm.main];
    const li = INNER[lm.main];
    const outer = {
      label: '陽曆 · 對外的你', hint: '做事、工作、和外界打交道時的樣子', icon: <Sun size={15} />,
      m: sm, s: ss, copy: so, extra: [so.strength, so.stuck], levelText: ss ? LEVEL_OUTER[ss.n] : '',
    };
    const inner = {
      label: '陰曆 · 心裡的你', hint: '感受、想法、情緒，你心裡真正在要的', icon: <Moon size={15} />,
      m: lm, s: ls, copy: li, extra: [li.hurt], levelText: ls ? LEVEL_INNER[ls.n] : '',
    };
    const mainLines = sm.main === lm.main
      ? [`對外和心裡的主命數都是 ${sm.main}。${SAME_MAIN}`]
      : [
        `對外的你是 ${sm.main}（${so.name}），心裡的你是 ${lm.main}（${li.name}）。`,
        `外面的你想${so.want}，心裡的你需要${li.need}。兩邊要的不一樣，所以你常常${so.act}，心裡卻${li.react}。`,
      ];
    const levelLines = [];
    if (ss && ls) {
      levelLines.push(`${LEVEL_INTRO}`);
      levelLines.push(`你對外是 ${ss.n} 級（${ss.stage}），心裡是 ${ls.n} 級（${ls.stage}）。`
        + (ss.n > ls.n ? LEVEL_GAP.outerHigher : ss.n < ls.n ? LEVEL_GAP.innerHigher : LEVEL_GAP.same));
    }
    return { outer, inner, mainLines, levelLines };
  }, [p]);

  const stages = React.useMemo(() => {
    if (!flowResult || !birthTime) return null;
    const solar = lifeStages(flowResult.numbers.solarBirth, birthTime);
    if (!solar) return null;
    return { solar, lunar: flowResult.numbers.lunarBirth ? lifeStages(flowResult.numbers.lunarBirth, birthTime) : null };
  }, [flowResult, birthTime]);

  return (
    <main className="bg-white text-[#1F1A2E]">
      <SEOHead
        title="生命數字計算｜輸入生日，看懂你的陽曆與陰曆雙軌結構"
        description="免費生命數字計算。輸入西元生日，算出主命數與陽曆、陰曆雙軌結構。不只給你一個數字，還告訴你為什麼同樣的數字會長成完全不同的人。艾瑞克，二十年生命數字教學。"
      />

      {/* 輸入 */}
      <section className="pt-32 pb-14 px-6">
        <div className="max-w-2xl mx-auto">
          <NASMark label="生命數字計算" />
          <p className="text-sm font-semibold text-[#A8883F] mb-3">{FLOW_COPY.hook}</p>
          <HeroTextReveal
            title="輸入生日，看你的雙軌結構"
            subtitle="免費計算，不需註冊或提交 Email。生日會送往計算服務，並保存在這台瀏覽器，換到 365 能量氣象台頁面看今天時不用再輸入。陽曆看你對外的展現，陰曆看你內在真正的需求，多數人的卡點，就落在這兩者不一致的地方。"
            titleClassName="text-2xl md:text-4xl font-bold leading-snug mb-5"
            subtitleClassName="text-[#55506B] leading-loose mb-9"
          />
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
            <p className="-mt-2 text-sm leading-relaxed text-[#A8883F]">
              {FLOW_COPY.completenessHint}
            </p>

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

      {/* 結果：先讓她看懂這組數字對自己的影響，計算方式不在這裡講。 */}
      {state === 'done' && p && reading && (
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="pb-14 px-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3E0] px-3 py-1 font-semibold text-[#9A6B12]">
                <span className="h-2 w-2 rounded-full bg-[#C9921E]" />後天數：生日數字相加的總數
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1EAFB] px-3 py-1 font-semibold text-[#5B3A9E]">
                <span className="h-2 w-2 rounded-full bg-[#5B3A9E]" />主命數：再收成個位數
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[reading.outer, reading.inner].map((t) => (
                <div key={t.label} className="card-flat p-6 bg-[#F8F6FC]">
                  <div className="flex items-center gap-2 text-[#6E6885] text-xs mb-1">
                    {t.icon} {t.label}
                  </div>
                  <p className="text-xs text-[#918BA6] mb-4">{t.hint}</p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold text-[#9A6B12]">後天數</span>
                    <span className="text-[#918BA6]"> ／ </span>
                    <span className="font-semibold text-[#5B3A9E]">主命數</span>
                  </p>
                  <p className="text-4xl font-bold tabular-nums leading-none mb-2">
                    <Chain chain={t.m.chain} />
                  </p>
                  <p className="text-xs text-[#6E6885] mb-5">
                    生日數字相加是 <strong className="text-[#9A6B12]">{t.m.total}</strong>，再收到個位數是 <strong className="text-[#5B3A9E]">{t.m.main}</strong>
                  </p>
                  <p className="font-bold text-[#1F1A2E] mb-2">{t.m.main}｜{t.copy.name}</p>
                  <p className="text-sm leading-relaxed text-[#463F5C] mb-2">{t.copy.daily}</p>
                  {t.extra.map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-[#55506B] mb-2">{line}</p>
                  ))}
                  {t.s && (
                    <div className="mt-4 border-t border-[#E7E3F0] pt-4">
                      <p className="text-sm text-[#6E6885] mb-1">生命功課等級</p>
                      <p className="text-lg font-semibold mb-1"><span className="tabular-nums">{t.s.n}</span> 級 · {t.s.stage}</p>
                      <p className="text-sm leading-relaxed text-[#55506B]">{t.levelText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8 rounded-2xl border-l-4 border-[#D4B86A] bg-[#FBF7EE]/70">
              <h3 className="text-xl font-bold mb-4 text-[#1F1A2E]">你的兩軌，差在哪裡</h3>
              {reading.mainLines.map((line) => (
                <p key={line} className="text-[#463F5C] leading-loose mb-3">{line}</p>
              ))}
              {reading.levelLines.length > 0 && (
                <div className="mt-5 pt-5 border-t border-[#EADFC4]">
                  {reading.levelLines.map((line) => (
                    <p key={line} className="text-[#463F5C] leading-loose mb-3">{line}</p>
                  ))}
                </div>
              )}
              <p className="mt-2 font-semibold text-[#1F1A2E] leading-loose">{GAP_CLOSING}</p>
            </div>

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
          <section className="px-6 pb-16" aria-label="計算完整度與人生五個階段">
            <div className="mx-auto max-w-3xl rounded-3xl border border-[#E7E3F0] p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <p className="text-sm font-semibold text-[#A8883F]">你現在看到的完整度</p>
                  <p className="mt-2 text-4xl font-bold text-[#5B3A9E]">{completenessLabel}</p>
                  <p className="mt-3 text-sm leading-loose text-[#6E6885]">{FLOW_COPY.completenessHint}</p>
                </div>
                <label className="text-sm font-medium">
                  出生時分（選填）
                  <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="mt-2 block w-full rounded-xl border border-[#DAD4E8] px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                  <span className="mt-2 block font-normal leading-relaxed text-[#918BA6]">填入出生時分，下面就會出現你人生五個階段各自的數字。</span>
                </label>
              </div>
              {stages ? (
                <div className="mt-8 border-t border-[#E7E3F0] pt-6">
                  <h2 className="text-xl font-bold mb-2">你人生的五個階段</h2>
                  <p className="text-sm leading-loose text-[#6E6885] mb-5">
                    人生像一棟五層樓：幼年與青少年是地基，青年是你的主命數，中年與老年是往上蓋的樓層。每一層都有自己的數字，也就是那一段人生最常面對的主題。
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-[#E7E3F0]">
                    <div className="grid grid-cols-[84px_1fr_1fr] bg-[#F7F5FC] text-xs text-[#6E6885]">
                      <div className="px-4 py-3">階段</div>
                      <div className="px-4 py-3">陽曆｜對外</div>
                      <div className="px-4 py-3">陰曆｜心裡</div>
                    </div>
                    {STAGES.map((stage, index) => (
                      <div key={stage.key} className={`grid grid-cols-[84px_1fr_1fr] text-sm ${index % 2 ? 'bg-white' : 'bg-[#F7F5FC]/40'}`}>
                        <div className="px-4 py-4">
                          <p className="font-bold text-[#1F1A2E]">{stage.name}</p>
                          <p className="mt-1 text-xs leading-relaxed text-[#918BA6]">{stage.note}</p>
                        </div>
                        <div className="px-4 py-4">
                          <p className="text-xl font-bold tabular-nums"><Chain chain={stages.solar[stage.key]} /></p>
                          <p className="mt-1 text-xs leading-relaxed text-[#55506B]">{OUTER[stages.solar[stage.key].at(-1)]?.name}</p>
                        </div>
                        <div className="px-4 py-4">
                          {stages.lunar ? (
                            <>
                              <p className="text-xl font-bold tabular-nums"><Chain chain={stages.lunar[stage.key]} /></p>
                              <p className="mt-1 text-xs leading-relaxed text-[#55506B]">{INNER[stages.lunar[stage.key].at(-1)]?.name}</p>
                            </>
                          ) : <p className="text-[#918BA6]">無</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-[#918BA6]">五層之間怎麼互相影響、哪一層正在主導你，是主課裡會一層一層帶你讀的內容。</p>
                </div>
              ) : (
                <p className="mt-6 border-t border-[#E7E3F0] pt-5 text-sm leading-loose text-[#6E6885]">
                  不知道出生時分也沒關係，上面的雙軌已經是最主要的部分。知道的話填進去，可以再多看到人生五個階段的數字。
                </p>
              )}
            </div>
          </section>

          <section className="px-6 pb-16" id="current-flow-month">
            <div className="mx-auto max-w-3xl rounded-3xl border border-[#E7E3F0] bg-[#F7F5FC]/50 p-6 md:p-8">
              <p className="text-sm font-semibold text-[#A8883F]">你現在走到哪裡｜{flowResult.target}</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">主命數是氣候，流年、流月、流日是天氣</h2>
              <p className="mt-3 text-sm leading-loose text-[#6E6885]">氣候是你的底，一輩子不變；天氣是你的生日遇上今年、這個月、今天，每一段都不一樣。</p>

              <div className="mt-6 space-y-5">
                <article className="rounded-2xl bg-white p-5 md:p-6">
                  <p className="text-xs font-semibold text-[#A8883F]">今年｜流年</p>
                  <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                    <FlowNum label="陽曆" chain={flowChain(flowResult.solarFlows.flowYear.path)} />
                    {flowResult.lunarFlows && <FlowNum label="陰曆" chain={flowChain(flowResult.lunarFlows.flowYear.path)} />}
                  </div>
                  <p className="mt-3 font-bold text-[#1F1A2E]">今年的關鍵字：{FLOW_YEAR[flowResult.solarFlows.flowYear.num].kw}</p>
                  <p className="mt-2 text-sm leading-loose text-[#55506B]">{FLOW_YEAR[flowResult.solarFlows.flowYear.num].outer}</p>
                  {flowResult.lunarFlows && (
                    <p className="mt-2 text-sm leading-loose text-[#55506B]">{FLOW_YEAR[flowResult.lunarFlows.flowYear.num].inner}</p>
                  )}
                </article>

                <article className="rounded-2xl bg-white p-5 md:p-6">
                  <p className="text-xs font-semibold text-[#A8883F]">這個月｜流月</p>
                  <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
                    <FlowNum label="陽曆" chain={flowChain(flowResult.solarFlows.flowMonth.path)} />
                    {flowResult.lunarFlows && <FlowNum label="陰曆" chain={flowChain(flowResult.lunarFlows.flowMonth.path)} />}
                  </div>
                  <p className="mt-3 font-bold text-[#1F1A2E]">這個月的主題：{FLOW_MONTH[flowResult.solarFlows.flowMonth.num].label}</p>
                  <p className="mt-2 text-sm leading-loose text-[#55506B]">做事上，這個月適合：{FLOW_MONTH[flowResult.solarFlows.flowMonth.num].outer}</p>
                  {flowResult.lunarFlows && (
                    <p className="mt-1 text-sm leading-loose text-[#55506B]">心裡，這個月適合：{FLOW_MONTH[flowResult.lunarFlows.flowMonth.num].inner}</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-[#6E6885]">
                    陽曆這一段從 {dateLabel(flowResult.monthWindow.start)} 到 {dateLabel(flowResult.monthWindow.end)}。{dateLabel(flowResult.monthWindow.nextChange)} 起換成 <span className="font-semibold tabular-nums"><Chain chain={flowChain(flowResult.nextFlowMonth.path)} /></span>，主題是「{FLOW_MONTH[flowResult.nextFlowMonth.num].label}」。
                  </p>
                </article>

                <article className="rounded-2xl bg-white p-5 md:p-6" aria-labelledby="today-reminder-title">
                  <p className="text-xs font-semibold text-[#A8883F]">今天｜流日</p>
                  <h3 id="today-reminder-title" className="sr-only">今天的流日</h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-[#F7F5FC] p-4">
                      <FlowNum label="陽曆｜對外" chain={flowChain(flowResult.solarFlows.flowDay.path)} />
                      <p className="mt-2 text-sm font-semibold text-[#1F1A2E]">今天做事的主題：{MAIN_NUMBER_PROFILES[flowResult.solarFlows.flowDay.num]?.theme}</p>
                      {dailySolarRelation && <p className="mt-1 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailySolarRelation]}</p>}
                    </div>
                    {flowResult.lunarFlows && (
                      <div className="rounded-xl bg-[#FBF7EE] p-4">
                        <FlowNum label="陰曆｜心裡" chain={flowChain(flowResult.lunarFlows.flowDay.path)} />
                        <p className="mt-2 text-sm font-semibold text-[#1F1A2E]">今天心裡的主題：{MAIN_NUMBER_PROFILES[flowResult.lunarFlows.flowDay.num]?.theme}</p>
                        {dailyLunarRelation && <p className="mt-1 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailyLunarRelation]}</p>}
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#918BA6]">今天的提醒，是你的主命數和今天的流日放在一起看出來的。</p>
                </article>
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
              你剛才拿到的是一組數字。網路上查得到它的標準描述，但如果你看了覺得
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
                to="/nas/365"
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
            它描述的是你這一生最主要會反覆遇到的功課，注意，是<strong>題目</strong>，不是答案。
          </p>
          <p className="text-[#55506B] leading-loose mb-4">
            多數計算器算到這裡就停了。這裡多算兩件事：
          </p>
          <ul className="text-[#55506B] leading-loose space-y-2 mb-6 list-disc pl-5">
            <li><strong>陰曆盤</strong>：陽曆描述你對外的展現與思考方式，陰曆描述你內在的感受與真正的需求。兩邊不一致的地方，通常就是卡住的地方。</li>
            <li><strong>生命功課等級</strong>：依先天數、後天數與主命數的有無判定，描述的是你目前在處理哪個階段的功課。</li>
            <li><strong>流年、流月與今日流日</strong>：依陽曆生日逐日計算當前週期；加入陰曆盤時，也會顯示陰曆流日。</li>
          </ul>

          <h3 className="font-bold mb-3 mt-10">生命功課等級的七個階段</h3>
          <p className="text-[#55506B] leading-loose mb-5">
            用求學階段來比喻最好懂。
            <strong className="text-[#1F1A2E]">級數不是分數，七級不比一級好</strong>，
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
            算出來的數字不會決定你是誰。它只告訴你要處理什麼題目，怎麼答，還是你自己的事。
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
            <Link to="/nas/2027" className="rounded-2xl border border-[#E7E3F0] p-5 transition hover:border-[#5B3A9E]">
              <h3 className="font-bold">2027 年度導航</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{FLOW_COPY.annualReport}</p>
            </Link>
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
