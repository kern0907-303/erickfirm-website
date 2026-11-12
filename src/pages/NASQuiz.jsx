import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import HeroTextReveal from '../components/HeroTextReveal';
import NASMark from '../components/NASMark';
import {
  QUIZ_QUESTIONS,
  QUIZ_SHORT_RESULTS,
  QUIZ_TYPES,
  QUIZ_UNLOCK_URL,
  scoreQuiz,
} from '../content/nasQuiz';

// 卡點五型自我檢查：8 題 → 先看短版結果 → 到 pay.erickfirm.com 用 LINE 登入看完整解析。
// 選項順序每次打亂，避免五型永遠排在同一個位置。

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function track(name, params) {
  try { window.efTrack?.(name, params); } catch { /* 追蹤失敗不影響作答 */ }
}

function newEventId() {
  try { return `nasquiz_${crypto.randomUUID()}`; } catch { return `nasquiz_${Date.now()}_${Math.random().toString(36).slice(2)}`; }
}

function unlockHref(answers, eventId) {
  const url = new URL(QUIZ_UNLOCK_URL);
  url.searchParams.set('a', answers.join(''));
  if (eventId) url.searchParams.set('event_id', eventId);
  try {
    const current = new URLSearchParams(window.location.search);
    ['source', 'funnel'].forEach((key) => {
      const value = current.get(key);
      if (value && /^[\w-]{1,60}$/.test(value)) url.searchParams.set(key, value);
    });
  } catch { /* 沒有來源參數就算了 */ }
  return url.toString();
}

const NASQuiz = () => {
  const questions = useMemo(
    () => QUIZ_QUESTIONS.map((item) => ({ ...item, options: shuffled(item.options) })),
    [],
  );
  const [step, setStep] = useState(0); // 0 到 7 作答，8 結果；第一眼就是第一題，不再有開場頁
  const [answers, setAnswers] = useState([]);
  const [quizEventId, setQuizEventId] = useState('');

  const resultType = step === questions.length ? scoreQuiz(answers) : null;

  const choose = (code) => {
    const next = [...answers.slice(0, step), code];
    setAnswers(next);
    if (step + 1 === questions.length) {
      const type = scoreQuiz(next);
      setQuizEventId(newEventId());
      track('QuizResult', { brand: 'nas', quiz_type: type });
      // 記住類型，2027 年度導航頁的開頭會依類型換一句（只存類型代碼，不存作答）
      try { localStorage.setItem('nas.quizType', type); } catch { /* 存不了就算了 */ }
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    if (step <= 0) return;
    setStep(step - 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="bg-white text-[#1F1A2E] min-h-screen">
      <SEOHead
        title="卡點五型自我檢查｜8 題，看清楚你的生活卡在哪一種狀態"
        description="生活一直卡住，不是因為不夠努力。8 題自我檢查，看清楚你現在卡在哪一種狀態。艾瑞克，二十年生命數字教學。"
      />

      <section className="pt-24 md:pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <NASMark label="卡點五型自我檢查" />

          {step >= 0 && step < questions.length && (
            <div>
              {step === 0 && (
                <HeroTextReveal
                  title="8 題，看你的生活卡在哪一種狀態"
                  subtitle="大約 2 分鐘，不用登入，選完馬上看到結果。"
                  titleClassName="text-2xl md:text-4xl font-bold leading-snug mb-3"
                  subtitleClassName="text-[#55506B] leading-loose mb-6"
                />
              )}
              <div className="mb-6 flex items-center justify-between text-sm text-[#6E6885]">
                {step > 0 ? (
                  <button type="button" onClick={back} className="inline-flex items-center gap-1 transition hover:text-[#5B3A9E] active:scale-95">
                    <ArrowLeft size={16} /> 上一題
                  </button>
                ) : <span />}
                <span>{step + 1} / {questions.length}</span>
              </div>
              <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-[#EEE9F7]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8B3FA8] to-[#D4B86A] transition-all duration-500"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <h2 className="mb-7 text-xl font-bold leading-snug md:text-2xl">{questions[step].q}</h2>
                  <div className="space-y-3">
                    {questions[step].options.map(([code, text]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => choose(code)}
                        className={`w-full rounded-2xl px-5 py-4 text-left leading-relaxed transition hover:shadow-md ${answers[step] === code ? 'bg-[#EEE6F8] text-[#472D7D]' : 'bg-[#F8F6FC] text-[#3A3450] hover:bg-[#F1ECF9]'}`}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {resultType && (
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] text-[#A8883F]">你的檢查結果</p>
              <HeroTextReveal
                title={`你現在的卡點狀態：${QUIZ_TYPES[resultType].name}`}
                subtitle={QUIZ_TYPES[resultType].tagline}
                titleClassName="text-2xl md:text-4xl font-bold leading-snug mb-3 text-[#472D7D]"
                subtitleClassName="text-[#A8883F] font-semibold mb-8"
              />
              <p className="mb-10 leading-loose text-[#3A3450]">{QUIZ_SHORT_RESULTS[resultType]}</p>

              <div className="rounded-[28px] bg-[#F8F6FC] p-7 md:p-9">
                <h2 className="mb-3 text-xl font-bold">{QUIZ_TYPES[resultType].name}詳細解析</h2>
                <p className="mb-6 leading-loose text-[#55506B]">
                  接著看{QUIZ_TYPES[resultType].name}在你生活裡最容易怎麼重演、為什麼會一直重來，以及看見的時候可以先做哪一件事。免費，用 LINE 登入就能看，結果也會幫你保存下來。
                </p>
                <a
                  href={unlockHref(answers, quizEventId)}
                  onClick={() => track('QuizUnlockClick', { brand: 'nas', quiz_type: resultType })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-8 py-4 font-semibold text-white shadow-sm transition hover:brightness-95 hover:shadow-lg sm:w-auto"
                >
                  LINE 登入，看詳細解析 <ArrowRight size={18} />
                </a>
                <p className="mt-4 text-xs leading-relaxed text-[#918BA6]">
                  不收費，只會取得你的 LINE 顯示名稱與識別碼，不會用你的帳號發文。登入畫面上的 Erick Firm 是艾瑞克的工作室，平衡空間的網站與結帳由它統一管理。
                </p>
              </div>

              <button type="button" onClick={restart} className="mt-8 text-sm text-[#6E6885] underline-offset-4 transition hover:text-[#5B3A9E] hover:underline">
                重新作答
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default NASQuiz;
