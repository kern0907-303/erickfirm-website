// scripts/build-nas-pages.js
// 把 NAS 四頁預渲染成靜態 HTML，讓不執行 JavaScript 的 AI 爬蟲也讀得到。
// 沒有這支之前，/nas、/nas/calculator、/nas/meili、/nas/course 在爬蟲眼中全部是首頁。
// ⚠️ 這裡的文字是各頁內容的忠實摘要。改了頁面文案，記得回來同步，否則爬蟲看到的會跟使用者不一樣。
import path from 'node:path';
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const dist = path.resolve('dist');
const shell = loadShell(dist);
const IMG = `${SITE}/og-default.png`;
const NAS = `${SITE}/nas`;

const p = (t) => `<p>${esc(t)}</p>`;
const h1 = (t) => `<h1>${esc(t)}</h1>`;
const h2 = (t) => `<h2>${esc(t)}</h2>`;
const h3 = (t) => `<h3>${esc(t)}</h3>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const a = (href, t) => `<a href="${href}">${esc(t)}</a>`;
const nav = (links) => `<nav><ul>${links.map(([h, t]) => `<li>${a(h, t)}</li>`).join('')}</ul></nav>`;

const brand = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': `${NAS}#brand`,
  name: '平衡空間 NAS',
  alternateName: ['NAS', '平衡空間'],
  url: NAS,
  logo: `${SITE}/logo-nas.png`,
  description: '艾瑞克的生命數字品牌。用陽曆與陰曆雙軌結構，看懂自己對外的展現與內在真正的需求。',
};

const SOUL = [
  ['1 級', '幼稚園生', '什麼都是新的，靠嘗試和犯錯在學，需要有人陪著。'],
  ['2 級', '小學生', '開始自己探索，需要有人帶著，也需要紀律。'],
  ['3 級', '國中生', '在團體裡找自己，最在意朋友怎麼看你。'],
  ['4 級', '高中生', '開始長出自己的一套想法，會挑戰權威。'],
  ['5 級', '大學生', '往內看，能反省自己的模式，也開始影響別人。'],
  ['6 級', '博士生', '專精在某個領域，把內在的東西真的做出來。'],
  ['7 級', '傑出校友', '很習慣把自己放到最後，力氣大多給了別人。'],
];

const PAGES = [
  {
    route: '/nas',
    title: '生命數字｜你算過很多次，但沒有一次讓你真的改變 - 平衡空間 NAS',
    description: '為什麼你查到的生命數字解析總是有點準又不太像你？那不是算錯。這裡談的是道理都懂、心裡卻有一塊過不去的那種卡住。艾瑞克，二十年生命數字教學。',
    jsonld: [
      brand,
      {
        '@context': 'https://schema.org', '@type': 'WebPage', url: NAS, inLanguage: 'zh-Hant',
        name: '平衡空間 NAS｜生命數字', about: { '@id': `${NAS}#brand` },
        author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID },
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間 NAS', NAS]]),
    ],
    body: [
      h1('你算過很多次，但沒有一次讓你真的改變。'),
      p('你查到的解析總是有點準，又不太像你。那不是算錯——是你跟那段描述，不在同一個位置上。二十年來我看過太多人卡在這裡：不是資訊不夠，是看自己的方式沒換過。'),
      h2('你不是做不到'),
      p('道理你都懂，方法你也試過。卡住的是心裡那一塊怎麼都過不去的地方——然後你開始怪自己不夠堅強。'),
      ul([
        '我知道該把話講開，但每次話到嘴邊就吞回去。',
        '我知道孩子大了該放手，可是他不需要我的時候，我心裡空一塊。',
        '我知道休息不是偷懶，但一停下來就覺得自己沒用。',
      ]),
      p('這不是意志力的問題。是你的道理和你的感受站在兩邊——你一直只聽道理那一邊，另一邊就從來沒被處理過。'),
      h2('你查一下天氣才出門。你的數字也是。'),
      p('主命數是氣候——你的底層設定。數字本身不會換，但它在你身上跑成什麼樣子，是會變的，那正是可以動的地方。流年、流月、流日是天氣，每天都不一樣。'),
      h2('從這裡開始'),
      nav([
        ['/nas/calculator', '生命數字計算：輸入生日，看你的陽曆與陰曆雙軌結構'],
        ['/nas/meili', '數字每曆：每天更新一次的流日'],
        ['/nas/course', '生命數字課程'],
        ['/insights/life-number', '生命數字文章'],
      ]),
    ].join(''),
  },
  {
    route: '/nas/calculator',
    title: '生命數字計算｜輸入生日，看懂你的陽曆與陰曆雙軌結構',
    description: '免費生命數字計算。輸入西元生日，算出主命數與陽曆、陰曆雙軌結構。不只給你一個數字——還告訴你為什麼同樣的數字會長成完全不同的人。艾瑞克，二十年生命數字教學。',
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: '生命數字計算', url: `${NAS}/calculator`, inLanguage: 'zh-Hant',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        provider: { '@id': PERSON_ID }, brand: { '@id': `${NAS}#brand` },
        description: '輸入西元生日，計算主命數與陽曆、陰曆雙軌生命數字結構，並判定靈魂等級。',
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間 NAS', NAS], ['生命數字計算', `${NAS}/calculator`]]),
    ],
    body: [
      h1('輸入生日，看你的雙軌結構'),
      p('三十秒算完，不用留任何資料。陽曆看你對外的展現，陰曆看你內在真正的需求——多數人的卡點，就落在這兩者不一致的地方。'),
      h2('這個計算器算什麼'),
      p('主命數是把西元出生年月日的每一位數字相加、收斂到個位數得到的。它描述的是你這一生最主要會反覆遇到的功課——是題目，不是答案。'),
      p('多數計算器算到這裡就停了。這裡多算兩件事：'),
      ul([
        '陰曆盤——陽曆描述你對外的展現與思考方式，陰曆描述你內在的感受與真正的需求。兩邊不一致的地方，通常就是卡住的地方。',
        '靈魂等級——依先天數、後天數與主命數的有無判定，描述的是你目前在處理哪個階段的功課。',
      ]),
      h3('靈魂等級的七個階段'),
      p('用求學階段來比喻最好懂。級數不是分數，七級不比一級好——就像博士生不會比小學生更厲害，只是在學不一樣的東西。'),
      ul(SOUL.map(([n, s, w]) => `${n}・${s}：${w}`)),
      p('算出來的數字不會決定你是誰。它只告訴你要處理什麼題目——怎麼答，還是你自己的事。'),
      nav([['/nas/meili', '今天的流日數字'], ['/nas', '回到平衡空間 NAS']]),
    ].join(''),
  },
  {
    route: '/nas/meili',
    title: '數字每曆｜每天更新一次的生命數字',
    description: '主命數是氣候，是你的底層設定；流年、流月、流日是天氣，每天都不一樣。數字每曆每天替你更新一次，打開看一眼就知道今天該注意什麼。免費算，訂閱看完整版。',
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Service',
        name: '數字每曆', url: `${NAS}/meili`, inLanguage: 'zh-Hant',
        serviceType: '生命數字每日流日提醒', provider: { '@id': PERSON_ID }, brand: { '@id': `${NAS}#brand` },
        description: '每天更新一次的生命數字。訂閱包含完整的生命數字計算，以及前一天晚上以 LINE 推播明天的流日。',
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間 NAS', NAS], ['數字每曆', `${NAS}/meili`]]),
    ],
    body: [
      h1('你查一下天氣才出門。你的數字也是。'),
      p('每天一曆，每天美麗。'),
      p('主命數是氣候——你的底層設定。數字本身不會換，但它在你身上跑成什麼樣子，是會變的——那正是可以動的地方。流年、流月、流日是天氣——今天會不會下雨，每天都不一樣。'),
      p('多數人只知道自己的氣候，然後穿同一套衣服過每一天：該往前的時候收手，該休息的時候硬撐。那個落差，就是很多人「明明很努力卻一直不對」的原因。'),
      h2('訂閱包含兩件事'),
      h3('一、完整的生命數字計算'),
      ul(['先天數、後天數、強數與缺數', '靈魂等級', '流年、流月、流日', '加入家人、伴侶、同事的生日，把兩個人的盤放在一起看']),
      h3('二、每天的流日推播'),
      p('前一天晚上，明天的流日直接用 LINE 推給你。你有一整個晚上可以重新安排。'),
      h2('方案'),
      ul(['月訂閱 NT$299，一天不到 10 元', '年訂閱 NT$2,880，一天不到 8 元']),
      nav([['/nas/calculator', '先免費算一次'], ['/nas/course', '看課程']]),
    ].join(''),
  },
  {
    route: '/nas/course',
    title: '生命數字課程｜一門課講完，沒有第二階在等你',
    description: '錄播 28 單元，把生命數字的知識一次講完——不分批、不保留、沒有第二階在等你。含學員群組與不定期線上 QA。想更進一步的另有顧問班。艾瑞克，二十年生命數字教學。',
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Course',
        name: '看懂自己的生命數字', url: `${NAS}/course`, inLanguage: 'zh-Hant',
        description: '錄播 28 單元，把生命數字的知識一次講完。圍繞四個問題：我是誰、我為什麼會這樣、我現在在哪裡、我接下來該往哪裡走。',
        provider: { '@id': PERSON_ID }, brand: { '@id': `${NAS}#brand` },
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間 NAS', NAS], ['生命數字課程', `${NAS}/course`]]),
    ],
    body: [
      h1('數字每曆告訴你今天是什麼天氣。這門課教你怎麼讀它。'),
      p('數字每曆會顯示你的流年是 3、你的主命數是 1。但那代表什麼、你該怎麼調——那不是一段說明文字講得完的事。'),
      p('課程圍繞四個問題：我是誰、我為什麼會這樣、我現在在哪裡、我接下來該往哪裡走。'),
      h2('主課：看懂自己的生命數字'),
      p('錄播 28 單元，8–10 小時。把完整的知識與概念交代清楚。一門課講完——不保留、不分批、沒有第二階在等你。'),
      ul(['模組一・生命數字入門（5 單元）', '模組二・十種生命原型（10 單元）', '模組三・自己的內在設定（6 單元）', '模組四・自己的時間節奏（7 單元）']),
      h2('進階：生命數字顧問班'),
      p('6 週直播，看盤演練與解盤實戰。從用在自己身上，到用在別人身上。含一條鐵律：不預測、不恐嚇。'),
      nav([['/nas/calculator', '先免費算一次'], ['/nas/meili', '數字每曆']]),
    ].join(''),
  },
];

for (const page of PAGES) {
  const url = `${SITE}${page.route}`;
  const html = renderPage(shell, { ...page, url, image: IMG });
  writePage(dist, page.route, html);
}
console.log(`Generated ${PAGES.length} static NAS pages: ${PAGES.map((x) => x.route).join(', ')}`);
