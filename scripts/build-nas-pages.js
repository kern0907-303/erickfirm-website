// scripts/build-nas-pages.js
// 把 NAS 五頁預渲染成靜態 HTML，讓不執行 JavaScript 的 AI 爬蟲也讀得到。
// 沒有這支之前，/nas、/nas/calculator、/nas/meili、/nas/course、/nas/consultant 在爬蟲眼中全部是首頁。
// ⚠️ 這裡的文字是各頁內容的忠實摘要。改了頁面文案，記得回來同步，否則爬蟲看到的會跟使用者不一樣。
import fs from 'node:fs';
import path from 'node:path';
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';
import { listPosts } from '../functions/_middleware.js';
import { getPostPath, normalizePosts } from '../src/lib/insights-adapter.js';
import { LEGAL_EMAIL, LEGAL_SELLER_LINE, LEGAL_TAX_ID } from '../src/content/ablLegal.js';
import * as C2027 from '../src/content/abl2027Content.js';
import { NAS_LIFE_NUMBER_COPY as LIFE_NUMBER_COPY } from '../src/content/nasLifeNumberCopy.js';

const dist = path.resolve('dist');
const shell = loadShell(dist);
const IMG = `${SITE}/og-default.png`;
const NAS = `${SITE}/nas`;
const ORG_ID = `${SITE}/#org`;
const SOCIALS = [
  'https://www.facebook.com/NAS448',
  'https://www.instagram.com/noagespace/',
  'https://www.youtube.com/@ageoldnew9449',
  'https://www.threads.net/@koi54889101',
];
const ORGANIZATION = {
  '@type': 'Organization', '@id': ORG_ID, name: '平衡空間', alternateName: 'No Age Space',
  url: SITE, logo: `${SITE}/logo-nas.png`, sameAs: SOCIALS,
};
const p = (t) => `<p>${esc(t)}</p>`;
const h1 = (t) => `<h1>${esc(t)}</h1>`;
const h2 = (t) => `<h2>${esc(t)}</h2>`;
const h3 = (t) => `<h3>${esc(t)}</h3>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const a = (href, t, attrs = '') => `<a href="${href}"${attrs ? ` ${attrs}` : ''}>${esc(t)}</a>`;
const nav = (links) => `<nav><ul>${links.map(([h, t]) => `<li>${a(h, t)}</li>`).join('')}</ul></nav>`;

const brand = { ...ORGANIZATION, '@context': 'https://schema.org' };
const ablLegalFooter = '<div class="abl-legal-footer"><p>' + esc(LEGAL_SELLER_LINE + '　統一編號 ' + LEGAL_TAX_ID + '　' + LEGAL_EMAIL) + '</p><nav aria-label="法務資訊"><a href="/abl/terms">服務條款</a><a href="/abl/privacy">隱私權政策</a></nav></div>';

const SOUL = [
  ['1 級', '幼稚園生', '什麼都是新的，靠嘗試和犯錯在學，需要有人陪著。'],
  ['2 級', '小學生', '開始自己探索，需要有人帶著，也需要紀律。'],
  ['3 級', '國中生', '在團體裡找自己，最在意朋友怎麼看你。'],
  ['4 級', '高中生', '開始長出自己的一套想法，會挑戰權威。'],
  ['5 級', '大學生', '往內看，能反省自己的模式，也開始影響別人。'],
  ['6 級', '博士生', '專精在某個領域，把內在的東西真的做出來。'],
  ['7 級', '傑出校友', '很習慣把自己放到最後，力氣大多給了別人。'],
];

const COURSE_MODULES = [
  { title: '模組零：先把眼睛換掉', unitCount: '5 堂', duration: '74 分', free: true, description: '先處理那個最常見的疑問：明明已經很努力，為什麼事情還是卡在原地。用生日資料當作觀察自己的入口，分清楚生命設定與後天反應，不急著替自己下結論。你會先換一個看自己的角度，知道這門課不預測、不算命。', takeaways: ['一套看自己的新角度', '知道這門課不預測、不算命'] },
  { title: '模組一：你的出廠設定', unitCount: '9 堂', duration: '135 分', description: '把一組生日拆成陽曆與陰曆兩條軌道，理解白天的你與晚上的你為何常常不一樣。從數字出現的位置與次數，看見你的生命原型、缺少的支撐，以及反覆使用的慣性。你會得到一張比較完整的自我地圖。', takeaways: ['讀懂自己的兩軌', '認得十種生命原型', '找出自己缺什麼、多什麼'] },
  { title: '模組二：你卡在哪裡', unitCount: '10 堂', duration: '161 分', description: '你不是做不到，是心裡有一塊過不去。這個模組把「我知道該怎麼做卻做不到」拆開來看：你的卡點不是情緒，是結構，而且在盤上有一個確切的位置。課程把常見卡點收斂成五種型別——落差、斷線、過載、空缺、錯位——並教你判斷自己現在最吃力的是哪一型。同時處理原生家庭、感情表達、四階與生命功課等級。', takeaways: ['在自己的盤上指出卡點的位置', '看懂自己愛人與表達的方式'] },
  { title: '模組三：你的時間感', unitCount: '7 堂', duration: '110 分', description: '努力不一定發生在對的時間，這個模組把流年、流月、流日放回人生節奏裡。你會知道自己現在走到哪一段，也知道遇到壞天氣時如何安排，不把每一天都當成硬撐的考驗，不必急著證明自己。', takeaways: ['知道自己現在走到哪一段', '壞天氣時知道怎麼安排，不硬撐'] },
  { title: '模組四：把它用起來', unitCount: '5 堂', duration: '82 分', description: '學完最怕的是看過就忘，所以把理解整理成一頁，變成之後可以反覆回來使用的工具。排出未來十二個月，把數字每曆放進每天的選擇，不只在計算完成那天覺得有趣，還能照自己的節奏安排下一步。', takeaways: ['把自己寫成一頁', '排出未來十二個月', '每天會用數字每曆'] },
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

const faqSchema = (id, items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage', '@id': id,
  mainEntity: items.map(([question, answer]) => ({
    '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

const CONSULTANT_FAQS = [
  ['我沒有相關背景，可以學嗎？', '可以。入學條件是完成主課；主課會先把生命數字的看法、結構與語言基礎交代清楚。'],
  ['跟主課差在哪？', '主課是看懂自己，顧問班是學會幫別人看。兩者是分流，不是深淺。'],
  ['沒辦法每週出席怎麼辦？', '每週直播會提供回放，但現場實作無法補，報名前請先評估自己的時間。'],
  ['結業後一定能接案嗎？', '不一定。課程給的是能力、流程與工具，接案取決於個人投入；本課程不做收入或客源保證。'],
  ['這個認證是什麼性質？', '這是艾瑞克個人的結業認證，不是政府或第三方機構的證照。'],
];

const FEATURED_UNITS = [
  ['你不是不夠努力，是兩個你在拉扯', '看見道理與感受同時拉扯時，卡住不等於不夠努力。'],
  ['如果你的人生可以被算準，那才是壞消息', '數字描述要處理的題目，不替你把答案寫死。'],
  ['白天的你和晚上的你，不是同一個人', '用雙軌看見對外展現與內在需求的落差。'],
  ['你以為的個性，可能是被要求出來的', '分清楚主命設定與後天適應怎麼一起作用。'],
  ['重複出現的不是人，是互動模式', '從關係裡辨認反覆發生的互動結構。'],
  ['壞天氣不用硬撐，但要知道自己在哪一種天氣裡', '先辨認流日狀態，再安排今天的動作。'],
];

const CONSULTANT_WEEKS = [
  ['第 1 週', '讀盤：從自己的盤，到一個你不認識的人（解盤五步的顧問版）', '30 分鐘內講出一個人的主線'],
  ['第 2 週', '問診：他說的問題，通常不是真正的問題', '提問，找到真正的卡點'],
  ['第 3 週', '說法：同一個結論，七種講法', '依生命功課等級調整說法，並守住語言界線'],
  ['第 4 週', '兩個人的盤', '伴侶、親子、合夥的雙人解讀'],
  ['第 5 週', '時間盤：幫別人排節奏', '排出未來十二個月，只談安排不談預測'],
  ['第 6 週', '開業：把解盤變成一個可以收費的服務', '服務流程、報告、定價、第一批個案'],
];

const COURSE_BODY = [
  h1('人生的出廠設定'),
  h2('生命數字 36 堂，看懂你為什麼一直卡在同一個地方'),
  p('講師：艾瑞克'),
  p('平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。'),
  p('數字每曆告訴你今天是什麼天氣。這門課教你怎麼讀它。'),
  p('主課共 36 堂、每堂不到 20 分鐘，五個模組，總長約 9 小時 20 分，從看懂自己的生命設定開始，走到能把數字每曆讀進每天的選擇。'),
  p('課程圍繞四個問題：我是誰、我為什麼會這樣、我現在在哪裡、我接下來該往哪裡走。'),
  h2('每天 18 分鐘：一天一堂，一個多月看完'),
  p('36 堂／每堂 ≤18 分鐘／總長 9 小時 20 分。每一堂都控制在 18 分鐘以內，通勤、午休、睡前都放得進去；一天一堂，36 天看完。'),
  h2('主課架構：五個模組，公開看結構'),
  ...COURSE_MODULES.flatMap((module) => [
    h3(`${module.title}｜${module.unitCount}｜${module.duration}${module.free ? '｜免費試看' : ''}`),
    p(`這個模組在解決什麼：${module.description}`),
    ul(module.takeaways.map((item) => `你會帶走：${item}`)),
  ]),
  h2('你會帶走一套流程'),
  p('36 堂課不是 36 個零散的知識點。整門課走的是同一套流程，五個字：排 → 看 → 判 → 說 → 收。第一堂就先把這張地圖給你，之後每一個模組，都是在把其中一步填滿。'),
  ul(['排｜建檔｜把盤完整排出來。這一步不解讀任何一個數字。', '看｜定位｜照固定順序看完一輪，先掌握輪廓，再處理細節。', '判｜找卡點｜三個問句，找出你卡住的結構長在哪裡。', '說｜開口｜把看到的東西講成人話，最後只給一個動作。', '收｜收尾｜一句話、一個動作、一個回訪時間點。']),
  p('學完之後，這五個字是可以重複使用的。換一組生日，流程一樣走；隔半年再看自己，流程也一樣走。'),
  h2('你一直卡住的，可能是這五種結構之一'),
  p('卡點不是感覺，是結構。課程把常見的卡點收斂成五種型別，每一種在你的盤上都有一個確切的位置。'),
  ul(['落差型｜想的跟做的，不是同一個人', '斷線型｜功能接不起來，原地內耗', '過載型｜同一招用到底，用在不該用的地方', '空缺型｜沒安裝，一遇到就當機', '錯位型｜在該休息的季節，硬要開工']),
  p('五種型別分別對應盤上的哪一個位置、怎麼判斷自己屬於哪一型，在課程單元 2-2。'),
  h2('課程中的其中 6 堂'),
  ...FEATURED_UNITS.flatMap(([title, description]) => [h3(title), p(description)]),
  h2('索取完整課綱'),
  p('完整 36 堂課綱與時長，填寫姓名與 Email 後取得 PDF。總長約 9 小時 20 分，每堂不到 20 分鐘。'),
  a('/downloads/nas-course-outline.pdf', '下載完整課綱 PDF', 'rel="nofollow"'),
  h2('常見問題'),
  ...COURSE_FAQS.flatMap(([question, answer]) => [h3(question), p(answer)]),
  h2('主課方案'),
  p('同一套系統，過去實體三階共 48 小時、NT$54,000；現在核心濃縮成 36 單元錄播，NT$9,800。'),
  p('不到兩次一對一解盤的價錢，學會自己看一輩子。'),
  ul([
    '自學｜主課 36 單元｜NT$9,800',
    '陪跑（推薦）｜主課＋實踐營一梯｜NT$14,800',
    '深度｜主課＋實踐營＋艾瑞克一對一 60 分鐘｜NT$19,800（每梯限 5 名）',
  ]),
  p('自學：一天一堂，36 天看完。'),
  p('陪跑：再加主課價的一半，多 4 週陪你做。'),
  h3('實踐營：4 週線上小班'),
  p('每週一次 90 分鐘直播（有回放），每梯上限 30 人，每季開一梯，期間有 LINE 群答疑，每週一份作業並在直播中公開講評。'),
  ul(['① 讀懂自己的盤', '② 找出卡點與衝突線', '③ 排出未來十二個月', '④ 把自己寫成一頁、學會看數字每曆']),
  p('退費條款：〔待確認後補上〕'),
  h2('分流／轉職：生命數字顧問班'),
  p('主課是看懂自己，顧問班是學會幫別人看。兩者是分流，不是深淺。學費 NT$32,000，含第一年顧問會員（價值 NT$12,000）。第一屆預計 2027 年 6–7 月開班。'),
  a('/nas/consultant', '了解顧問班完整內容'),
  p('平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。課程架構與內容為艾瑞克所有，未經授權不得重製、改作或用於商業用途。'),
  nav([['/nas/calculator/', '先免費算一次'], ['/nas/meili', '數字每曆']]),
].join('');

const CONSULTANT_BODY = [
  h1('生命數字顧問班：主課是看懂自己，顧問班是學會幫別人看。'),
  p('講師：艾瑞克'),
  p('平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。'),
  p('這不是把主課再講深一點，而是把你已經看懂的結構，練成一套能用在別人身上的解盤服務。兩者是分流，不是深淺。'),
  h2('這門課適合誰？'),
  h3('適合'),
  ul([
    '已完成主課，想把解盤變成一項可以收費的服務',
    '諮詢、教練、療癒、命理、人資等助人工作者，想多一項工具',
    '想從現在的工作分流，發展第二條路',
  ]),
  h3('不適合'),
  ul(['只想更了解自己（請留在主課）', '還沒完成主課', '想要一套照本宣科的話術']),
  h2('六週課程結構'),
  ul(CONSULTANT_WEEKS.map(([week, topic, ability]) => `${week}｜${topic}｜${ability}`)),
  p('主課教的解盤五步（排 → 看 → 判 → 說 → 收）是自用版，用在自己身上沒有時間壓力。顧問班第 1 週把它換成顧問版：加上時間控制、加上問診、加上依對方狀態分級的說法——同一套骨架，面對陌生人時的走法不一樣。'),
  h2('時間結構'),
  p('6 週／每週一次直播 3 小時／共 18 小時。每週固定一個晚上，六週結束。不必辭職、不用請假。'),
  h2('上課方式'),
  p('每週一次線上直播 3 小時，教學與實作各半；第一屆限收 10 人，每個人都會被輪到當場實作、當場修正。有回放，但現場實作無法補。'),
  h2('你會帶走什麼'),
  p('一套可以重複使用的解盤流程；一組讓你不踩線的說話原則；一份可以直接對外收費的服務設計。'),
  h2('索取顧問班詳細說明'),
  p('填寫姓名、Email 與主課完成狀態，取得顧問班詳細版 PDF。'),
  a('/downloads/nas-consultant-details.pdf', '下載顧問班詳細說明 PDF', 'rel="nofollow"'),
  h2('結業認證，怎麼取得？'),
  ul([
    '結業後依課程要求完成個案報告，由艾瑞克審核。',
    '通過即取得艾瑞克的結業認證、列入認證顧問名錄、啟用第一年顧問會員。',
    '未通過可補做，不另外收費。',
    '這是艾瑞克個人的結業認證，不是政府或第三方機構的證照。',
  ]),
  h2('認證之後：顧問會員'),
  p('學費含第一年顧問會員（價值 NT$12,000），第二年起年費 NT$12,000。'),
  p('會員權益：每月個案督導、每季深化課、認證顧問名錄刊登、每月公開解盤夜上台機會、數字每曆顧問專屬連結、內容工具（每月 30 次額度）。這些是讓顧問被看見的工具；艾瑞克不轉介個案，不提供客源保證。'),
  h2('報名資訊'),
  p('學費 NT$32,000，含第一年顧問會員。入學條件：完成主課，並於登記時交一份「幫身邊一個人看盤」的作業。'),
  p('目前為意向登記制，第一屆預計 2027 年 6–7 月開班，限收 10 人。不放直接付款按鈕。送出資料後，名額有限，開班前會依登記順序與入學作業安排面談或通知。'),
  h2('常見問題'),
  ...CONSULTANT_FAQS.flatMap(([question, answer]) => [h3(question), p(answer)]),
  p('平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。課程架構與內容為艾瑞克所有，未經授權不得重製、改作或用於商業用途。'),
  nav([['/nas/course', '回看主課內容'], ['/nas', '回到平衡空間']]),
].join('');

const PAGES = [
  {
    route: '/nas',
    title: '生命數字｜你算過很多次，但沒有一次讓你真的改變 - 平衡空間',
    description: '為什麼你查到的生命數字解析總是有點準又不太像你？那不是算錯。這裡談的是道理都懂、心裡卻有一塊過不去的那種卡住。艾瑞克，二十年生命數字教學。',
    jsonld: [
      brand,
      {
        '@context': 'https://schema.org', '@type': 'WebPage', url: NAS, inLanguage: 'zh-Hant',
        name: '平衡空間｜生命數字', about: { '@id': ORG_ID },
        author: { '@id': PERSON_ID }, publisher: { '@id': PERSON_ID },
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間', NAS]]),
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
        ['/nas/calculator/', '生命數字計算：查看陽曆與陰曆雙軌、流年流月與今日流日'],
        ['/nas/meili', '數字每曆：每天更新一次的流日'],
        ['/nas/course', '人生的出廠設定'],
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
        name: '生命數字計算', url: `${NAS}/calculator/`, inLanguage: 'zh-Hant',
        applicationCategory: 'UtilityApplication', operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
        provider: { '@id': ORG_ID }, brand: { '@id': ORG_ID },
        description: '輸入西元生日，計算主命數、陽曆與陰曆雙軌、生命功課等級、流年、流月與今日流日。',
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間', NAS], ['生命數字計算', `${NAS}/calculator/`]]),
    ],
    body: [
      h1('輸入生日，看你的雙軌結構'),
      p('免費計算，不需註冊或提交 Email。生日會送往計算服務，並保存在這台瀏覽器，供數字每曆讀取；想收每月流月信，再自行填寫訂閱資料。陽曆看你對外的展現，陰曆看你內在真正的需求——多數人的卡點，就落在這兩者不一致的地方。'),
      h2('這個計算器算什麼'),
      p(LIFE_NUMBER_COPY.mainNumberDefinition),
      p('多數計算器算到這裡就停了。這裡還會呈現陽曆與陰曆的落差、生命功課等級，以及依生日計算的流年、流月與今日流日：'),
      ul([
        '陰曆盤——陽曆描述你對外的展現與思考方式，陰曆描述你內在的感受與真正的需求。兩邊不一致的地方，通常就是卡住的地方。',
        '生命功課等級——依先天數、後天數與主命數的有無判定，描述的是你目前在處理哪個階段的功課。',
        '流年、流月、流日——依陽曆生日逐日計算；加入陰曆盤時，也會顯示陰曆流日。',
      ]),
      h3('生命功課等級的七個階段'),
      p('用求學階段來比喻最好懂。級數不是分數，七級不比一級好——就像博士生不會比小學生更厲害，只是在學不一樣的東西。'),
      ul(SOUL.map(([n, s, w]) => `${n}・${s}：${w}`)),
      p('算出來的數字不會決定你是誰。它只告訴你要處理什麼題目——怎麼答，還是你自己的事。'),
      h2('本次流月與今日提醒'),
      p(LIFE_NUMBER_COPY.monthlyTurnRule),
      p('計算完成後會顯示當前流年、個人流月與換期日期，以及今天的陽曆流日；若有陰曆盤，也會顯示陰曆流日。'),
      h2('每月流月信'),
      p('計算完成後，可選擇填寫姓名、Email 與目前想整理的主題，勾選同意後訂閱。每封信涵蓋即將開始的完整流月，並提供退訂方式。'),
      h2('為什麼看生命數字'),
      p(LIFE_NUMBER_COPY.stuck),
      p(LIFE_NUMBER_COPY.positioning),
      h2('平衡空間與艾瑞克'),
      p(LIFE_NUMBER_COPY.brand),
      h2('下一步'),
      h3('2027 流年報告'),
      p(LIFE_NUMBER_COPY.annualReport),
      h3('主課'),
      p(LIFE_NUMBER_COPY.course),
      a('/nas/course', '查看生命數字主課'),
      h3('一對一'),
      p(LIFE_NUMBER_COPY.oneToOne),
      a('/nas/course', '查看課程與一對一資訊'),
      nav([['/nas/meili', '數字每曆'], ['/nas', '回到平衡空間']]),
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
        serviceType: '生命數字每日流日提醒', provider: { '@id': ORG_ID }, brand: { '@id': ORG_ID },
        description: '每天更新一次的生命數字。訂閱包含完整的生命數字計算，以及前一天晚上以 LINE 推播明天的流日。',
      },
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間', NAS], ['數字每曆', `${NAS}/meili`]]),
    ],
    body: [
      h1('你查一下天氣才出門。你的數字也是。'),
      p('每天一曆，每天美麗。'),
      p('主命數是氣候——你的底層設定。數字本身不會換，但它在你身上跑成什麼樣子，是會變的——那正是可以動的地方。流年、流月、流日是天氣——今天會不會下雨，每天都不一樣。'),
      p('多數人只知道自己的氣候，然後穿同一套衣服過每一天：該往前的時候收手，該休息的時候硬撐。那個落差，就是很多人「明明很努力卻一直不對」的原因。'),
      h2('訂閱包含兩件事'),
      h3('一、完整的生命數字計算'),
      ul(['先天數、後天數、強數與缺數', '生命功課等級', '流年、流月、流日', '加入家人、伴侶、同事的生日，把兩個人的盤放在一起看']),
      h3('二、每天的流日推播'),
      p('前一天晚上，明天的流日直接用 LINE 推給你。你有一整個晚上可以重新安排。'),
      h2('方案'),
      ul(['月訂閱 NT$299，一天不到 10 元', '年訂閱 NT$2,880，一天不到 8 元']),
      nav([['/nas/calculator/', '先免費算一次'], ['/nas/course', '看課程']]),
    ].join(''),
  },
  {
    route: '/nas/course',
    title: '人生的出廠設定｜生命數字 36 堂、每堂不到 20 分鐘，約 9 小時 20 分 - 平衡空間',
    description: '生命數字 36 堂，看懂你為什麼一直卡在同一個地方；每堂不到 20 分鐘，總長約 9 小時 20 分。平衡空間（No Age Space）的生命數字課程，由艾瑞克主講。',
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Course',
        '@id': `${NAS}/course#course`, name: '人生的出廠設定', url: `${NAS}/course`, inLanguage: 'zh-TW',
        description: '生命數字 36 堂，看懂你為什麼一直卡在同一個地方',
        teaches: ['解盤五步（排、看、判、說、收）', '卡點五型辨識', '生命數字三數計算', '雙軌對照', '流年節奏安排'],
        provider: { '@id': ORG_ID }, instructor: { '@id': PERSON_ID },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT9H20M' },
      },
      faqSchema(`${NAS}/course#faq`, COURSE_FAQS),
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間', NAS], ['人生的出廠設定', `${NAS}/course`]]),
    ],
    body: COURSE_BODY,
  },
  {
    route: '/nas/consultant',
    title: '生命數字顧問班｜學會幫別人看盤 - 平衡空間',
    description: '生命數字顧問班給想把解盤變成服務的人。六週線上直播，從讀盤、問診、說法到服務流程；完成主課後以意向登記報名，第一屆預計 2027 年 6–7 月開班。',
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Course',
        '@id': `${NAS}/consultant#course`, name: '生命數字顧問班', url: `${NAS}/consultant`, inLanguage: 'zh-TW',
        description: '給想幫別人看盤的人。六週線上直播，從讀盤、問診、說法到服務流程；主課與顧問班是分流，不是深淺。',
        provider: { '@id': ORG_ID }, instructor: { '@id': PERSON_ID }, courseWorkload: 'PT18H',
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT18H' },
        offers: { '@type': 'Offer', price: '32000', priceCurrency: 'TWD' },
      },
      faqSchema(`${NAS}/consultant#faq`, CONSULTANT_FAQS),
      breadcrumb([['首頁', `${SITE}/`], ['平衡空間', NAS], ['生命數字顧問班', `${NAS}/consultant`]]),
    ],
    body: CONSULTANT_BODY,
  },
];

for (const page of PAGES) {
  const url = `${SITE}${page.route}`;
  const html = renderPage(shell, { ...page, url, image: IMG });
  writePage(dist, page.route, html);
}
console.log(`Generated ${PAGES.length} static NAS pages: ${PAGES.map((x) => x.route).join(', ')}`);

const ABL_TITLE = '艾伯林量子調頻｜最近我到底怎麼了';
const ABL_DESCRIPTION = '努力很久，狀態卻回不來。艾伯林量子調頻從你現在的狀態開始看，先找到力氣從哪裡漏掉，再決定調整什麼。';
const sortByDate = (items) => [...items].sort((a, b) => (
  new Date(b.publishDate || b.publish_date || b.createdAt || b.created_at || 0).getTime()
  - new Date(a.publishDate || a.publish_date || a.createdAt || a.created_at || 0).getTime()
));
const getAblPosts = (items) => sortByDate(
  normalizePosts(items || [], 'zh-TW').filter((post) => post.service === 'personal-growth')
).slice(0, 6);

let ablPosts = [];
try {
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (key) {
    const rawPosts = await listPosts({ SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_KEY: key }, 'zh-TW');
    ablPosts = getAblPosts(rawPosts);
  }
} catch (error) {
  console.warn(`  ⚠ 讀不到 ABL 文章清單（${error.message}），改用備援文章`);
}
if (!ablPosts.length) {
  const fallback = JSON.parse(fs.readFileSync(path.resolve('src/data/insights.fallback.json'), 'utf8'));
  ablPosts = getAblPosts(fallback.posts || []);
}

const ablArticleLinks = ablPosts.map((post) => `<li><a href="${esc(getPostPath(post))}/">${esc(post.title)}</a></li>`).join('');
const ablLogoPath = path.resolve('public/brand/abl-logo.png');
const ablLogo = fs.existsSync(ablLogoPath)
  ? '<img src="/brand/abl-logo.png" alt="艾伯林量子調頻" width="500" height="500" loading="eager" class="abl-logo">'
  : '<span class="abl-logo-text">艾伯林量子調頻</span>';
const ablBody = [
  `<div class="theme-abl"><section class="bg-[#fbfaf7] px-6 pb-20 pt-32 md:pb-28 md:pt-40"><div class="mx-auto max-w-5xl"><div class="mb-7 h-[72px]">${ablLogo}</div><h1 class="abl-heading text-4xl font-bold leading-tight text-slate-900 md:text-6xl">最近我到底怎麼了</h1><p class="abl-heading mt-7 max-w-3xl text-base leading-loose text-slate-600 md:text-xl">艾伯林量子調頻，從你現在的狀態開始看，陪你把長期撐住的狀態，慢慢調回來。</p></div></section>`,
  h2('艾伯林量子調頻在看什麼'),
  p('同一件事，狀態不同，走出來的結果就不同。'),
  p('想做的事能不能走得下去，常常取決於現在的狀態。'),
  p('所以我們先看這個：你現在的狀態，在哪裡。'),
  h2('你可能正在這樣'),
  h3('活得很努力，卻看不到未來'),
  p('每天都在做該做的事，往前看，卻看不清楚路。'),
  h3('一直以來都沒有不好，總覺得可以更好'),
  p('沒有出大問題，也說不出哪裡不對，只是知道自己還有空間。'),
  h3('休完假還是累，是老了，還是提不起勁'),
  p('睡也睡了，假也放了，力氣卻沒有回來。'),
  p('你一路扛起來的角色，是你自己認可的，也是你自己願意扛的。'),
  p('只是扛得久了，身體和狀態開始出現訊號。'),
  p('這些訊號是身體在說話，值得被好好理解。'),
  h2('訊號值得被理解'),
  p('訊號可以被處理，但它為什麼會出現，常常不是單一原因。'),
  p('我們從多個角度、多個層次，把你當成一個完整的人來看。'),
  h2('我們怎麼看這件事'),
  h3('先看現在的狀態'),
  p('先把你現在的樣子看清楚，再談下一步。'),
  h3('找到力氣從哪裡漏掉'),
  p('是長期撐著，是反覆出現的模式，還是環境與關係裡的消耗。'),
  h3('再決定調整什麼'),
  p('看清楚了，才知道哪裡值得調，哪裡先維持原樣。'),
  p('這樣的時刻，你也有過。先加 LINE，我們從你現在的狀態開始。'),
  a('https://lin.ee/STdLXx4', '加 LINE', 'target="_blank" rel="noopener noreferrer" class="abl-cta"'),
  h2('持續更新的文章'),
  ablArticleLinks ? `<ul>${ablArticleLinks}</ul>` : '',
  a('/insights/personal-growth', '看全部文章'),
  nav([['/i8', '初八企業顧問'], ['/nas', '平衡空間'], ['/abl', '艾伯林量子調頻，目前所在頁']]),
  p('年度頻率支持 即將開放'),
  p('空間調頻 即將開放'),
  p('2027 年度導航 即將開放'),
  a('/about', '認識艾瑞克'),
  p('艾伯林量子調頻提供的是狀態理解與支持，不是醫療、診斷或療效保證。'),
  ablLegalFooter,
  '</div>',
].join('');

const ABL_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}/abl#service`,
    name: '艾伯林量子調頻',
    url: `${SITE}/abl`,
    provider: { '@id': `${SITE}/#erick` },
    serviceType: 'Personal State Support',
    description: ABL_DESCRIPTION,
    areaServed: 'TW',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE}/abl`,
    name: ABL_TITLE,
    url: `${SITE}/abl`,
    inLanguage: 'zh-Hant',
    about: { '@id': `${SITE}/abl#service` },
  },
  breadcrumb([['首頁', `${SITE}/`], ['艾伯林量子調頻', `${SITE}/abl`]]),
];
const ablHtml = renderPage(shell, {
  title: ABL_TITLE,
  description: ABL_DESCRIPTION,
  url: `${SITE}/abl`,
  image: IMG,
  jsonld: ABL_JSONLD,
  body: ablBody,
});
writePage(dist, '/abl', ablHtml);
console.log(`Generated static ABL page: /abl (${ablPosts.length} article links available)`);

const SALES_LOGO_PATH = path.resolve('public/brand/abl-logo.png');
const SALES_LOGO = fs.existsSync(SALES_LOGO_PATH)
  ? '<img src="/brand/abl-logo.png" alt="" width="500" height="500" loading="eager" class="abl-logo">'
  : '<span class="abl-logo-text">艾伯林量子調頻</span>';
const salesP = (text) => `<p>${esc(text)}</p>`;
const salesH2 = (text) => `<h2 class="abl-heading">${esc(text)}</h2>`;
const salesCard = (inner, extraClass = '') => `<article class="abl-card abl-sales-card${extraClass ? ` ${extraClass}` : ''}">${inner}</article>`;
const salesHero = (title, subtitle, anchor, action) => `
  <section class="abl-hero abl-sales-hero"><div class="abl-sales-container">
    <a class="abl-sales-top-link" href="/abl">艾伯林量子調頻</a>
    <div class="abl-logo-card">${SALES_LOGO}</div>
    <h1 class="abl-heading abl-sales-title">${esc(title)}</h1>
    <p class="abl-sales-subtitle">${esc(subtitle)}</p>
    <a class="abl-cta abl-sales-scroll" href="#${anchor}">${esc(action)}</a>
  </div></section>`;
const salesSection = (heading, inner, id = '', extraClass = '') =>
  `<section${id ? ` id="${id}"` : ''} class="abl-sales-section${extraClass ? ` ${extraClass}` : ''}"><div class="abl-sales-inner">${salesH2(heading)}${inner}</div></section>`;
const salesGrid = (items, className) => `<div class="abl-sales-grid ${className}">${items.join('')}</div>`;
const salesFaqs = (items) => `<div class="abl-sales-faqs">${items.map(([question, answer]) =>
  `<details class="abl-sales-faq" open><summary>${esc(question)}</summary>${salesP(answer)}</details>`).join('')}</div>`;
const salesEnding = (text) => `
  <section class="abl-sales-ending"><div class="abl-sales-inner abl-sales-ending-inner">
    ${salesP(text)}<a class="abl-cta abl-sales-line" href="https://lin.ee/STdLXx4" target="_blank" rel="noopener noreferrer">加 LINE，開放時通知我</a>
  </div></section>`;
const salesDisclaimer = (text) => `<footer class="abl-sales-disclaimer">${esc(text)}</footer>`;

const focusBlock = (item) => `<p class="abl-sales-theme-goal">${esc(item.goal)}</p>
  <details class="abl-sales-seasons-wrap" open><summary>頻率焦點與四季檢視</summary>
  <p class="abl-sales-subhead">${esc(C2027.FOCUS_TITLE)}<small>${esc(C2027.FOCUS_HINT)}</small></p>
  <ol class="abl-sales-focus">${item.focus.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
  <p class="abl-sales-subhead">${esc(C2027.CHECK_TITLE)}<small>${esc(C2027.CHECK_HINT)}</small></p>
  <ul class="abl-sales-seasons">${item.checks.map(([season, title, question]) => `<li><b>${esc(season)}　${esc(title)}</b><span>${esc(question)}</span></li>`).join('')}</ul></details>`;
const soon = '<p class="abl-sales-soon">十一月陸續開放</p>';
const planCard = (name, price, lines) => salesCard(`<h3 class="abl-heading">${esc(name)}<span class="abl-sales-price">${esc(price)} <small>/ 年</small></span></h3><div class="abl-sales-copy">${lines.map(salesP).join('')}</div>${soon}`);
const sales2027Body = () => [
  '<div class="theme-abl abl-sales-page">',
  salesHero('今年，把狀態穩在你想要的地方', '艾伯林量子調頻 2027 年度頻率支持，一整年的背景支持，一季一季陪你往前走。', 'how-to-buy', '看怎麼購買'),
  salesSection('買了會得到什麼', `<div class="abl-sales-copy">${salesP('一整年的背景支持，從付款確認當天起算，共 365 天。')}${C2027.INTRO.map(salesP).join('')}</div>`),
  salesSection('怎麼購買，四步就完成', `<ol class="abl-sales-steps">${C2027.BUY_STEPS.map(([t, b], i) => `<li class="abl-sales-step"><span class="abl-sales-step-no">${i + 1}</span><h3>${esc(t)}</h3>${salesP(b)}</li>`).join('')}</ol>${salesP('結帳按鈕在下面每個方案的卡片裡。還沒開放的方案，卡片上會寫「十一月陸續開放」，開放後按鈕會自己出現在同一個位置。').replace('<p>', '<p class="abl-sales-note">')}`, 'how-to-buy', 'abl-sales-section-muted'),
  salesSection('選哪一種', `<div class="abl-sales-diff"><ul>${C2027.PLAN_DIFF.map(([n, b]) => `<li><strong>${esc(n)}</strong><span>${esc(b)}</span></li>`).join('')}</ul>${salesP(C2027.PLAN_DIFF_NOTE)}</div>${salesGrid([
    planCard('團體年度頻率', 'NT$990', ['一群人，共享同一個頻率。', '2027 共同主題：穩定承接。在變動裡穩住自己，讓真正適合你的關係、機會與資源，有空間進來。', '包含：共同年度主題，整合成一年的組合頻率，每季一則檢視提醒。']),
    planCard('個人年度頻率　單一主題', 'NT$2,200', ['從下面六個主題選一個，頻率單獨為你設定、單獨發送。', '包含：一個年度主題，整合成一年的組合頻率，每季一則檢視提醒。']),
    planCard('個人年度頻率　雙主題', 'NT$3,980', ['從下面六個主題選兩個，兩個頻率各自單獨為你設定、單獨發送。', '包含：兩個年度主題，各自整合成組合頻率，每季一則檢視提醒，涵蓋兩個主題。']),
  ], 'abl-sales-grid-plans')}`, 'support-options'),
  salesSection('團體 2027 年度頻率', salesCard(`<h3 class="abl-heading">${esc(C2027.GROUP.name)}</h3><p class="abl-sales-theme-line">${esc(C2027.GROUP.line)}</p>${focusBlock(C2027.GROUP)}`, 'abl-sales-theme'), '', 'abl-sales-section-muted'),
  salesSection('個人六個年度主題', `<p class="abl-sales-lead">選一個，或選兩個。每個主題有四個焦點，整合成一年的組合頻率，再加上四個每季檢視點。</p>${salesGrid(C2027.THEMES.map((t) => salesCard(`<h3 class="abl-heading"><span class="abl-sales-theme-icon" aria-hidden="true">${t.icon}</span>${esc(t.name)}</h3><p class="abl-sales-theme-line">${esc(t.line)}</p><p class="abl-sales-theme-fit">${esc(t.fit)}</p>${focusBlock(t)}`, 'abl-sales-theme')), 'abl-sales-grid-two')}`),
  salesSection('常見問題', salesFaqs(C2027.FAQS), '', 'abl-sales-section-muted'),
  `<section class="abl-sales-ending"><div class="abl-sales-inner abl-sales-ending-inner"><h2 class="abl-heading">選好了，就從方案卡片開始</h2>${salesP('購買的入口是每個方案卡片裡的「前往結帳」。還沒開放的方案，開放時我們會在官方 LINE 通知你。也可以先加官方 LINE，問我們該選哪一種。')}<div class="abl-sales-ending-actions"><a class="abl-cta abl-sales-scroll" href="#support-options">回到選方案</a><a class="abl-cta abl-sales-line" href="https://lin.ee/STdLXx4" target="_blank" rel="noopener noreferrer">加官方 LINE，開放時通知我</a></div></div></section>`,
  salesDisclaimer('頻率支持不是醫療、診斷或療效保證。'),
  ablLegalFooter,
  '</div>',
].join('');

const SALES_PAGES = [
  {
    route: '/abl/2027',
    title: '艾伯林量子調頻｜2027 年度頻率支持',
    description: '2027 年度頻率支持，團體共享頻率，或個人單獨設定，一整年的背景支持，每季一則 LINE 檢視提醒。',
    body: sales2027Body(),
    noindex: false,
  },
  {
    route: '/abl/space',
    title: '艾伯林量子調頻｜空間調頻',
    description: '空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式，一年內分階段回看與調整。',
    body: [
      '<div class="theme-abl abl-sales-page">',
      salesHero('把每天所在的空間，慢慢調成你需要的樣子', '艾伯林量子調頻 空間調頻，一個地址，一整年，分階段回看與調整。', 'space-year', '看一年怎麼走'),
      salesSection('這是什麼', `<div class="abl-sales-copy">${salesP('空間調頻看的是一個地址的空間狀態，以及人在其中的使用方式。')}${salesP('第一輪適用居家、SOHO、個人工作室。大型商業空間目前不在第一輪範圍。')}</div>`),
      salesSection('一年怎麼走', `<ol class="abl-sales-timeline">${[
        '第 0 天　建立空間基準', '第 30 天　第一次回看', '第 60 天　第二次調整', '第 90 天　建立新的基準',
        '第 180 天　半年檢視', '第 270 天　再校準', '第 360 天　年度回顧',
      ].map((stage) => `<li class="abl-card abl-sales-card">${esc(stage)}</li>`).join('')}</ol>`, 'space-year', 'abl-sales-section-muted'),
      salesSection('每次回看，只回答四件事', `<ul class="abl-sales-four-items">${[
        '哪裡有改變', '哪裡維持住', '哪裡又偏掉', '下一階段調整什麼',
      ].map((item) => `<li class="abl-card abl-sales-card">${esc(item)}</li>`).join('')}</ul>`),
      salesSection('方案', salesCard(`<h3 class="abl-heading">空間調頻　NT$8,800 / 年 / 一個地址</h3><div class="abl-sales-copy">${salesP('適用：居家、SOHO、個人工作室。')}${salesP('一個方案對應一個地址。')}</div>`, 'abl-sales-space-plan'), '', 'abl-sales-section-muted'),
      salesSection('常見問題', salesFaqs([
        ['哪些空間適用？', '第一輪適用居家、SOHO、個人工作室。大型商業空間目前不在第一輪範圍。'],
        ['一個方案可以用在幾個地址？', '一個方案對應一個地址。'],
        ['空間調頻和個人年度頻率有什麼不同？', '個人年度頻率支持的是你自己的狀態，空間調頻看的是一個地址的空間。兩者可以分開選擇。'],
      ])),
      salesEnding('想先確認你的空間適不適合，先加 LINE，我們一起看。'),
      salesDisclaimer('空間調頻提供的是空間狀態的整理與支持，不是醫療、診斷或療效保證。'),
      ablLegalFooter,
      '</div>',
    ].join(''),
    noindex: true,
  },
];

for (const page of SALES_PAGES) {
  const html = renderPage(shell, { ...page, url: `${SITE}${page.route}`, image: IMG });
  writePage(dist, page.route, html);
  console.log(`Generated static ABL sales page: ${page.route}`);
}
