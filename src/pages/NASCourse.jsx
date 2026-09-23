import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import { LINE_CONFIG } from '../lib/constants';

const COURSE_MODULES = [
  {
    id: '0', title: '模組零', duration: '74 分鐘', free: true,
    units: [
      ['0-1', '你不是不夠努力，是兩個你在拉扯', 15],
      ['0-2', '摸不到的東西，決定了你摸得到的一切', 16],
      ['0-3', '你看不見的選項，對你來說就是不存在', 16],
      ['0-4', '同一天出生的雙胞胎，為什麼一個內向一個外向', 15],
      ['0-5', '如果你的人生可以被算準，那才是壞消息', 12],
    ],
  },
  {
    id: '1', title: '模組一', duration: '135 分鐘',
    units: [
      ['1-1', '一組生日，藏著一條你沒看過的路徑', 18],
      ['1-2', '白天的你和晚上的你，不是同一個人', 16],
      ['1-3', '同一個數字出現三次，跟出現一次是兩種人', 14],
      ['1-4', '你身上的連線，和你缺的那一條', 17],
      ['1-5', '十種原型 1·2', 14],
      ['1-6', '十種原型 3·4', 14],
      ['1-7', '十種原型 5·6', 14],
      ['1-8', '十種原型 7·8', 14],
      ['1-9', '十種原型 9·0', 14],
    ],
  },
  {
    id: '2', title: '模組二', duration: '161 分鐘',
    units: [
      ['2-1', '你不是做不到，是心裡有一塊過不去', 15],
      ['2-2', '你的卡點，在盤上有一個位置', 17],
      ['2-3', '你以為的個性，可能是被要求出來的', 16],
      ['2-4', '你小時候的那個家，還在你身上', 17],
      ['2-5', '你愛人的方式，跟你說話的方式不一樣', 16],
      ['2-6', '重複出現的不是人，是互動模式', 17],
      ['2-7', '四階不是誰比較厲害', 16],
      ['2-8', '一樣是打掃，四個人做的是四件事', 16],
      ['2-9', '第一次碰到的事，你會回到哪個位置', 16],
      ['2-10', '找出你自己的那一條衝突線', 15],
    ],
  },
  {
    id: '3', title: '模組三', duration: '110 分鐘',
    units: [
      ['3-1', '人生是一棟五層樓', 16],
      ['3-2', '九年一輪：從選種到休耕', 18],
      ['3-3', '你站在九宮的哪一格', 15],
      ['3-4', '流月與流日', 14],
      ['3-5', '六種關係（上）', 16],
      ['3-6', '六種關係（下）', 16],
      ['3-7', '壞天氣不用硬撐，但要知道自己在哪一種天氣裡', 15],
    ],
  },
  {
    id: '4', title: '模組四', duration: '82 分鐘',
    units: [
      ['4-1', '把你自己寫成一頁', 17],
      ['4-2', '你適合被放在什麼位置', 17],
      ['4-3', '排出你的未來十二個月，把衝突線放進去', 18],
      ['4-4', '讀懂數字每曆的每一格', 16],
      ['4-5', '用在身邊的人身上', 14],
    ],
  },
];

const COURSE_PRICES = [
  { name: '自學', content: '主課 36 單元', price: 'NT$9,800', cta: '詢問自學方案' },
  { name: '陪跑', content: '主課＋實踐營一梯', price: 'NT$14,800', cta: '詢問陪跑方案', recommended: true },
  { name: '深度', content: '主課＋實踐營＋艾瑞克一對一 60 分鐘', price: 'NT$19,800', note: '每梯限 5 名', cta: '詢問深度方案' },
];

const CONSULTANT_WEEKS = [
  ['1', '讀盤：陌生人的盤', '30 分鐘內講出一個人的主線'],
  ['2', '問診：他說的問題不是真正的問題', '提問，找到真正的卡點'],
  ['3', '說法：同一個結論七種講法', '依生命功課等級調整說法＋語言紅線'],
  ['4', '兩個人的盤：感情解碼程序', '伴侶、親子、合夥的雙人解讀'],
  ['5', '時間盤：幫別人排節奏', '流年與關鍵期的安排，不預測後果'],
  ['6', '開業：把解盤變成一個服務', '服務流程、報告格式、定價、第一批個案（從身邊的人開始）；會員四項工具怎麼用'],
];

const lineCta = (label, className = '') => (
  <a href={LINE_CONFIG.LINE_MESSAGE_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D] ${className}`}>
    {label}<ArrowRight size={16} />
  </a>
);

const NASCourse = () => (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead
      title="生命數字課程｜36 單元、五模組，約 9 小時 20 分"
      description="生命數字主課 36 單元、五個模組、約 9 小時 20 分。從看懂自己的生命設定、卡點與時間節奏，到學會讀數字每曆。另有分流／轉職的生命數字顧問班。艾瑞克，二十年生命數字教學。"
    />

    <section className="px-6 pb-16 pt-32">
      <div className="mx-auto max-w-3xl">
        <NASMark label="課程" />
        <h1 className="mb-7 text-3xl font-bold leading-snug md:text-4xl">
          數字每曆告訴你今天是什麼天氣。<br />
          <span className="text-[#6E6885]">這門課教你怎麼讀它。</span>
        </h1>
        <p className="mb-4 max-w-2xl leading-loose text-[#55506B]">
          主課共 <strong>36 單元、五個模組、約 9 小時 20 分</strong>，從看懂自己的生命設定開始，走到能把數字每曆讀進每天的選擇。
        </p>
        <p className="max-w-2xl leading-loose text-[#55506B]">
          課程圍繞四個問題：<strong>我是誰</strong>、<strong>我為什麼會這樣</strong>、
          <strong>我現在在哪裡</strong>、<strong>我接下來該往哪裡走</strong>。
        </p>
      </div>
    </section>

    <section className="bg-[#F7F5FC] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs tracking-[0.2em] text-[#918BA6]">主課架構</p>
            <h2 className="text-2xl font-bold md:text-3xl">五個模組，36 個可以走完的單元</h2>
          </div>
          <span className="text-sm tabular-nums text-[#6E6885]">合計 562 分鐘</span>
        </div>

        <div className="space-y-5">
          {COURSE_MODULES.map((module) => (
            <section key={module.id} className="overflow-hidden rounded-2xl border border-[#E7E3F0] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E3F0] px-5 py-4 md:px-7">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold">{module.title}</h3>
                  {module.free && <span className="rounded-full bg-[#5B3A9E] px-3 py-1 text-xs text-white">免費試看</span>}
                </div>
                <span className="text-sm tabular-nums text-[#6E6885]">{module.duration}</span>
              </div>
              <ol className="divide-y divide-[#F0EDF7]">
                {module.units.map(([number, title, minutes]) => (
                  <li key={number} className="flex items-start gap-4 px-5 py-3.5 text-sm md:px-7">
                    <span className="w-10 shrink-0 font-semibold tabular-nums text-[#A8883F]">{number}</span>
                    <span className="flex-1 leading-relaxed text-[#55506B]">{title}</span>
                    <span className="shrink-0 tabular-nums text-[#918BA6]">{minutes} 分</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>

    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#918BA6]">主課方案</p>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">同一套系統，選你現在需要的支持</h2>
          <p className="leading-loose text-[#55506B]">同一套系統，過去實體三階共 48 小時、NT$54,000；現在核心濃縮成 36 單元錄播，NT$9,800。</p>
          <p className="mt-3 text-sm leading-loose text-[#6E6885]">不到兩次一對一解盤的價錢，學會自己看一輩子。</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {COURSE_PRICES.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 ${plan.recommended ? 'border-[#5B3A9E] bg-[#F7F5FC] shadow-[0_12px_35px_rgba(91,58,158,0.14)]' : 'border-[#E7E3F0] bg-white'}`}>
              {plan.recommended && <span className="absolute -top-3 left-5 rounded-full bg-[#5B3A9E] px-3 py-1 text-xs text-white">推薦</span>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-[#55506B]">{plan.content}</p>
              <p className="mt-6 text-3xl font-bold tabular-nums text-[#1F1A2E]">{plan.price}</p>
              {plan.note && <p className="mt-1 text-xs text-[#A8883F]">{plan.note}</p>}
              {plan.recommended && <p className="mt-4 text-sm leading-relaxed text-[#55506B]">再加主課價的一半，多 4 週陪你做。</p>}
              <div className="mt-auto pt-7">
                {lineCta(plan.cta, 'w-full')}
                <p className="mt-3 text-xs leading-relaxed text-[#918BA6]">退費條款：〔待確認後補上〕</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#E7E3F0] bg-[#FBF7EE] p-6">
          <h3 className="mb-3 font-bold">實踐營：4 週線上小班</h3>
          <p className="mb-4 leading-loose text-[#55506B]">每週一次 90 分鐘直播（有回放），每梯上限 30 人，每季開一梯；期間有 LINE 群答疑，每週一份作業並在直播中公開講評。</p>
          <ol className="grid gap-2 text-sm leading-relaxed text-[#55506B] sm:grid-cols-2">
            <li>① 讀懂自己的盤</li><li>② 找出卡點與衝突線</li><li>③ 排出未來十二個月</li><li>④ 把自己寫成一頁、學會看數字每曆</li>
          </ol>
        </div>
      </div>
    </section>

    <section className="bg-[#F7F5FC] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-5 text-2xl font-bold">課程之後，不是再買一門課</h2>
        <p className="mb-4 leading-loose text-[#55506B]">主課把看懂自己的方法完整交給你。之後需要的是把這套方法放進生活裡，持續讀數字每曆、觀察自己的節奏。</p>
        <div className="rounded-2xl border border-[#E7E3F0] bg-white p-6">
          <p className="mb-2 text-sm text-[#6E6885]">如果你想學會幫別人看</p>
          <p className="leading-loose text-[#55506B]">顧問班是分流／轉職的另一條路：主課是看懂自己，顧問班是學會幫別人看。完成主課後，再依自己的時間與方向登記。</p>
        </div>
      </div>
    </section>

    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#918BA6]">分流／轉職</p>
          <h2 className="mb-5 text-2xl font-bold md:text-3xl">生命數字顧問班</h2>
          <p className="mb-4 leading-loose text-[#55506B]">主課是看懂自己，顧問班是學會幫別人看。形式為 6 週直播，第一屆預計 2027 年 6–7 月開班。</p>
          <p className="mb-7 leading-loose text-[#55506B]">學費 <strong>NT$32,000</strong>，含第一年顧問會員（價值 NT$12,000）。學費不變，多送一整年會員，將近學費的四成。</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E3F0] p-6">
            <h3 className="mb-4 font-bold">入學與結業</h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[#55506B]">
              <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#5B3A9E]" />完成主課，並在登記時交一份「幫身邊一個人看盤」的作業。</li>
              <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#5B3A9E]" />結業後交 3 份真實個案（錄音＋報告），審核通過才發認證。</li>
              <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#5B3A9E]" />報名方式：意向登記制，不放直接付款。</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E7E3F0] p-6">
            <h3 className="mb-4 font-bold">顧問會員</h3>
            <p className="text-sm leading-relaxed text-[#55506B]">第二年起年費 NT$12,000（約每月 1,000）。</p>
            <p className="mt-3 text-sm leading-relaxed text-[#55506B]">會員內容：每月個案督導、每季深化課、認證顧問名錄刊登、公開解盤夜上台資格、數字每曆顧問專屬連結、內容工具。</p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E7E3F0]">
          <div className="border-b border-[#E7E3F0] bg-[#F7F5FC] px-5 py-4 font-bold">六週主題與學員帶走的能力</div>
          <div className="divide-y divide-[#F0EDF7]">
            {CONSULTANT_WEEKS.map(([week, topic, ability]) => (
              <div key={week} className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[48px_1fr_1.2fr]">
                <span className="font-semibold tabular-nums text-[#A8883F]">第 {week} 週</span>
                <span className="font-medium text-[#1F1A2E]">{topic}</span>
                <span className="leading-relaxed text-[#55506B]">{ability}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {lineCta('意向登記（加 LINE）')}
          <span className="text-xs text-[#918BA6]">第一屆預計 2027 年 6–7 月開班</span>
        </div>
      </div>
    </section>

    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-5 text-xl font-bold">還沒決定？那就先不要買</h2>
        <p className="mb-4 leading-loose text-[#55506B]">先免費算一次，或者訂閱數字每曆用一陣子。</p>
        <p className="mb-7 leading-loose text-[#55506B]">等到你開始覺得「我看得懂數字了，但我不知道該怎麼用」——那句話出現的時候，再回來。</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/nas/calculator" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-7 py-4 font-medium text-white transition hover:bg-[#472D7D]">先免費算一次<ArrowRight size={16} /></Link>
          <Link to="/nas/meili" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4B86A] px-7 py-4 font-medium text-[#A8883F] transition hover:border-[#A8883F] hover:bg-[#FBF7EE]">看數字每曆</Link>
        </div>
      </div>
    </section>
  </main>
);

export default NASCourse;
