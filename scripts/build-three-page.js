// 把《事情卡住的三種樣子》預渲染成靜態 HTML，讓搜尋引擎與不執行 JavaScript 的瀏覽器讀到全文。
import path from 'node:path';
import { stuckReport } from '../src/content/stuckReport.js';
import { LINE_CONFIG } from '../src/lib/constants.js';
import { SITE, PERSON_ID, esc, loadShell, renderPage, writePage, breadcrumb } from './prerender-shell.js';

const dist = path.resolve('dist');
const url = SITE + '/three';
const title = '事情卡住的三種樣子｜艾瑞克';
const description = '卡住不是你的問題，是一個訊號——你現在的看法已經不夠用了。十分鐘，把你卡住的地方拆開看一次。';

const paragraphs = (blocks) => blocks.map((block) => `<p>${esc(block)}</p>`).join('');
const sections = stuckReport.sections.map((section) => [
  `<section${section.id ? ` id="${esc(section.id)}"` : ''}>`,
  section.heading ? `<h2>${esc(section.heading)}</h2>` : '',
  paragraphs(section.blocks),
  ...(section.groups || []).map((group) => `<div><h3>${esc(group.heading)}</h3>${paragraphs(group.blocks)}</div>`),
  ...(section.actions || []).map((action) => `<div><h3>${esc(action.heading)}</h3>${paragraphs(action.blocks)}</div>`),
  section.ctaAfter ? `<p><a href="${esc(LINE_CONFIG.LINE_ADD_URL)}">加入 LINE，或回到對話</a></p>` : '',
  '</section>',
].join('')).join('');

const body = [
  '<article>',
  `<h1>${esc(stuckReport.title)}</h1>`,
  sections,
  '</article>',
].join('');

const jsonld = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: stuckReport.title,
    name: title,
    description,
    url,
    inLanguage: 'zh-Hant',
    author: { '@id': PERSON_ID },
  },
  breadcrumb([['首頁', SITE + '/'], ['事情卡住的三種樣子', url]]),
];

writePage(dist, '/three', renderPage(loadShell(dist), {
  title,
  description,
  url,
  image: SITE + '/og-default.png',
  jsonld,
  body,
}));

console.log('Generated static Three report page: /three');
