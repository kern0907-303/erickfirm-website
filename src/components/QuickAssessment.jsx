import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLocale, onLocaleChange } from '../lib/i18n';

const copy = {
  'zh-TW': {
    heading: '不知道從哪開始？先回答 3 題',
    desc: '不用專業背景，也能快速找到你現在最該先做的方向。',
    recommendationLabel: '你的優先建議服務',
    recommendationFallback: '請先完成 3 題自評',
    goRecommended: '先看推薦服務',
    directBook: '直接預約',
    serviceLabel: {
      'enterprise-doctor': '企業醫生',
      'life-number': '生命數字',
      'personal-growth': '個人成長',
    },
    questions: [
      {
        id: 'focus',
        title: '你最想先解決哪個問題？',
        options: [
          { label: '公司卡關、團隊內耗', service: 'enterprise-doctor' },
          { label: '決策反覆、角色定位混亂', service: 'life-number' },
          { label: '個人節奏與持續成長', service: 'personal-growth' },
        ],
      },
      {
        id: 'time',
        title: '你希望多快看到改變？',
        options: [
          { label: '先快速止血（1-4 週）', service: 'enterprise-doctor' },
          { label: '先釐清方向（1-3 週）', service: 'life-number' },
          { label: '建立長期系統（4-8 週）', service: 'personal-growth' },
        ],
      },
      {
        id: 'scope',
        title: '你現在主要影響範圍是？',
        options: [
          { label: '組織與業務', service: 'enterprise-doctor' },
          { label: '個人與合作關係', service: 'life-number' },
          { label: '個人習慣與輸出', service: 'personal-growth' },
        ],
      },
    ],
  },
  en: {
    heading: 'Not Sure Where to Start? Answer 3 Questions',
    desc: 'No technical background needed. Get a clear first direction in under a minute.',
    recommendationLabel: 'Recommended First Service',
    recommendationFallback: 'Complete all 3 questions first',
    goRecommended: 'Go to Recommended Service',
    directBook: 'Book Directly',
    serviceLabel: {
      'enterprise-doctor': 'Enterprise Doctor',
      'life-number': 'Numerology',
      'personal-growth': 'Personal Growth',
    },
    questions: [
      {
        id: 'focus',
        title: 'What do you need to solve first?',
        options: [
          { label: 'Business slowdown and team friction', service: 'enterprise-doctor' },
          { label: 'Decision loops and role confusion', service: 'life-number' },
          { label: 'Execution rhythm and sustained growth', service: 'personal-growth' },
        ],
      },
      {
        id: 'time',
        title: 'How fast do you want to see progress?',
        options: [
          { label: 'Quick stabilization (1-4 weeks)', service: 'enterprise-doctor' },
          { label: 'Direction clarity (1-3 weeks)', service: 'life-number' },
          { label: 'Long-term system (4-8 weeks)', service: 'personal-growth' },
        ],
      },
      {
        id: 'scope',
        title: 'Where is your main impact right now?',
        options: [
          { label: 'Organization and operations', service: 'enterprise-doctor' },
          { label: 'Personal role and collaboration', service: 'life-number' },
          { label: 'Habits and execution output', service: 'personal-growth' },
        ],
      },
    ],
  },
};

const QuickAssessment = () => {
  const [locale, setLocale] = React.useState(getPreferredLocale());
  React.useEffect(() => onLocaleChange(setLocale), []);
  const dict = copy[locale];
  const [answers, setAnswers] = useState({});

  const recommendation = useMemo(() => {
    const selected = Object.values(answers);
    if (!selected.length) return null;
    const count = selected.reduce((acc, service) => {
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [answers]);

  return (
    <section id="assessment" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4">START HERE</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-display">{dict.heading}</h3>
          <p className="text-slate-600 font-medium">{dict.desc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dict.questions.map((question, index) => (
            <article key={question.id} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <p className="text-xs text-[#D4AF37] font-bold tracking-[0.2em] mb-3">Q{index + 1}</p>
              <h4 className="font-bold text-slate-900 mb-4">{question.title}</h4>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const active = answers[question.id] === option.service;
                  return (
                    <button
                      key={option.label}
                      onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.service }))}
                      className={`w-full text-left px-4 py-3 rounded-sm border text-sm transition-all ${
                        active ? 'border-[#D4AF37] bg-white text-slate-900 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 bg-slate-900 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">{dict.recommendationLabel}</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{recommendation ? dict.serviceLabel[recommendation] : dict.recommendationFallback}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {recommendation && (
              <Link to={`/insights/${recommendation}`} className="px-6 py-3 bg-[#D4AF37] text-slate-900 font-bold rounded-sm text-center">
                {dict.goRecommended}
              </Link>
            )}
            <a href="/#contact" className="px-6 py-3 border border-slate-500 text-white font-bold rounded-sm text-center">
              {dict.directBook}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAssessment;
