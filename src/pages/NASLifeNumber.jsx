import React, { useMemo, useState } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
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
  NAS_LIFE_NUMBER_COPY as COPY,
} from '../content/nasLifeNumberCopy';

const API_URL = import.meta.env.VITE_NAS_MONTHLY_LETTER_WEBHOOK_URL;

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

function printablePath(path) {
  return String(path || '').replace(/^[+-]/, '');
}

function MainNumberCard({ label, icon: Icon, result }) {
  if (!result) return null;
  const profile = MAIN_NUMBER_PROFILES[result.number];
  return (
    <article className="rounded-2xl border border-[#E7E3F0] bg-white p-6 shadow-sm">
      <p className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6E6885]">
        <Icon size={17} aria-hidden="true" />{label}主命數
      </p>
      <div className="flex items-end gap-3">
        <strong className="text-6xl font-bold leading-none text-[#5B3A9E]">{result.number}</strong>
        <span className="pb-1 text-sm text-[#918BA6]">{printablePath(result.path)}</span>
      </div>
      {profile && (
        <dl className="mt-6 space-y-3 text-sm leading-relaxed text-[#55506B]">
          <div><dt className="inline font-semibold text-[#1F1A2E]">主題：</dt><dd className="inline">{profile.theme}</dd></div>
          <div><dt className="inline font-semibold text-[#1F1A2E]">可運用：</dt><dd className="inline">{profile.strength}</dd></div>
          <div><dt className="inline font-semibold text-[#1F1A2E]">可觀察：</dt><dd className="inline">{profile.watch}</dd></div>
        </dl>
      )}
    </article>
  );
}

export default function NASLifeNumber() {
  const [name, setName] = useState('');
  const [solarBirth, setSolarBirth] = useState('');
  const [lunarBirthInput, setLunarBirthInput] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState('idle');

  const runCalculation = (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    try {
      const target = taipeiDate();
      const numbers = calculateBirthNumbers(solarBirth, lunarBirthInput);
      const solarFlows = calculateFlows(solarBirth, target);
      const lunarFlows = numbers.lunarBirth
        ? calculateLunarFlows(numbers.lunarBirth, target)
        : null;
      const monthWindow = getFlowMonthWindow(solarBirth, target);
      const nextFlowMonth = calculateFlows(solarBirth, monthWindow.nextChange).flowMonth.num;
      setResult({ target, numbers, solarFlows, lunarFlows, monthWindow, nextFlowMonth });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '日期格式不正確，請重新檢查。');
    }
  };

  const completeness = result
    ? (birthTime ? 100 : result.numbers.lunarBirth ? 85 : 60)
    : 60;
  const completenessLabel = completeness === 100
    ? '十成'
    : completeness === 85 ? '約八成五' : '約六成';

  const differenceText = useMemo(() => {
    if (!result?.numbers.lunarMain) return '';
    const solar = result.numbers.solarMain.number;
    const lunar = result.numbers.lunarMain.number;
    if (solar === lunar) return '陽陰同數：一致，但做不了違心的事。';
    if (solar > lunar) return '陽高陰低：說得到做不到。';
    return '陰高陽低：做得到說不出口。';
  }, [result]);

  const dailySolarRelation = result
    ? relationForPaths(result.numbers.solarMain.path, result.solarFlows.flowDay.path)
    : null;
  const dailyLunarRelation = result?.lunarFlows
    ? relationForPaths(result.numbers.lunarMain.path, result.lunarFlows.flowDay.path)
    : null;

  const subscribe = async (event) => {
    event.preventDefault();
    if (event.currentTarget.elements.website.value) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('submitting');
    if (!API_URL) {
      setSubscribeStatus('unconfigured');
      return;
    }

    const payload = {
      form: 'nas_monthly_letter',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      solar_birth: solarBirth,
      lunar_birth: result?.numbers.lunarBirth
        ? `${result.numbers.lunarBirth.year}-${String(result.numbers.lunarBirth.month).padStart(2, '0')}-${String(result.numbers.lunarBirth.day).padStart(2, '0')}`
        : '',
      birth_time: birthTime || '',
      focus,
      source: new URLSearchParams(window.location.search).get('source')
        || new URLSearchParams(window.location.search).get('utm_source')
        || window.location.pathname,
      source_path: window.location.pathname,
      consent_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
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

  return (
    <main className="bg-white text-[#1F1A2E]">
      <SEOHead title={COPY.title} description={COPY.description} />

      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-4xl">
          <NASMark label="生命數字雙軌計算" />
          <div className="max-w-3xl">
            <h1 className="mb-5 text-3xl font-bold leading-snug md:text-5xl">{COPY.hook}</h1>
            <p className="mb-9 text-base leading-loose text-[#55506B] md:text-lg">{COPY.heroSupport}</p>
          </div>

          <form onSubmit={runCalculation} className="grid gap-4 rounded-3xl border border-[#E7E3F0] bg-[#F7F5FC]/60 p-5 md:grid-cols-2 md:p-8">
            <label className="text-sm font-medium md:col-span-2">
              姓名（選填）
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3.5 outline-none focus:border-[#5B3A9E]" />
            </label>
            <label className="text-sm font-medium">
              陽曆生日（必填）
              <input type="date" required value={solarBirth} onChange={(event) => setSolarBirth(event.target.value)} className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3.5 outline-none focus:border-[#5B3A9E]" />
            </label>
            <label className="text-sm font-medium">
              農曆生日（選填，留空自動換算）
              <input value={lunarBirthInput} onChange={(event) => setLunarBirthInput(event.target.value)} placeholder="例如 1985-02-01" inputMode="numeric" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3.5 outline-none focus:border-[#5B3A9E]" />
              <span className="mt-1 block text-xs font-normal text-[#918BA6]">格式：農曆年-月-日；閏月依輸入日期，不另加一張盤。</span>
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 md:col-span-2">
              <p className="text-sm text-[#6E6885]">先看陽曆主命數約六成；加入陰曆後約八成五。</p>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-7 py-3.5 font-medium text-white transition hover:bg-[#472D7D]">
                計算雙軌主命數<ArrowRight size={17} />
              </button>
            </div>
            {error && <p className="text-sm text-red-700 md:col-span-2" role="alert">{error}</p>}
          </form>
        </div>
      </section>

      {result && (
        <>
          <section className="px-6 pb-16" aria-live="polite">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-4 md:grid-cols-2">
                <MainNumberCard label="陽曆" icon={Sun} result={result.numbers.solarMain} />
                <MainNumberCard label="陰曆" icon={Moon} result={result.numbers.lunarMain} />
              </div>
              {!result.numbers.lunarMain && (
                <p className="mt-4 rounded-xl bg-[#FBF7EE] p-4 text-sm leading-relaxed text-[#6E6885]">目前農曆對照表不涵蓋這個生日年份；可在上方填入已知的農曆生日再計算。</p>
              )}
              {differenceText && (
                <div className="mt-5 rounded-2xl bg-[#5B3A9E] p-6 text-white md:p-8">
                  <p className="mb-2 text-sm text-white/75">陽曆與陰曆的落差</p>
                  <h2 className="text-2xl font-bold md:text-3xl">{differenceText}</h2>
                </div>
              )}
            </div>
          </section>

          <section className="px-6 pb-16">
            <div className="mx-auto grid max-w-4xl gap-8 rounded-3xl border border-[#E7E3F0] p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
              <div>
                <p className="text-sm font-semibold text-[#A8883F]">你現在看到的完整度</p>
                <p className="mt-2 text-4xl font-bold text-[#5B3A9E]">{completenessLabel}</p>
                <p className="mt-3 text-sm leading-loose text-[#6E6885]">陽曆約六成；加入陰曆約八成五；再加出生時分為十成。</p>
              </div>
              <label className="text-sm font-medium">
                出生時分（選填）
                <input type="time" value={birthTime} onChange={(event) => setBirthTime(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#DAD4E8] px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                <span className="mt-2 block font-normal leading-relaxed text-[#918BA6]">出生時間只用於完整度提示，不改變此頁顯示的主命數與流年、流月、流日。</span>
              </label>
            </div>
          </section>

          <section className="px-6 pb-16" id="current-flow-month">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#E7E3F0] bg-[#F7F5FC]/50 p-6 md:p-8">
              <p className="text-sm font-semibold text-[#A8883F]">本次個人流月</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">你現在走在流月 {result.solarFlows.flowMonth.num}</h2>
              <p className="mt-3 text-[#55506B]">這個階段到 {dateLabel(result.monthWindow.end)}，{dateLabel(result.monthWindow.nextChange)} 進入流月 {result.nextFlowMonth}。</p>
              <p className="mt-5 text-sm leading-loose text-[#6E6885]">{COPY.monthlyTurnRule}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#6E6885]">你現在走在流年 {result.solarFlows.flowYear.num}。</p>

              <div className="mt-6 border-t border-[#E7E3F0] pt-6" id="monthly-signup">
                <h3 className="text-xl font-bold">訂閱每月流月信</h3>
                <p className="mt-2 text-sm leading-loose text-[#55506B]">留 Email 後立刻寄出當前這一封；之後在每個人自己的流月換日前一天寄。</p>
                <p className="mt-2 text-xs leading-relaxed text-[#918BA6]">每封信涵蓋即將開始的完整流月，並提供退訂方式。</p>
                {!API_URL && <p className="mt-4 rounded-xl bg-[#FBF7EE] p-4 text-sm text-[#6E6885]" role="status">月信訂閱服務尚未連接，這份表單不會送出資料。</p>}

                {subscribeStatus === 'success' ? (
                  <p className="mt-5 rounded-xl bg-white p-4 text-sm text-[#416147]" role="status">訂閱資料已送出。</p>
                ) : (
                  <form onSubmit={subscribe} className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium">
                      姓名
                      <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                    </label>
                    <label className="text-sm font-medium">
                      Email
                      <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]" />
                    </label>
                    <label className="text-sm font-medium md:col-span-2">
                      你現在最想整理的是什麼？
                      <select required value={focus} onChange={(event) => setFocus(event.target.value)} className="mt-2 w-full rounded-xl border border-[#DAD4E8] bg-white px-4 py-3 outline-none focus:border-[#5B3A9E]">
                        <option value="">請選擇</option>
                        {FOCUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-[#55506B] md:col-span-2">
                      <input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-[#5B3A9E]" />
                      <span>我同意透過 Email 接收每月流月信，並了解每封信都可退訂。</span>
                    </label>
                    <label className="hidden" aria-hidden="true">
                      網站
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                    {subscribeStatus === 'unconfigured' && <p className="text-sm text-red-700 md:col-span-2" role="alert">月信訂閱服務目前尚未連接，資料沒有送出。</p>}
                    {subscribeStatus === 'error' && <p className="text-sm text-red-700 md:col-span-2" role="alert">送出時發生問題，請稍後再試。</p>}
                    <button type="submit" disabled={subscribeStatus === 'submitting' || !API_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D] disabled:opacity-50 md:col-span-2">
                      {subscribeStatus === 'submitting' ? '送出中…' : '訂閱每月流月信'}<ArrowRight size={17} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          <section className="px-6 pb-16" aria-labelledby="today-reminder-title">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#E7E3F0] p-6 md:p-8">
              <p className="text-sm font-semibold text-[#A8883F]">今日提醒｜{result.target}</p>
              <h2 id="today-reminder-title" className="mt-2 text-2xl font-bold">今天的流日數字</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#F7F5FC] p-5">
                  <p className="text-xs text-[#918BA6]">陽曆流日</p>
                  <p className="mt-1 text-3xl font-bold">{result.solarFlows.flowDay.num}</p>
                  {dailySolarRelation && <p className="mt-3 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailySolarRelation]}</p>}
                </div>
                {result.lunarFlows && (
                  <div className="rounded-2xl bg-[#FBF7EE] p-5">
                    <p className="text-xs text-[#918BA6]">陰曆流日</p>
                    <p className="mt-1 text-3xl font-bold">{result.lunarFlows.flowDay.num}</p>
                    {dailyLunarRelation && <p className="mt-3 text-sm leading-relaxed text-[#55506B]">{DAILY_RELATION_COPY[dailyLunarRelation]}</p>}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="px-6 py-16" aria-labelledby="life-number-education-title">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <article>
            <h2 id="life-number-education-title" className="mb-4 text-2xl font-bold">為什麼看生命數字</h2>
            <p className="mb-4 leading-loose text-[#55506B]">{COPY.mainNumberDefinition}</p>
            <p className="mb-4 leading-loose text-[#55506B]">{COPY.stuck}</p>
            <p className="leading-loose text-[#55506B]">{COPY.positioning}</p>
          </article>
          <article className="rounded-3xl bg-[#F7F5FC] p-6 md:p-8">
            <h2 className="mb-4 text-2xl font-bold">平衡空間與艾瑞克</h2>
            <p className="leading-loose text-[#55506B]">{COPY.brand}</p>
          </article>
        </div>
      </section>

      <section className="px-6 pb-24" aria-labelledby="life-number-next-title">
        <div className="mx-auto max-w-4xl">
          <h2 id="life-number-next-title" className="mb-6 text-2xl font-bold">下一步</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#E7E3F0] p-5">
              <h3 className="font-bold">2027 流年報告</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{COPY.annualReport}</p>
            </article>
            <a href="/nas/course" className="rounded-2xl border border-[#E7E3F0] p-5 transition hover:border-[#5B3A9E]">
              <h3 className="font-bold">主課</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{COPY.course}</p>
            </a>
            <a href="/nas/course" className="rounded-2xl border border-[#E7E3F0] p-5 transition hover:border-[#5B3A9E]">
              <h3 className="font-bold">一對一</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">{COPY.oneToOne}</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
