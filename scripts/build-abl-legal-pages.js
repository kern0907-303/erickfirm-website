import path from 'node:path';
import { privacy, terms, LEGAL_BRAND } from '../src/content/ablLegal.js';
import { NAS_LEGAL_BRAND, nasPrivacy, nasTerms } from '../src/content/nasLegal.js';
import { SITE, esc, loadShell, renderPage, writePage } from './prerender-shell.js';

const dist = path.resolve('dist');
const shell = loadShell(dist);
const inlineText = (value) => esc(value);

function renderBlock(block) {
  if (block.type === 'p') return '<p>' + inlineText(block.text) + '</p>';
  if (block.type === 'ul') {
    return '<ul>' + block.items.map((item) => '<li>' + inlineText(item) + '</li>').join('') + '</ul>';
  }
  if (block.type === 'card') {
    return '<address class="abl-legal-contact-card"><p>' +
      inlineText(block.entity + ' / 統一編號 ' + block.taxId + ' / ' + block.email + ' / ') +
      '<a href="' + esc(block.lineUrl) + '" target="_blank" rel="noopener noreferrer">' +
      inlineText(block.lineLabel) + '</a></p></address>';
  }
  return '';
}

const BRANDS = {
  abl: { name: LEGAL_BRAND, home: '/abl', back: '返回艾伯林量子調頻', logo: '/brand/abl-logo.png', mainClass: 'theme-abl abl-legal-page' },
  nas: { name: NAS_LEGAL_BRAND, home: '/nas', back: '返回平衡空間', logo: '/logo-nas.png', mainClass: 'theme-abl theme-nas-2027 abl-legal-page nas-legal-page' },
};

function renderDocument(document, route, brandKey = 'abl') {
  const brand = BRANDS[brandKey];
  const title = document.title + '｜' + brand.name;
  const url = SITE + route + '/';
  const body = '<main class="' + brand.mainClass + '">' +
    '<header class="abl-legal-hero">' +
    '<a class="abl-legal-back" href="' + brand.home + '">' + esc(brand.back) + '</a>' +
    '<div class="abl-logo-card"><img src="' + brand.logo + '" alt="' + esc(brand.name) + '" width="500" height="500" class="abl-logo" /></div>' +
    '<p class="abl-legal-brand">' + esc(brand.name) + '</p>' +
    '<h1 class="abl-heading abl-legal-title">' + esc(document.title) + '</h1>' +
    '<p class="abl-legal-updated">最後更新：' + esc(document.lastUpdated) + '</p>' +
    '</header><article class="abl-legal-content">' +
    '<p>' + esc(document.intro) + '</p>' +
    document.sections.map((section) =>
      '<section class="abl-legal-section"><h2 class="abl-heading">' + esc(section.title) + '</h2>' +
      '<div class="abl-legal-blocks">' + section.blocks.map(renderBlock).join('') + '</div></section>'
    ).join('') +
    '</article></main>';
  return renderPage(shell, {
    title,
    description: document.description,
    url,
    body,
  });
}

const PAGES = [
  [privacy, '/abl/privacy', 'abl'],
  [terms, '/abl/terms', 'abl'],
  [nasPrivacy, '/nas/privacy', 'nas'],
  [nasTerms, '/nas/terms', 'nas'],
];

for (const [document, route, brandKey] of PAGES) {
  const output = writePage(dist, route, renderDocument(document, route, brandKey));
  console.log('Generated static legal page: ' + route + ' -> ' + output);
}
