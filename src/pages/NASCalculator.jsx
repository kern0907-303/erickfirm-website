import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const API_URL = '/.netlify/functions/ai_reading';

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
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-[#E7E3F0]">
              <div className="flex items-center gap-2 text-[#918BA6] text-xs mb-4">
                <Sun size={15} /> 陽曆 · 對外的展現
              </div>
              <p className="text-sm text-[#6E6885] mb-1">主命數</p>
              <p className="text-3xl font-bold tabular-nums mb-4">{p.solarMain}</p>
              <p className="text-sm text-[#6E6885] mb-1">靈魂等級</p>
              <p className="text-lg tabular-nums">{p.solarSoul}</p>
            </div>
            <div className="p-6 rounded-2xl border border-[#E7E3F0]">
              <div className="flex items-center gap-2 text-[#918BA6] text-xs mb-4">
                <Moon size={15} /> 陰曆 · 內在的需求
              </div>
              <p className="text-sm text-[#6E6885] mb-1">主命數</p>
              <p className="text-3xl font-bold tabular-nums mb-4">{p.lunarMain}</p>
              <p className="text-sm text-[#6E6885] mb-1">靈魂等級</p>
              <p className="text-lg tabular-nums">{p.lunarSoul}</p>
            </div>
            {result.lunar_birthday_text && (
              <p className="sm:col-span-2 text-xs text-[#918BA6]">
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
              你剛才拿到的是一組數字。網路上查得到這組數字的標準描述——但如果你看了覺得
              <strong className="text-[#1F1A2E]">「有點準，又不太像我」</strong>，
              那個感覺是對的，而且有原因。
            </p>
            <p className="text-[#55506B] leading-loose mb-8">
              同一個數字，在四個不同的認知層次會長成完全不同的人。
              你查到的描述，通常只寫了其中一種——而且是最好看的那一種。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/insights/life-number"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition"
              >
                為什麼算出來不像我
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/nas"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4B86A] text-[#A8883F] hover:border-[#A8883F] hover:bg-[#FBF7EE] transition"
              >
                看完整的生命數字內容
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
          <p className="text-[#55506B] leading-loose">
            算出來的數字不會決定你是誰。它只告訴你要處理什麼題目——怎麼答，還是你自己的事。
          </p>
        </div>
      </section>
    </main>
  );
};

export default NASCalculator;
