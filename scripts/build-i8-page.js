// 把企業醫生診斷預渲染成靜態 HTML，讓不執行 JavaScript 的爬蟲也能讀到服務內容。
import path from 'node:path';
import { SITE, PERSON_ID, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const dist = path.resolve('dist');
const url = SITE + '/i8';
const body = [
  '<article>',
  '<h1>企業最怕的不是問題出現，是一直處理錯問題。</h1>',
  '<p>當你承擔的不只是自己的工作，而是一個團隊、一個部門、一項產品，甚至整家公司，卡住時不一定是誰做得不夠好。企業醫生診斷陪你回到角色、決策、流程與節奏，先找出此刻最值得處理的關鍵因素。</p>',
  '<p>不論你是企業主、高階主管、部門主管，或在高科技與專業組織中承擔關鍵結果的人，都可以從這裡開始。</p>',
  '<h2>不是替組織貼標籤，而是把結構看清楚</h2>',
  '<h3>人力與組織協作</h3><p>看角色是否清楚、事情由誰決定，以及跨部門交接在哪裡失速。</p>',
  '<h3>決策與管理節奏</h3><p>看會議、授權、回看和優先序，是否讓團隊知道現在該處理什麼。</p>',
  '<h3>經營流程與資源配置</h3><p>從獲客、交付到回款，找出哪一段正在消耗團隊；指標要能支持下一個決策。</p>',
  '<h2>從一個真正想處理的問題開始</h2>',
  '<ol><li>先釐清現在卡在哪裡。</li><li>把角色、決策、流程與節奏攤開來看。</li><li>確認最該先處理的結構與下一步。</li></ol>',
  '<p>這不是自動評分工具，也不會用一份表單替你下結論。每個組織的背景不同，診斷以實際經營情境為準。</p>',
  '<p><a href="https://line.me/R/oaMessage/U4744aca9737a23e3b6c3ef5a038cdf4e/?168%5B%E4%BC%81%E6%A5%AD%E9%86%AB%E7%94%9F%E8%A8%BA%E6%96%B7%5D">先說說目前的卡點</a>｜<a href="/insights/enterprise-doctor">先看企業醫生文章</a></p>',
  '</article>',
].join('');

const jsonld = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': url + '#service',
    name: '初八信息顧問 I8｜企業醫生診斷',
    url,
    serviceType: '企業決策與組織協作診斷',
    provider: { '@id': PERSON_ID },
    description: '協助企業主、高階主管與承擔組織結果的管理者，從人力與組織協作、決策與管理節奏、經營流程與資源配置，釐清最該優先處理的卡點。',
  },
  breadcrumb([['首頁', SITE + '/'], ['初八信息顧問 I8', url]]),
];

writePage(dist, '/i8', renderPage(loadShell(dist), {
  title: '企業醫生診斷｜人力與組織協作卡點 - 初八信息顧問 I8',
  description: '當團隊越來越忙、協作卻越來越慢，問題未必在人不夠。初八信息顧問 I8 陪企業主、高階主管與承擔組織結果的人，從組織協作、決策節奏與經營流程找出最該先處理的結構。',
  url,
  image: SITE + '/og-default.png',
  jsonld,
  body,
}));
console.log('Generated static I8 page: /i8');
