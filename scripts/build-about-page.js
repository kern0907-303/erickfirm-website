// 把關於艾瑞克長信預渲染成靜態 HTML，讓搜尋引擎與不執行 JavaScript 的爬蟲讀到全文。
import path from 'node:path';
import { aboutLetter } from '../src/content/aboutLetter.js';
import { LINE_CONFIG } from '../src/lib/constants.js';
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const dist = path.resolve('dist');
const url = SITE + '/about';
const title = '關於艾瑞克｜我做的其實只有一件事，只是換了三種對象';
const description = '二十年來，我做的只有兩個動作：拆解，然後重組順序。生命數字、狀態調和、組織與決策——三個領域，同一件事。';

const cta = (label) => `<p><a href="${esc(LINE_CONFIG.LINE_MESSAGE_URL)}">${esc(label)}</a></p>`;
const sections = aboutLetter.sections.map((section) => [
  '<section>',
  section.heading ? `<h2 id="${esc(section.id)}">${esc(section.heading)}</h2>` : '',
  ...section.blocks.map((block) => `<p>${esc(block)}</p>`),
  section.ctaAfter === 'direction' ? cta('加 LINE，找到適合你的方向') : '',
  section.ctaAfter === 'guide' ? cta('加 LINE，領取《事情卡住的三種樣子》') : '',
  '</section>',
].join('')).join('');

const body = [
  '<article>',
  cta('加 LINE，找到適合你的方向'),
  `<h1>${esc(aboutLetter.title)}</h1>`,
  sections,
  '</article>',
].join('');

const jsonld = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url,
    about: { '@id': PERSON_ID },
  },
  breadcrumb([['首頁', SITE + '/'], ['關於艾瑞克', url]]),
];

writePage(dist, '/about', renderPage(loadShell(dist), {
  title,
  description,
  url,
  image: SITE + '/og-default.png',
  jsonld,
  body,
}));

console.log('Generated static About page: /about');
