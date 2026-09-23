import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import NASMark from '../components/NASMark';
import OutlineRequestForm from '../components/OutlineRequestForm';
import { LINE_CONFIG } from '../lib/constants';

const COURSE_MODULES = [
  {
    id: '0', title: '模組零：先把眼睛換掉', unitCount: '5 堂', duration: '74 分', free: true,
    solves: ['為什麼你一直很努力卻卡住', '生日描述的是出廠設定，不替你寫死答案', '從數字看自己，而不是急著替自己下結論'],
    takeaways: ['一套看自己的新角度', '知道這門課不預測、不算命'],
  },
  {
    id: '1', title: '模組一：你的出廠設定', unitCount: '9 堂', duration: '135 分',
    solves: ['一組生日藏著兩條軌道', '白天的你和晚上的你，不是同一個人', '把生日資料放回內在與外在的差異中看'],
    takeaways: ['讀懂自己的兩軌', '認得十種生命原型', '找出自己缺什麼、多什麼'],
  },
  {
    id: '2', title: '模組二：你卡在哪裡', unitCount: '10 堂', duration: '161 分',
    solves: ['為什麼你知道該怎麼做卻做不到', '重複出現的不是人，是模式', '把反覆卡住的地方從自責轉成可以觀察的結構'],
    takeaways: ['在自己的盤上指出卡點的位置', '看懂自己愛人與表達的方式'],
  },
  {
    id: '3', title: '模組三：你的時間感', unitCount: '7 堂', duration: '110 分',
    solves: ['努力不一定在對的時間', '人生有節奏，不是隨機', '把流年、流月、流日放回每天的安排裡'],
    takeaways: ['知道自己現在走到哪一段', '壞天氣時知道怎麼安排，不硬撐'],
  },
  {
    id: '4', title: '模組四：把它用起來', unitCount: '5 堂', duration: '82 分',
    solves: ['學完最怕的是看過就忘', '把理解放回接下來的生活', '把看見的東西變成日常可以回來使用的節奏'],
    takeaways: ['把自己寫成一頁', '排出未來十二個月', '每天會用數字每曆'],
  },
];

const FEATURED_UNITS = [
  ['你不是不夠努力，是兩個你在拉扯', '看見道理與感受同時拉扯時，卡住不等於不夠努力。'],
  ['如果你的人生可以被算準，那才是壞消息', '數字描述要處理的題目，不替你把答案寫死。'],
  ['白天的你和晚上的你，不是同一個人', '用雙軌看見對外展現與內在需求的落差。'],
  ['你以為的個性，可能是被要求出來的', '分清楚主命設定與後天適應怎麼一起作用。'],
  ['重複出現的不是人，是互動模式', '從關係裡辨認反覆發生的互動結構。'],
  ['壞天氣不用硬撐，但要知道自己在哪一種天氣裡', '先辨認流日狀態，再安排今天的動作。'],
];

const COURSE_PRICES = [
  { name: '自學', content: '主課 36 單元', price: 'NT$9,800', cta: '詢問自學方案' },
  { name: '陪跑', content: '主課＋實踐營一梯', price: 'NT$14,800', cta: '詢問陪跑方案', recommended: true },
  { name: '深度', content: '主課＋實踐營＋艾瑞克一對一 60 分鐘', price: 'NT$19,800', note: '每梯限 5 名', cta: '詢問深度方案' },
];

const lineCta = (label, className = '') => (
  <a href={LINE_CONFIG.LINE_MESSAGE_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-6 py-3 font-medium text-white transition hover:bg-[#472D7D] ${className}`}>
    {label}<ArrowRight size={16} />
  </a>
);

const NASCourse = () => (
  <main className="bg-white text-[#1F1A2E]">
    <SEOHead
      title="生命數字課程｜36 堂、每堂不到 20 分鐘，約 9 小時 20 分"
      description="生命數字主課 36 堂、每堂不到 20 分鐘，總長約 9 小時 20 分。從看懂自己的生命設定、卡點與時間節奏，到讀進數字每曆。另有分流／轉職的生命數字顧問班。艾瑞克，二十年生命數字教學。"
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 rounded-3xl border border-[#D7C9F2] bg-white p-7 shadow-[0_12px_35px_rgba(91,58,158,0.08)] md:p-10">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#A8883F]">每天 18 分鐘</p>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">一天一堂，一個多月看完；每天不到 20 分鐘。</h2>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[['36 堂', '完整主課'], ['每堂 ≤18 分鐘', '通勤、午休、睡前都放得進去'], ['總長 9 小時 20 分', '一天一堂，36 天看完']].map(([value, label]) => (
              <div key={value} className="rounded-2xl bg-[#F7F5FC] p-5"><p className="text-2xl font-bold tabular-nums text-[#5B3A9E]">{value}</p><p className="mt-2 text-sm leading-relaxed text-[#55506B]">{label}</p></div>
            ))}
          </div>
          <p className="max-w-3xl text-sm leading-loose text-[#55506B]">每一堂都控制在 18 分鐘以內，通勤、午休、睡前都放得進去。一天一堂，36 天看完；想快的人一個週末也能看完模組零到模組一。不用排出整個下午，也不用怕中斷後接不上——每一堂都是完整的一件事。</p>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs tracking-[0.2em] text-[#918BA6]">主課架構</p>
            <h2 className="text-2xl font-bold md:text-3xl">五個模組，公開看結構</h2>
          </div>
          <span className="text-sm tabular-nums text-[#6E6885]">合計 562 分鐘</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {COURSE_MODULES.map((module) => (
            <article key={module.id} className="rounded-2xl border border-[#E7E3F0] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="font-bold">{module.title}</h3>{module.free && <span className="mt-2 inline-block rounded-full bg-[#5B3A9E] px-3 py-1 text-xs text-white">免費試看</span>}</div>
                <div className="text-right text-sm tabular-nums text-[#6E6885]"><p>{module.unitCount}</p><p>{module.duration}</p></div>
              </div>
              <p className="mt-5 mb-3 text-sm font-semibold text-[#1F1A2E]">這個模組在解決什麼</p>
              <ul className="space-y-1 text-sm leading-relaxed text-[#55506B]">{module.solves.map((line) => <li key={line}>・{line}</li>)}</ul>
              <p className="mt-5 mb-3 text-sm font-semibold text-[#1F1A2E]">你會帶走什麼</p>
              <ul className="space-y-1 text-sm leading-relaxed text-[#55506B]">{module.takeaways.map((line) => <li key={line}>・{line}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <p className="mb-2 text-xs tracking-[0.2em] text-[#918BA6]">課程中的其中 6 堂</p>
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">先看幾個你可能正在問的問題</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_UNITS.map(([title, description]) => <article key={title} className="rounded-2xl border border-[#E7E3F0] bg-white p-5"><h3 className="mb-3 font-bold leading-relaxed">{title}</h3><p className="text-sm leading-relaxed text-[#55506B]">{description}</p></article>)}
          </div>
        </div>

        <div className="mt-12">
          <OutlineRequestForm formName="nas-course-outline-request" title="索取完整課綱" description="完整 36 堂課綱與時長，填寫後即可取得 PDF。總長約 9 小時 20 分，每堂不到 20 分鐘。" downloadHref="/downloads/nas-course-outline.pdf" />
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
              {plan.name === '自學' && <p className="mt-2 text-sm leading-relaxed text-[#6E6885]">一天一堂，36 天看完。</p>}
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

    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#E7E3F0] bg-[#F7F5FC] p-7 md:p-9">
        <p className="mb-3 text-xs tracking-[0.2em] text-[#918BA6]">分流／轉職</p>
        <h2 className="mb-5 text-2xl font-bold md:text-3xl">生命數字顧問班</h2>
        <p className="mb-4 leading-loose text-[#55506B]">主課是看懂自己，顧問班是學會幫別人看。兩者是分流，不是深淺。</p>
        <p className="mb-7 leading-loose text-[#55506B]">學費 <strong>NT$32,000</strong>，含第一年顧問會員（價值 NT$12,000）。第一屆預計 2027 年 6–7 月開班。</p>
        <Link to="/nas/consultant" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B3A9E] px-7 py-4 font-medium text-white transition hover:bg-[#472D7D]">了解顧問班<ArrowRight size={16} /></Link>
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

    <p className="px-6 pb-12 text-center text-xs leading-relaxed text-[#918BA6]">課程架構與內容為艾瑞克所有，未經授權不得重製、改作或用於商業用途。</p>
  </main>
);

export default NASCourse;
