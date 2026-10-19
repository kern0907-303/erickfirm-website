import path from 'node:path';
import { privacy, terms, LEGAL_ENTITY } from '../src/content/ablLegal.js';
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

function renderDocument(document) {
  const title = document.title + '｜' + LEGAL_ENTITY;
  const url = SITE + '/abl/' + (document === privacy ? 'privacy' : 'terms') + '/';
  const body = '<main class="theme-abl abl-legal-page">' +
    '<header class="abl-legal-hero">' +
    '<a class="abl-legal-back" href="/abl">返回艾伯林量子調頻</a>' +
    '<div class="abl-logo-card"><img src="/brand/abl-logo.png" alt="' + esc(LEGAL_ENTITY) + '" width="500" height="500" class="abl-logo" /></div>' +
    '<p class="abl-legal-brand">' + esc(LEGAL_ENTITY) + '</p>' +
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

for (const document of [privacy, terms]) {
  const route = document === privacy ? '/abl/privacy' : '/abl/terms';
  const output = writePage(dist, route, renderDocument(document));
  console.log('Generated static legal page: ' + route + ' -> ' + output);
}
