import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';

const STAGES = [
  {
    n: '主課',
    name: '看懂自己的生命數字',
    role: '看懂自己',
    form: '錄播 28 單元 · 8–10 小時',
    price: 'NT$9,800',
    desc: '把完整的知識與概念交代清楚。一門課講完——不保留、不分批、沒有第二階在等你。',
    modules: [
      '模組一 · 生命數字入門（5 單元）',
      '模組二 · 十種生命原型（10 單元）',
      '模組三 · 自己的內在設定（6 單元）',
      '模組四 · 自己的時間節奏（7 單元）',
    ],
    outcome: ['讀懂每曆每一格', '自我特質分析', '人生定位分析', '年度方向規劃', '學員群組 ＋ 不定期線上 QA'],
    current: true,
  },
  {
    n: '進階',
    name: '生命數字顧問班',
    role: '看懂別人',
    form: '6 週直播 · 看盤演練 · 解盤實戰',
    price: 'NT$32,000',
    desc: '從用在自己身上，到用在別人身上。含一條鐵律：不預測、不恐嚇。',
    modules: ['看盤地圖', '時間與關係判讀', '問題定位系統', '案例解析工作坊', '顧問諮詢系統', '完整解盤實戰'],
    outcome: ['3 份完整解盤', '1 份感情合盤分析', '1 份人生導航報告', '1 次口頭解盤演練', '基礎執業能力'],
  },
];

const NASCourse = () => (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead
      title="生命數字課程｜一門課講完，沒有第二階在等你"
      description="錄播 28 單元，把生命數字的知識一次講完——不分批、不保留、沒有第二階在等你。含學員群組與不定期線上 QA。想更進一步的另有顧問班。艾瑞克，二十年生命數字教學。"
    />

    <section className="pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <NASMark label="課程" />
        <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-7">
          數字每曆告訴你今天是什麼天氣。<br />
          <span className="text-[#6E6885]">這門課教你怎麼讀它。</span>
        </h1>
        <p className="text-[#55506B] leading-loose mb-4 max-w-2xl">
          數字每曆會顯示你的流年是 3、你的主命數是 1。
          但那代表什麼、你該怎麼調——那不是一段說明文字講得完的事。
        </p>
        <p className="text-[#55506B] leading-loose max-w-2xl">
          課程圍繞四個問題：<strong>我是誰</strong>、<strong>我為什麼會這樣</strong>、
          <strong>我現在在哪裡</strong>、<strong>我接下來該往哪裡走</strong>。
        </p>
      </div>
    </section>

    <section className="pb-16 px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {STAGES.map((s) => (
          <div
            key={s.name}
            className={`p-7 rounded-2xl border ${s.current ? 'border-[#5B3A9E]' : 'border-[#E7E3F0]'}`}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
              <span className="text-xs text-[#918BA6]">第{s.n}階段</span>
              <h2 className="text-xl font-bold">{s.name}</h2>
              <span className="text-sm text-[#6E6885]">{s.role}</span>
              {s.current && (
                <span className="text-xs px-3 py-0.5 rounded-full bg-[#5B3A9E] text-white">首波開放</span>
              )}
            </div>
            <p className="text-[#55506B] leading-relaxed mb-4">{s.desc}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#6E6885] mb-5">
              <span>{s.form}</span>
              <span className="tabular-nums font-medium text-[#1F1A2E]">{s.price}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-xs text-[#918BA6] mb-2">內容</p>
                <ul className="space-y-1.5 text-[#55506B]">
                  {s.modules.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[#918BA6] mb-2">完成後你會有</p>
                <ul className="space-y-1.5 text-[#55506B]">
                  {s.outcome.map((o) => (
                    <li key={o} className="flex gap-2">
                      <Check size={14} className="shrink-0 mt-1 text-[#1F1A2E]" />{o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-16 px-6 bg-[#F7F5FC]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">買了之後，不是自己一個人看</h2>
        <p className="text-[#55506B] leading-loose mb-4">
          購買後會加入<strong>學員群組</strong>。課程裡看不懂的地方、套用到自己身上卡住的地方，
          都可以在群組裡問。
        </p>
        <p className="text-[#55506B] leading-loose mb-8">
          我也會<strong>不定期開線上 QA</strong>，針對大家實際遇到的問題直接講。
          錄播最大的缺點是沒有人回答你——這是來補那一塊的。
        </p>
        <div className="p-6 rounded-2xl border border-[#E7E3F0] bg-white">
          <p className="text-sm text-[#6E6885] mb-2">課程之後呢？</p>
          <p className="text-[#55506B] leading-relaxed text-sm">
            <strong>沒有第二階在等你。</strong>這門課把知識講完了。
            之後你需要的不是更多課，是那個<strong>會跟著時間更新的數字每曆</strong>——
            流年每年變、流月每月變，那是工具在做的事，不是課程。
          </p>
        </div>
      </div>
    </section>

    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-5">還沒決定？那就先不要買</h2>
        <p className="text-[#55506B] leading-loose mb-4">
          先免費算一次，或者訂閱數字每曆用一陣子。
        </p>
        <p className="text-[#55506B] leading-loose mb-7">
          等到你開始覺得「我看得懂數字了，但我不知道該怎麼用」——
          那句話凮現的時候，再回來。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/nas/calculator" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#5B3A9E] text-white font-medium hover:bg-[#472D7D] transition">
            先免費算一次<ArrowRight size={16} />
          </Link>
          <Link to="/nas/meili" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-[#D4B86A] text-[#A8883F] hover:border-[#A8883F] hover:bg-[#FBF7EE] transition">
            看數字每曆
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default NASCourse;
