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
    description: '先處理那個最常見的疑問：明明已經很努力，為什麼事情還是卡在原地。用生日資料當作觀察自己的入口，分清楚生命設定與後天反應，不急著替自己下結論。你會先換一個看自己的角度，知道這門課不預測、不算命。',
    takeaways: ['一套看自己的新角度', '知道這門課不預測、不算命'],
  },
  {
    id: '1', title: '模組一：你的出廠設定', unitCount: '9 堂', duration: '135 分',
    description: '把一組生日拆成陽曆與陰曆兩條軌道，理解白天的你與晚上的你為何常常不一樣。從數字出現的位置與次數，看見你的生命原型、缺少的支撐，以及反覆使用的慣性。你會得到一張比較完整的自我地圖。',
    takeaways: ['讀懂自己的兩軌', '認得十種生命原型', '找出自己缺什麼、多什麼'],
  },
  {
    id: '2', title: '模組二：你卡在哪裡', unitCount: '10 堂', duration: '161 分',
    description: '你不是做不到，是心裡有一塊過不去。這個模組把「我知道該怎麼做卻做不到」拆開來看：你的卡點不是情緒，是結構，而且在盤上有一個確切的位置。課程把常見卡點收斂成五種型別——落差、斷線、過載、空缺、錯位——並教你判斷自己現在最吃力的是哪一型。同時處理原生家庭、感情表達、四階與生命功課等級。',
    takeaways: ['在自己的盤上指出卡點的位置', '看懂自己愛人與表達的方式'],
  },
  {
    id: '3', title: '模組三：你的時間感', unitCount: '7 堂', duration: '110 分',
    description: '努力不一定發生在對的時間，這個模組把流年、流月、流日放回人生節奏裡。你會知道自己現在走到哪一段，也知道遇到壞天氣時如何安排，不把每一天都當成硬撐的考驗，不必急著證明自己。',
    takeaways: ['知道自己現在走到哪一段', '壞天氣時知道怎麼安排，不硬撐'],
  },
  {
    id: '4', title: '模組四：把它用起來', unitCount: '5 堂', duration: '82 分',
    description: '學完最怕的是看過就忘，所以把理解整理成一頁，變成之後可以反覆回來使用的工具。排出未來十二個月，把數字每曆放進每天的選擇，不只在計算完成那天覺得有趣，還能照自己的節奏安排下一步。',
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

const COURSE_FAQS = [
  ['要花多久看完？', '主課共 36 堂，每堂不到 20 分鐘；一天一堂，36 天看完，想快一點也可以依自己的節奏安排。'],
  ['沒有基礎可以嗎？', '可以。課程從觀察自己的方式開始，不要求先學過生命數字或其他相關工具。'],
  ['這跟坊間課程差在哪？', '這套課程同時看陽曆與陰曆兩條軌道，從自己的卡點與生活安排出發，不只給你一個數字或一個固定結論。'],
  ['這跟生命靈數是同一套嗎？', '有些人稱它為生命靈數，指的是同一套以生日為基礎的系統。本課程採用的是平衡空間的彩虹生命數字，特色是陽曆與陰曆雙軌一起看。'],
  ['會不會算命？', '不會。課程不預測、不恐嚇，數字描述的是要處理的題目，不替你把答案寫死。'],
  ['退費怎麼辦？', '目前頁面標示退費條款待確認；購買前請先確認正式條款。'],
  ['購買後可以看多久？', '目前頁面未標示觀看期限，正式方案確認後會補上；請以購買時的條款為準。'],
  ['上完之後，我會有一套可以重複使用的方法嗎？還是只記得一堆名詞？', '會。整門課走的是同一套流程：排 → 看 → 判 → 說 → 收。第一堂就先給你這張地圖，之後每個模組都在把其中一步填滿。到了最後一個模組，你會用這套流程把自己寫成一頁，往後換一組生日、或隔半年再看自己，流程都一樣走。課程另附一張 A4 解盤流程卡，可以列印下來放在桌上。'],
  ['我已經看過很多生命數字的內容了，這門課有什麼不一樣？', '多數內容停在「這個數字是什麼意思」。這門課的重點在流程與結構——怎麼把一組生日完整排出來、按什麼順序看、怎麼判斷自己卡在哪一種結構、以及怎麼把看到的東西講成可以執行的一個動作。知道數字的意思是材料，能走完流程才是能力。'],
];

const COURSE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Course',
      '@id': 'https://erickfirm.com/nas/course#course',
      name: '人生的出廠設定',
      description: '生命數字 36 堂，看懂你為什麼一直卡在同一個地方',
      teaches: ['解盤五步（排、看、判、說、收）', '卡點五型辨識', '生命數字三數計算', '雙軌對照', '流年節奏安排'],
      provider: { '@id': 'https://erickfirm.com/#org' },
      instructor: { '@id': 'https://erickfirm.com/#erick' },
      inLanguage: 'zh-TW',
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT9H20M' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://erickfirm.com/nas/course#faq',
      mainEntity: COURSE_FAQS.map(([question, answer]) => ({
        '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

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
      title="人生的出廠設定｜生命數字 36 堂、每堂不到 20 分鐘，約 9 小時 20 分"
      description="生命數字 36 堂，看懂你為什麼一直卡在同一個地方；每堂不到 20 分鐘，總長約 9 小時 20 分。平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。"
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_STRUCTURED_DATA) }} />

    <section className="px-6 pb-16 pt-32">
      <div className="mx-auto max-w-3xl">
        <NASMark label="課程" />
        <h1 className="mb-7 text-3xl font-bold leading-snug md:text-4xl">
          人生的出廠設定
        </h1>
        <p className="mb-4 text-xl font-semibold leading-relaxed text-[#6E6885] md:text-2xl">生命數字 36 堂，看懂你為什麼一直卡在同一個地方</p>
        <p className="mb-4 max-w-2xl leading-loose text-[#55506B]">講師：艾瑞克</p>
        <p className="mb-4 max-w-2xl leading-loose text-[#55506B]">平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。</p>
        <p className="mb-4 max-w-2xl leading-loose text-[#55506B]">數字每曆告訴你今天是什麼天氣。這門課教你怎麼讀它。</p>
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
              <p className="text-sm leading-relaxed text-[#55506B]">{module.description}</p>
              <p className="mt-5 mb-3 text-sm font-semibold text-[#1F1A2E]">你會帶走什麼</p>
              <ul className="space-y-1 text-sm leading-relaxed text-[#55506B]">{module.takeaways.map((line) => <li key={line}>・{line}</li>)}</ul>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-3xl border border-[#D7C9F2] bg-[#FBF9FE] p-7 md:p-10">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#A8883F]">解盤五步</p>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">你會帶走一套流程</h2>
          <p className="mb-8 max-w-3xl leading-loose text-[#55506B]">36 堂課不是 36 個零散的知識點。整門課走的是同一套流程，五個字：排 → 看 → 判 → 說 → 收。第一堂就先把這張地圖給你，之後每一個模組，都是在把其中一步填滿。</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['排', '建檔', '把盤完整排出來。這一步不解讀任何一個數字。'],
              ['看', '定位', '照固定順序看完一輪，先掌握輪廓，再處理細節。'],
              ['判', '找卡點', '三個問句，找出你卡住的結構長在哪裡。'],
              ['說', '開口', '把看到的東西講成人話，最後只給一個動作。'],
              ['收', '收尾', '一句話、一個動作、一個回訪時間點。'],
            ].map(([step, title, description]) => (
              <article key={step} className="rounded-2xl border border-[#E7E3F0] bg-white p-5">
                <p className="text-4xl font-bold leading-none text-[#8B3FA8]">{step}</p>
                <h3 className="mt-4 font-bold text-[#1F1A2E]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#55506B]">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-xs leading-relaxed text-[#918BA6]">學完之後，這五個字是可以重複使用的。換一組生日，流程一樣走；隔半年再看自己，流程也一樣走。</p>
        </section>

        <section className="mt-10 rounded-3xl border border-[#E7E3F0] bg-white p-7 md:p-10">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#A8883F]">卡點辨識</p>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">你一直卡住的，可能是這五種結構之一</h2>
          <p className="mb-7 max-w-3xl leading-loose text-[#55506B]">卡點不是感覺，是結構。課程把常見的卡點收斂成五種型別，每一種在你的盤上都有一個確切的位置。</p>
          <div className="space-y-3">
            {[
              ['落差型', '想的跟做的，不是同一個人'],
              ['斷線型', '功能接不起來，原地內耗'],
              ['過載型', '同一招用到底，用在不該用的地方'],
              ['空缺型', '沒安裝，一遇到就當機'],
              ['錯位型', '在該休息的季節，硬要開工'],
            ].map(([type, appearance]) => (
              <div key={type} className="grid gap-1 rounded-xl bg-[#F7F5FC] px-5 py-4 sm:grid-cols-[9rem_1fr] sm:items-center">
                <p className="font-bold text-[#8B3FA8]">{type}</p>
                <p className="text-sm leading-relaxed text-[#55506B]">{appearance}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-xs leading-relaxed text-[#918BA6]">五種型別分別對應盤上的哪一個位置、怎麼判斷自己屬於哪一型，在課程單元 2-2。</p>
        </section>

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

    <section className="bg-[#F7F5FC] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">常見問題</h2>
        <div className="divide-y divide-[#E7E3F0] border-y border-[#E7E3F0]">
          {COURSE_FAQS.map(([question, answer]) => (
            <article key={question} className="py-6"><h3 className="mb-3 font-bold">{question}</h3><p className="text-sm leading-loose text-[#55506B]">{answer}</p></article>
          ))}
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

    <p className="px-6 pb-12 text-center text-xs leading-relaxed text-[#918BA6]">平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。<br />課程架構與內容為艾瑞克所有，未經授權不得重製、改作或用於商業用途。</p>
  </main>
);

export default NASCourse;
